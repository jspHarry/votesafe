require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

task("checkNetworks", "Lists available networks", async (_, hre) => {
  console.log("Available networks:", Object.keys(hre.config.networks));
});

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111, // Sepolia's chain ID
      gas: "auto", // Let Hardhat estimate
      gasPrice: "auto", // Let Hardhat set
    },
  },
  
  paths: {
    artifacts: "./artifacts", // Make sure this is where the ABI is being imported from
    sources: "./contracts",
    cache: "./cache",
    tests: "./test"
  }
};

 

