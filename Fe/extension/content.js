// DirectTip Content Script
console.log("DirectTip: Initializing Floating Icon Flow...");

const OVERLAY_HTML = `
<div id="direct-tip-overlay">
    <div class="dt-card" id="dt-main-card">
        <div class="dt-header">
            <div class="dt-logo"></div>
            <div class="dt-title">DIRECT TIP PRO</div>
            <div id="dt-close-btn" style="margin-left: auto; cursor: pointer; opacity: 0.5;">✕</div>
        </div>

        <div class="dt-tabs">
            <div class="dt-tab active" data-tab="tip">Send Tip</div>
            <div class="dt-tab" data-tab="history">Recent</div>
        </div>
        
        <div id="tab-tip" class="tab-content">
            <div id="dt-wallet-section">
                <button class="dt-btn" id="dt-connect-btn" style="width: 100%">Connect Phantom</button>
            </div>

            <div id="dt-tip-section" class="hidden">
                <div class="dt-token-grid">
                    <div class="dt-token-option active" data-token="SOL">
                        <div class="dt-token-icon">◎</div>
                        <div class="dt-token-label">SOL</div>
                    </div>
                    <div class="dt-token-option" data-token="USDC">
                        <div class="dt-token-icon">S</div>
                        <div class="dt-token-label">USDC</div>
                    </div>
                </div>

                <div class="dt-input-group">
                    <input type="number" class="dt-input" id="dt-amount" placeholder="Amount" step="0.1" min="0.01">
                    <button class="dt-btn" id="dt-send-btn">Confirm Tip</button>
                </div>
                <div style="margin-top: 12px; font-size: 11px; color: var(--text-dim); display: flex; justify-content: space-between;">
                    <span>Wallet: <span id="dt-wallet-addr" style="color: var(--solana-green);"></span></span>
                    <span id="dt-balance" style="opacity: 0.7;"></span>
                </div>
            </div>
        </div>

        <div id="tab-history" class="tab-content hidden">
            <div id="dt-history-list" style="max-height: 200px; overflow-y: auto; font-size: 11px; color: var(--text-dim);">
                No recent tips found.
            </div>
        </div>
    </div>

    <div id="dt-toggle-icon">◎</div>
    <div id="dt-live-feed"></div>
</div>
`;

let selectedToken = 'SOL';

function injectOverlay() {
    if (document.getElementById('direct-tip-overlay')) return;
    const container = document.createElement('div');
    container.innerHTML = OVERLAY_HTML;
    document.body.appendChild(container);
    setupEventListeners();
}

function setupEventListeners() {
    const toggleIcon = document.getElementById('dt-toggle-icon');
    const mainCard = document.getElementById('dt-main-card');
    const closeBtn = document.getElementById('dt-close-btn');

    toggleIcon.addEventListener('click', () => {
        mainCard.classList.toggle('show');
        if (mainCard.classList.contains('show')) {
            toggleIcon.style.opacity = '0';
            toggleIcon.style.pointerEvents = 'none';
        }
    });

    closeBtn.addEventListener('click', () => {
        mainCard.classList.remove('show');
        toggleIcon.style.opacity = '1';
        toggleIcon.style.pointerEvents = 'auto';
    });

    // Tab Switching
    document.querySelectorAll('.dt-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.dt-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            document.getElementById(`tab-${target}`).classList.remove('hidden');
        });
    });

    // Token Selection
    document.querySelectorAll('.dt-token-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.dt-token-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            selectedToken = opt.dataset.token;
            document.getElementById('dt-amount').placeholder = `Amount (${selectedToken})`;
        });
    });

    document.getElementById('dt-connect-btn').addEventListener('click', () => {
        window.postMessage({ type: 'DT_CONNECT_WALLET' }, '*');
    });

    document.getElementById('dt-send-btn').addEventListener('click', () => {
        const amount = document.getElementById('dt-amount').value;
        if (!amount || amount <= 0) return alert("Please enter a valid amount");
        
        chrome.storage.local.get(['creatorWallet'], (data) => {
            if (!data.creatorWallet) {
                return alert("Please configure the creator wallet in the extension popup first!");
            }
            
            window.postMessage({ 
                type: 'DT_SEND_TIP', 
                amount: parseFloat(amount),
                token: selectedToken,
                creatorWallet: data.creatorWallet
            }, '*');
        });
    });
}

