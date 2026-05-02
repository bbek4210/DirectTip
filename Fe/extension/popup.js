document.addEventListener('DOMContentLoaded', () => {
    const syncBox = document.getElementById('sync-box');
    const syncText = document.getElementById('sync-text');
    const userInfo = document.getElementById('user-info');
    const walletVal = document.getElementById('wallet-val');
    const roleTag = document.getElementById('role-tag');
    const dashBtn = document.getElementById('dash-btn');

    // Load saved settings
    chrome.storage.local.get(['userDetails'], (data) => {
        if (data.userDetails) {
            const { walletAddress, role } = data.userDetails;
            
            syncBox.classList.remove('not-synced');
            syncText.innerText = 'Account Synced';
            
            userInfo.style.display = 'block';
            walletVal.innerText = walletAddress.slice(0, 10) + '...' + walletAddress.slice(-10);
            roleTag.innerText = role;
            roleTag.style.background = role === 'creator' ? '#14F195' : '#9945FF';
            roleTag.style.color = role === 'creator' ? 'black' : 'white';
        }
    });

    dashBtn.addEventListener('click', () => {
        window.open('http://localhost:3000/dashboard', '_blank');
    });

    document.getElementById('sync-btn').addEventListener('click', () => {
        window.open('http://localhost:3000/register', '_blank');
    });
});
