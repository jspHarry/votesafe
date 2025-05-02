const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const PollFactory = await hre.ethers.getContractFactory("PollFactory");

    // Deploy contract with explicit gas settings
    const pollFactory = await PollFactory.deploy({
        gasLimit: 5_000_000, // Set appropriate gas limit
        gasPrice: hre.ethers.parseUnits("5", "gwei"), // Set reasonable gas price
    });

    // Wait until deployment is complete
    await pollFactory.waitForDeployment();

    const deployedAddress = await pollFactory.getAddress();
    console.log("PollFactory contract deployed to:", deployedAddress);

    const tx = await pollFactory.createPoll(
        "Who will win Tata IPL 2025",
        "CAUTION: Only support to RCB otherwise you will be killed by us.",
        ["RCB", "Virat Kohli", "Harry", "None"],
        Math.floor(Date.now() / 1000) + 60,
        Math.floor(Date.now() / 1000) + 3600
    );
    await tx.wait();

    console.log("Poll created successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
