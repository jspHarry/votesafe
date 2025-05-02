// scripts/simple-deploy.js
const hre = require("hardhat");

async function main() {
  try {
    console.log("Deploying PollFactory contract...");
    
    // Get the ContractFactory
    const PollFactory = await hre.ethers.getContractFactory("PollFactory");
    
    // Deploy the contract
    const pollFactory = await PollFactory.deploy();
    
    // Wait for deployment
    await pollFactory.waitForDeployment();
    
    // Get the contract address
    const contractAddress = await pollFactory.getAddress();
    console.log("PollFactory deployed to:", contractAddress);
    
    // Create a sample poll for testing
    console.log("Creating a test poll...");
    const tx = await pollFactory.createPoll(
      "Test Poll",
      "This is a test poll",
      ["Option 1", "Option 2", "Option 3"],
      Math.floor(Date.now() / 1000),
      Math.floor(Date.now() / 1000) + 3600
    );
    
    // Wait for the transaction to be mined
    await tx.wait();
    console.log("Test poll created successfully");
    
    // Call getAllPolls to verify it works
    console.log("Testing getAllPolls function...");
    const allPolls = await pollFactory.getAllPolls();
    console.log("Polls:", allPolls);
    
    console.log("\n----- IMPORTANT -----");
    console.log("Update your CONTRACT_ADDRESS in client/src/constants.js to:");
    console.log(contractAddress);
    console.log("---------------------\n");
    
    return contractAddress;
  } catch (error) {
    console.error("Deployment error:", error);
    throw error;
  }
}

main()
  .then((address) => {
    console.log("Deployment complete. Contract address:", address);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  }); 