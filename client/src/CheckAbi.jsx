import React, { useEffect } from 'react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';

function CheckAbi() {
  useEffect(() => {
    console.log("CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
    console.log("CONTRACT_ABI:", CONTRACT_ABI);
    
    // Check if ABI is properly defined
    if (!CONTRACT_ABI) {
      console.error("CONTRACT_ABI is undefined");
      return;
    }
    
    if (!Array.isArray(CONTRACT_ABI)) {
      console.error("CONTRACT_ABI is not an array, it is:", typeof CONTRACT_ABI);
      return;
    }
    
    // Find getAllPolls function
    const getAllPollsFunction = CONTRACT_ABI.find(item => 
      item.type === "function" && item.name === "getAllPolls"
    );
    
    if (getAllPollsFunction) {
      console.log("getAllPolls function found in ABI:", getAllPollsFunction);
    } else {
      console.error("getAllPolls function NOT found in ABI!");
      console.log("Available functions:", CONTRACT_ABI.filter(item => item.type === "function").map(f => f.name));
    }
  }, []);

  return (
    <div>
      <h1>ABI Check</h1>
      <p>Open browser console to see results</p>
    </div>
  );
}

export default CheckAbi; 