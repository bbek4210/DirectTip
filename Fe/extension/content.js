// DirectTip Content Script
console.log("DirectTip: Initializing Premium Flow...");

const API_BASE_URL = 'http://localhost:5000/api';

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
                <div id="dt-creator-info" style="margin-bottom: 12px; padding: 10px; border-radius: 8px; background: rgba(20,241,149,0.05); border: 1px solid rgba(20,241,149,0.1);">
                    <div style="font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px;">Recipient</div>
                    <div id="dt-creator-name" style="font-weight: bold; color: var(--solana-green); font-size: 14px;">Detecting...</div>
                    <div id="dt-creator-wallet" style="font-size: 9px; color: var(--text-dim); overflow: hidden; text-overflow: ellipsis;"></div>
                </div>

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
                    <span>My Wallet: <span id="dt-user-wallet" style="color: var(--solana-purple);"></span></span>
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
let currentCreatorWallet = null;

function injectOverlay() {
    if (document.getElementById('direct-tip-overlay')) return;
    const container = document.createElement('div');
    container.innerHTML = OVERLAY_HTML;
    document.body.appendChild(container);
    setupEventListeners();
    detectCreator();
}

async function detectCreator() {
    // Try to find the channel ID from the page
    let channelId = null;
    
    // Method 1: Check meta tags
    const metaChannel = document.querySelector('meta[itemprop="channelId"]');
    if (metaChannel) channelId = metaChannel.content;

    // Method 2: Check links
    if (!channelId) {
        const channelLink = document.querySelector('ytd-video-owner-renderer a.yt-simple-endpoint');
        if (channelLink) {
            const parts = channelLink.href.split('/');
            channelId = parts[parts.length - 1];
        }
    }

    if (channelId) {
        console.log("DirectTip: Detected Channel ID:", channelId);
        try {
            const res = await fetch(`${API_BASE_URL}/creator/${channelId}`);
            const data = await res.json();
            if (data.creator) {
                currentCreatorWallet = data.creator.walletAddress;
                document.getElementById('dt-creator-name').innerText = "Verified Creator";
                document.getElementById('dt-creator-wallet').innerText = currentCreatorWallet;
                document.getElementById('dt-send-btn').disabled = false;
            } else {
                document.getElementById('dt-creator-name').innerText = "Creator Not Registered";
                document.getElementById('dt-creator-wallet').innerText = "Tips cannot be sent yet.";
                document.getElementById('dt-send-btn').disabled = true;
            }
        } catch (err) {
            console.error("DirectTip: Error fetching creator:", err);
        }
    }
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
        
        if (!currentCreatorWallet) {
            return alert("Creator wallet not detected for this channel.");
        }
        
        window.postMessage({ 
            type: 'DT_SEND_TIP', 
            amount: parseFloat(amount),
            token: selectedToken,
            creatorWallet: currentCreatorWallet
        }, '*');
    });
}

// Sync Listener from Website
window.addEventListener('DIRECTTIP_SYNC', (event) => {
    const details = event.detail;
    chrome.storage.local.set({ userDetails: details }, () => {
        console.log("DirectTip: Sync successful", details);
    });
});

window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    const { type, payload } = event.data;

    switch (type) {
        case 'DT_WALLET_CONNECTED':
            document.getElementById('dt-wallet-section').classList.add('hidden');
            document.getElementById('dt-tip-section').classList.remove('hidden');
            document.getElementById('dt-user-wallet').innerText = payload.address.slice(0, 4) + '...' + payload.address.slice(-4);
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

function injectYouTubeButton() {
    const subscribeBtn = document.querySelector('ytd-subscribe-button-renderer button, yt-formatted-string[aria-label*="Subscribe"]')?.closest('button');
    
    if (!subscribeBtn || document.getElementById('dt-youtube-btn')) return;
    
    const tipsBtn = document.createElement('button');
    tipsBtn.id = 'dt-youtube-btn';
    tipsBtn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px; padding: 0 12px; height: 36px; background: linear-gradient(135deg, #9945FF, #14F195); border: none; border-radius: 20px; cursor: pointer; font-weight: 600; color: #000; font-size: 14px; margin-left: 8px;">
            <span>💎</span>
            <span>Send Tip</span>
        </div>
    `;
    
    tipsBtn.addEventListener('click', () => {
        const toggleIcon = document.getElementById('dt-toggle-icon');
        if (toggleIcon) toggleIcon.click();
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
