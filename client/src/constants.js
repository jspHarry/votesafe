// src/constants.js
import PollFactoryABI from "../../contracts/artifacts/contracts/PollFactory.sol/PollFactory.json";

// Log the imported ABI for debugging
console.log("Imported ABI:", PollFactoryABI);

// Check if we have a valid ABI from the import
let contractAbi;
try {
  if (PollFactoryABI && PollFactoryABI.abi) {
    contractAbi = PollFactoryABI.abi;
    console.log("ABI loaded successfully with", contractAbi.length, "entries");
    
    // Verify getAllPolls exists
    const getAllPolls = contractAbi.find(entry => 
      entry.type === "function" && entry.name === "getAllPolls"
    );
    if (getAllPolls) {
      console.log("getAllPolls function found in ABI");
    } else {
      console.error("WARNING: getAllPolls function not found in ABI!");
    }
  } else {
    console.error("Invalid ABI format from import:", PollFactoryABI);
    // Define a fallback ABI with common functions
    contractAbi = [
      {
        "inputs": [],
        "name": "getAllPolls",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_title",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_description",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "_options",
            "type": "string[]"
          },
          {
            "internalType": "uint256",
            "name": "_startTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_endTime",
            "type": "uint256"
          }
        ],
        "name": "createPoll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
    console.log("Using fallback ABI");
  }
} catch (error) {
  console.error("Error processing ABI:", error);
  contractAbi = [];
}

// Update with the newly deployed contract address
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


export const CONTRACT_ABI = contractAbi;
