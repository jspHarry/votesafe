// scripts/verify-connection.js
const { ethers } = require("hardhat");

async function main() {
  try {
    // Get the deployed contract address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    console.log("Attempting to connect to contract at:", contractAddress);

    // Get the contract factory
    const PollFactory = await ethers.getContractFactory("PollFactory");
    console.log("Got contract factory");
    
    // Connect to the deployed contract
    const contract = PollFactory.attach(contractAddress);
    console.log("Connected to contract");
    
    // Check if the contract has the getAllPolls function
    console.log("Available contract methods:", Object.keys(contract.interface.functions));
    
    // Try to call getAllPolls
    console.log("Attempting to call getAllPolls...");
    try {
      const allPolls = await contract.getAllPolls();
      console.log("Success! Got poll addresses:", allPolls);
    } catch (error) {
      console.error("Error calling getAllPolls:", error.message);
      
      // Check if the contract exists at that address
      const provider = ethers.provider;
      const code = await provider.getCode(contractAddress);
      if (code === "0x") {
        console.error("No contract exists at the specified address!");
      } else {
        console.log("Contract exists at the address, but call failed. Code size:", code.length);
      }
    }
  } catch (error) {
    console.error("Error in verification script:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 