window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const { type, payload } = event.data;

    switch (type) {
        case 'DT_WALLET_CONNECTED':
            document.getElementById('dt-wallet-section').classList.add('hidden');
            document.getElementById('dt-tip-section').classList.remove('hidden');
            document.getElementById('dt-wallet-addr').innerText = payload.address.slice(0, 4) + '...' + payload.address.slice(-4);
            break;
            
        case 'DT_TIP_PENDING':
            addFeedEvent('Tipping ' + payload.amount + ' ' + payload.token + '...', 'pending', payload.signature);
            break;
            
        case 'DT_TIP_CONFIRMED':
            updateFeedEvent(payload.signature, 'Tip Confirmed! 🎉', 'confirmed');
            addToHistory(payload);
            break;

        case 'DT_ERROR':
            alert("Error: " + payload.message);
            break;
    }
});

function addFeedEvent(text, status, signature) {
    const feed = document.getElementById('dt-live-feed');
    const event = document.createElement('div');
    event.className = `dt-event dt-card ${status}`;
    event.id = `dt-ev-${signature}`;
    event.innerHTML = `
        <div>${text}</div>
        <a href="https://solscan.io/tx/${signature}" target="_blank" class="dt-explorer-link">View Tx</a>
    `;
    feed.prepend(event);
}

function updateFeedEvent(signature, text, status) {
    const event = document.getElementById(`dt-ev-${signature}`);
    if (event) {
        event.className = `dt-event dt-card ${status} dt-confirmed-pulse`;
        event.querySelector('div').innerText = text;
        setTimeout(() => event.remove(), 10000);
    }
}

function addToHistory(tip) {
    const list = document.getElementById('dt-history-list');
    if (list.innerText.includes('No recent tips')) list.innerHTML = '';
    
    const entry = document.createElement('div');
    entry.style.cssText = 'padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between;';
    entry.innerHTML = `
        <span>${tip.amount} ${tip.token}</span>
        <span style="color: var(--solana-green);">Confirmed</span>
    `;
    list.prepend(entry);
}

function injectBridge() {
    const libScript = document.createElement('script');
    libScript.src = chrome.runtime.getURL('lib/solana-web3.min.js');
    (document.head || document.documentElement).appendChild(libScript);

    const bridgeScript = document.createElement('script');
    bridgeScript.src = chrome.runtime.getURL('bridge.js');
    (document.head || document.documentElement).appendChild(bridgeScript);
}

// Inject Send Tip button next to YouTube subscribe button
function injectYouTubeButton() {
    // Find the subscribe button
    const subscribeBtn = document.querySelector('ytd-subscribe-button-renderer button, yt-formatted-string[aria-label*="Subscribe"]')?.closest('button');
    
    if (!subscribeBtn || document.getElementById('dt-youtube-btn')) return;
    
    const tipsBtn = document.createElement('button');
    tipsBtn.id = 'dt-youtube-btn';
    tipsBtn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px; padding: 0 12px; height: 36px; background: linear-gradient(135deg, #9945FF, #14F195); border: none; border-radius: 20px; cursor: pointer; font-weight: 600; color: #000; font-size: 14px;">
            <span>💎</span>
            <span>Send Tip</span>
        </div>
    `;
    
    tipsBtn.addEventListener('click', () => {
        document.getElementById('dt-toggle-icon')?.click();
    });
    
    subscribeBtn.parentNode?.insertBefore(tipsBtn, subscribeBtn.nextSibling);
}

setInterval(() => {
    if (window.location.href.includes('watch?v=')) {
        injectOverlay();
        injectYouTubeButton();
    }
}, 2000);

injectBridge();
