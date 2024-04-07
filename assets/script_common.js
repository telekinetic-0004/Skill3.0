const web3Script = document.createElement('script');
web3Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.6.0/web3.min.js';
web3Script.async = false; // Load synchronously to ensure Web3 is available before further execution
document.head.appendChild(web3Script);

document.addEventListener('DOMContentLoaded', async function() {
    // Function to enable MetaMask connection
    async function connectWallet() {
        try {
            // Check if MetaMask is installed
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed or not detected');
            }

            // Request account access from MetaMask
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];
            console.log("The connected user address is:", userAddress);

            // Redirect to home.html with the desired URL parameters if not already on home.html
            if (!window.location.href.includes('home.html')) {
                const userType = new URLSearchParams(window.location.search).get('type');
                window.location.href = `home.html?type=${userType}`;
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            if (error.code === 4001) {
                alert('Connect request rejected by user. Please approve the request to continue.');
            } else {
                alert('An error occurred while connecting to MetaMask: ' + error.message);
            }
        }
    }

    // Call connectWallet function when the page loads
    connectWallet();
});
