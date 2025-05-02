// scripts/verify-new-contract.js
const { ethers } = require("hardhat");

async function main() {
  try {
    // Get the deployed contract address
    const contractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    console.log("Attempting to connect to contract at:", contractAddress);

    // Get the contract factory
    const PollFactory = await ethers.getContractFactory("PollFactory");
    console.log("Got contract factory");
    
    // Connect to the deployed contract
    const contract = PollFactory.attach(contractAddress);
    console.log("Connected to contract");
    
    // Try to call getAllPolls
    console.log("Attempting to call getAllPolls...");
    const allPolls = await contract.getAllPolls();
    console.log("Success! Got poll addresses:", allPolls);
    
    // Try to create a new poll
    console.log("Creating a new poll...");
    const tx = await contract.createPoll(
      "Verification Poll",
      "Poll created during verification",
      ["Yes", "No", "Maybe"],
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 3600
    );
    await tx.wait();
    console.log("New poll created successfully");
    
    // Check polls again to confirm the new one was added
    const updatedPolls = await contract.getAllPolls();
    console.log("Updated poll list:", updatedPolls);
    console.log("Poll count:", updatedPolls.length);
    
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