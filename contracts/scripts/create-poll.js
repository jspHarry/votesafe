// Batch create in scripts/create-poll.js
const { ethers } = require("hardhat");

async function main() {
  const PollFactory = await ethers.getContractFactory("PollFactory");
  const factory = await PollFactory.attach("0x78ef349da61c0dadd021c7cd53e7e065f7cb2560");

  const tx = await factory.createPoll(
    "Should we implement DAO governance?", // Title
    "Decide on community-led governance structure", // Description
    ["Yes", "No", "Abstain"], // Options
    Math.floor(Date.now() / 1000) + 60, // Start in 1 minute
    Math.floor(Date.now() / 1000) + 604800 // End in 7 days
  );

  await tx.wait();
  console.log("Poll created with hash:", tx.hash);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

 