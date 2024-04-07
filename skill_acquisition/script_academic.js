// Load the Web3 library from CDN
const web3Script = document.createElement('script');
web3Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.6.0/web3.min.js';
web3Script.async = false; // Load synchronously to ensure Web3 is available before further execution
document.head.appendChild(web3Script);

document.addEventListener('DOMContentLoaded', async function() {
    // Function to handle form submission
    document.getElementById('acquisitionForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        try {
            // Get input values
            const individualAddress = document.getElementById('individualAddress').value;
            const skillName = document.getElementById('skillName').value;

            // Initialize Web3
            const web3 = new Web3(window.ethereum);

            // Fetch contract address and ABI from config.json
            const response = await fetch('../assets/config.json');
            const config = await response.json();
            const contractAddress = config.contractAddress;
            const contractABI = config.abi;

            // Initialize the contract instance with the ABI and contract address
            const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

            // Get the academician's address from MetaMask
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const academicInstitutionAddress = accounts[0]; // Get the academician's MetaMask address

            // Call the acquireSkill function in the smart contract
            const result = await contractInstance.methods.acquireSkill(individualAddress, academicInstitutionAddress, skillName).send({ from: academicInstitutionAddress });

            // Display success message
            document.getElementById('acquisitionMessage').textContent = 'Skill acquisition successful!';
        } catch (error) {
            // Display error message
            console.error('Error acquiring skill:', error);
            document.getElementById('acquisitionMessage').textContent = 'Error acquiring skill. Please try again.';
        }
    });
});
