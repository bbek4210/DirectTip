document.addEventListener('DOMContentLoaded', () => {
    const walletInput = document.getElementById('creator-wallet');
    const streamInput = document.getElementById('stream-url');
    const saveBtn = document.getElementById('save-btn');
    const status = document.getElementById('status');

    // Load saved settings
    chrome.storage.local.get(['creatorWallet', 'streamUrl'], (data) => {
        if (data.creatorWallet) walletInput.value = data.creatorWallet;
        if (data.streamUrl) streamInput.value = data.streamUrl;
    });

    saveBtn.addEventListener('click', () => {
        const creatorWallet = walletInput.value.trim();
        const streamUrl = streamInput.value.trim();

        if (!creatorWallet) {
            alert("Wallet address is required!");
            return;
        }

        chrome.storage.local.set({ creatorWallet, streamUrl }, () => {
            status.style.display = 'block';
            setTimeout(() => {
                status.style.display = 'none';
            }, 2000);
        });
    });
});
