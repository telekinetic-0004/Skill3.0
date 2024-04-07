// Load the Web3 library from CDN
const web3Script = document.createElement('script');
web3Script.src = 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.6.0/web3.min.js';
web3Script.async = false; // Load synchronously to ensure Web3 is available before further execution
document.head.appendChild(web3Script);

async function displaySkillsAndPrograms() {
    try {
        // Initialize web3
        const web3 = new Web3(window.ethereum);

        // Fetch contract address from config.json
        const response = await fetch('../assets/config.json');
        const config = await response.json();
        const contractAddress = config.contractAddress;
        const contractABI = config.abi;

        // Initialize the contract instance with the ABI and contract address
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

        // Retrieve the individual's address from MetaMask
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const individualAddress = accounts[0];

        // Retrieve acquired skills and enrolled programs for individualAddress from the smart contract
        const acquiredSkills = await contractInstance.methods.skillHolders(individualAddress).call();
        const financialAssets = acquiredSkills.financialAssets;
        const acquiredPrograms = Object.keys(financialAssets);
        const skills = {};
        for (const academicInstitutionAddress of acquiredPrograms) {
            const academicInstitution = await contractInstance.methods.academicInstitutions(academicInstitutionAddress).call();
            const acquiredSkills = await contractInstance.methods.skillHolders(individualAddress).call();
            skills[academicInstitution.program] = Object.keys(acquiredSkills.acquiredSkills[academicInstitutionAddress]);
        }

        // Display the retrieved data
        const userAddressSpan = document.getElementById('userAddress');
        if (userAddressSpan) {
            userAddressSpan.textContent = individualAddress;
        } else {
            console.error("Span with id 'userAddress' not found in the DOM.");
        }

        const userTypeSpan = document.getElementById('userType');
        if (userTypeSpan) {
            // Display acquired programs and skills
            let displayText = '';
            for (const program of acquiredPrograms) {
                displayText += `Program: ${program}\n`;
                const programSkills = skills[program];
                if (programSkills.length > 0) {
                    displayText += `Skills: ${programSkills.join(', ')}\n`;
                }
                displayText += '\n';
            }
            userTypeSpan.textContent = displayText || 'No programs enrolled';
        } else {
            console.error("Span with id 'userType' not found in the DOM.");
        }
    } catch (error) {
        console.error('Error retrieving skills and programs:', error);
        alert('Error retrieving skills and programs. Please try again.');
    }
}

// Call the displaySkillsAndPrograms function when the page loads
window.addEventListener('load', displaySkillsAndPrograms);
