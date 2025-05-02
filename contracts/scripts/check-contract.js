// scripts/check-contract.js
async function main() {
  try {
    // Get the contract factory
    const PollFactory = await ethers.getContractFactory("PollFactory");
    
    // Log the deployment address we're checking
    console.log("Checking contract at:", "0x0B306BF915C4d645ff596e518fAf3F9669b97016");
    
    // Try to attach to the deployed contract
    const pollFactory = await PollFactory.attach("0x0B306BF915C4d645ff596e518fAf3F9669b97016");
    
    // Try to call a method
    console.log("Attempting to call getAllPolls()...");
    try {
      const allPolls = await pollFactory.getAllPolls();
      console.log("Got polls:", allPolls);
    } catch (error) {
      console.error("Error calling getAllPolls:", error.message);
    }
    
    // Print contract info
    console.log("Contract address:", await pollFactory.getAddress());
    console.log("Contract functions:", Object.keys(pollFactory.interface.functions));
  } catch (error) {
    console.error("Error checking contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 