// DirectTip Bridge Script (Injected into page context)
console.log("DirectTip Bridge: Active");

const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Mainnet USDC
const CREATOR_WALLET_DEFAULT = 'ExvF4uXnJ3mXJ9XpXpXpXpXpXpXpXpXpXpXpXpXp'; // Placeholder

window.addEventListener('message', async (event) => {
    if (event.source !== window) return;
    const { type, amount, token, creatorWallet } = event.data;

    if (type === 'DT_CONNECT_WALLET') {
        try {
            const resp = await window.solana.connect();
            window.postMessage({ 
                type: 'DT_WALLET_CONNECTED', 
                payload: { address: resp.publicKey.toString() } 
            }, '*');
        } catch (err) {
            window.postMessage({ type: 'DT_ERROR', payload: { message: "User rejected connection" } }, '*');
        }
    }

    if (type === 'DT_SEND_TIP') {
        try {
            if (!window.solana.isConnected) {
                await window.solana.connect();
            }

            const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
            const fromPubkey = window.solana.publicKey;
            const toPubkey = new solanaWeb3.PublicKey(creatorWallet || CREATOR_WALLET_DEFAULT);
            
            let transaction = new solanaWeb3.Transaction();

            if (token === 'SOL') {
                transaction.add(
                    solanaWeb3.SystemProgram.transfer({
                        fromPubkey,
                        toPubkey,
                        lamports: amount * solanaWeb3.LAMPORTS_PER_SOL,
                    })
                );
            } else if (token === 'USDC') {
                // Simplified USDC transfer (requires SPL library or manual instruction)
                // For MVP, we'll focus on SOL or provide a basic SPL instruction
                // Note: SPL Token transfer is more complex without the spl-token library
                window.postMessage({ type: 'DT_ERROR', payload: { message: "USDC support coming soon in next update!" } }, '*');
                return;
            }

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;

            const signed = await window.solana.signTransaction(transaction);
            const signature = await connection.sendRawTransaction(signed.serialize());

            window.postMessage({ 
                type: 'DT_TIP_PENDING', 
                payload: { signature, amount, token } 
            }, '*');

            // Wait for confirmation
            await connection.confirmTransaction(signature);

            // Report to backend
            try {
                await fetch('http://localhost:3000/api/tips', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        signature,
                        amount,
                        token,
                        creatorWallet: creatorWallet || CREATOR_WALLET_DEFAULT,
                        senderWallet: fromPubkey.toString(),
                        streamUrl: window.location.href
                    })
                });
            } catch (apiErr) {
                console.warn("Could not report tip to backend:", apiErr);
            }

            window.postMessage({ 
                type: 'DT_TIP_CONFIRMED', 
                payload: { signature, amount, token } 
            }, '*');

        } catch (err) {
            console.error("DirectTip Error:", err);
            window.postMessage({ type: 'DT_ERROR', payload: { message: err.message } }, '*');
        }
    }
});
