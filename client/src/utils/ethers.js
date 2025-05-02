import { ethers } from "ethers";

import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";



export const getEthereumContract = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    alert("Please install MetaMask!");
    return null;
  }

  try {
    console.log("Creating contract instance for:", CONTRACT_ADDRESS);
    
    // Check if CONTRACT_ABI is defined and has the expected structure
    if (!CONTRACT_ABI || !Array.isArray(CONTRACT_ABI)) {
      console.error("Invalid ABI format:", CONTRACT_ABI);
      return null;
    }
    
    // Log the function signatures from the ABI for debugging
    const functionEntries = CONTRACT_ABI.filter(item => item.type === "function");
    console.log("Available functions in ABI:", functionEntries.map(f => f.name));
    
    // Look specifically for getAllPolls function to debug
    const getAllPollsFunction = functionEntries.find(f => f.name === "getAllPolls");
    if (getAllPollsFunction) {
      console.log("getAllPolls signature:", 
        `${getAllPollsFunction.name}(${getAllPollsFunction.inputs.map(i => i.type).join(',')})`);
    } else {
      console.error("getAllPolls function not found in ABI!");
    }
    
    // Create a provider using the BrowserProvider class
    //const provider = new ethers.BrowserProvider(ethereum);
    const provider = new ethers.JsonRpcProvider("http://localhost:8545");
    // Request accounts before getting the signer
    await provider.send("eth_requestAccounts", []);

    // Get the signer from the provider
    const signer = await provider.getSigner();
    console.log("Signer address:", await signer.getAddress());

    // Create the contract instance with the signer (this will allow sending transactions)
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("Contract created successfully");

    return contract;
  } catch (error) {
    console.error("Error getting ethereum contract:", error);
    return null;
  }
};

export const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return null;
      }
  
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      return accounts[0];
    } catch (err) {
      console.error("Error connecting wallet:", err);
      return null;
    }
  };
  