import { useState, useEffect } from "react";
import { connectWallet, getEthereumContract } from "./utils/ethers";
import { POLL_ABI } from "./pollConfig";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './constants';
import { ethers } from "ethers";



let eventListenersSet = {};
    const setupEventListeners = async (address) => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const pollContract = new ethers.Contract(address, POLL_ABI, provider);
      
      pollContract.on("VoteCast", async () => {
        console.log("New vote detected - refreshing...");
        await loadPolls();
      });
    };
function App() {
  const [account, setAccount] = useState(null);
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: '',
    startTime: '',
    endTime: ''
  });


   
  const [calculatingResults, setCalculatingResults] = useState(false);

  const checkContractDeployment = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const code = await provider.getCode(CONTRACT_ADDRESS);
      console.log("Contract code length:", code.length);

      if (code === "0x") {
        console.error("Contract not deployed!");
        alert("Contract not found at this address");
        return false;
      }
      
      // Verify ABI matches contract
      const tempContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      if (!tempContract.getAllPolls) {
        console.error("ABI mismatch - getAllPolls not found");
        return false;
      }
      
      return true;
    } catch (err) {
      console.error("Deployment check failed:", err);
      return false;
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        console.log("MetaMask not installed!");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        console.log("Connected to network:", network.chainId);

        const isDeployed = await checkContractDeployment();
        if (!isDeployed) return;

        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          await provider.getSigner()
        );
        
        // setPollManager(contract);
        loadPolls(contract);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    init();
  }, []);

  const [loading, setLoading] = useState(false);

  // App.jsx
  const loadPolls = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      let pollAddresses = [];
    try {
      pollAddresses = await contract.getAllPolls();
    } catch (err) {
      console.error("getAllPolls failed:", err);
    }

    
    

    const pollsData = await Promise.all(
      pollAddresses.map(async (address) => {
        const pollContract = new ethers.Contract(address, POLL_ABI, provider);
        const [title, description, options, startTime, endTime] = await Promise.all([
          pollContract.title(),
          pollContract.description(),
          pollContract.getOptions(),
          pollContract.startTime(),
          pollContract.endTime(),
          
        ]);
        
        
        // Fetch live results
        let results = [];
        try {
          const rawResults = await pollContract.getResults();
          results = rawResults.map(r => Number(r));
        } catch (e) {
          results = options.map(() => 0);
        }
        // Check if current account has voted
        let hasVoted = false;
        if (account) {
          try {
            hasVoted = await pollContract.hasVoted(account);
          } catch (e) {
            hasVoted = false;
          }
        }

        setupEventListeners(address, loadPolls);

        const endTimestamp = Number(endTime) * 1000;
        let winningIndices = [];
if (Date.now() > endTimestamp) {
  const maxVotes = Math.max(...results);
  winningIndices = results.reduce((acc, count, idx) => {
    if (count === maxVotes) acc.push(idx);
    return acc;
  }, []);
}
        return {
          address,
          title,
          description,
          options,
          startTime: Number(startTime) * 1000,
          endTime: Number(endTime) * 1000,
          startTimeString: new Date(Number(startTime) * 1000).toLocaleString(),
          endTimeString: new Date(Number(endTime) * 1000).toLocaleString(),
          results,
          winningIndices,
          hasVoted,
        };
      })
    );
    

    setPolls(pollsData.filter(poll => poll !== null));
  } catch (err) {
    console.error("Poll loading error:", err);
  }
};

     
  

  
  const handleConnect = async () => {
    const acc = await connectWallet();
    setAccount(acc);
  };

  const handleSubmitPoll = async (e) => {
    e.preventDefault();
    if (!newPoll.title || !newPoll.description || !newPoll.options || !newPoll.startTime || !newPoll.endTime) return;

    setLoading(true);

    const contract = await getEthereumContract();
    if (!contract) return;

    // Convert options into an array
    const optionsArray = newPoll.options.split(',').map(option => option.trim());

    // Convert startTime and endTime to Unix timestamps
    const startTime = new Date(newPoll.startTime).getTime() / 1000; // Convert to Unix timestamp
    const endTime = new Date(newPoll.endTime).getTime() / 1000; // Convert to Unix timestamp

    try {
      const tx = await contract.createPoll(newPoll.title, newPoll.description, optionsArray, startTime, endTime);
      await tx.wait();
      alert("Poll created successfully!");
      setNewPoll({ title: "", description: "", options: "", startTime: "", endTime: "" });
      loadPolls(); // Reload polls after creation
    } catch (err) {
      console.error("Error creating poll", err);
      alert("Failed to create poll.");
    } finally {
      setLoading(false);
    }
  };


  const handleVote = async (pollAddress, optionIndex) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const pollContract = new ethers.Contract(pollAddress, POLL_ABI, signer);
  
      const tx = await pollContract.vote(optionIndex);
      await tx.wait(); // Wait for transaction confirmation
      
      alert("Vote submitted successfully!");
      
      // Immediately update UI while waiting for blockchain state
      setPolls(prevPolls => prevPolls.map(poll => {
        if (poll.address === pollAddress) {
          const newResults = [...poll.results];
          newResults[optionIndex] += 1; // Optimistic update
          return { ...poll, results: newResults };
        }
        return poll;
      }));
  
      // Then refresh with actual data
      await loadPolls();
  
    } catch (err) {
      alert("Voting failed: " + (err?.reason || err?.message));
      console.error("Voting error:", err);
    }
  };
  
  

  // Calculate results
  const calculateResults = async (pollAddress) => {
    try {
      setCalculatingResults(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Use POLL_ABI, not CONTRACT_ABI
      const pollContract = new ethers.Contract(
        pollAddress, 
        POLL_ABI, // ◀◀ Critical fix
        signer
      );
  
      const tx = await pollContract.calculateResults();
      await tx.wait();
      await loadPolls(); // Refresh data
    } catch (err) {
      console.error("Results error:", err);
    } finally {
      setCalculatingResults(false);
    }
  };
  

  useEffect(() => {
    handleConnect();
    loadPolls();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-8">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-8">VoteSafe</h1>
      
      {/* Connection Status */}
      {account ? (
        <p className="text-lg text-gray-700 mb-6">
          Connected: <span className="font-bold">{account.slice(0, 6)}...{account.slice(-4)}</span>
        </p>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-blue-600 text-white text-lg py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      )}

      {/* Polls List */}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Active Polls</h2>
        {polls.length > 0 ? (
          polls.map((poll) => (
            <div key={poll.address} className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-800">{poll.title}</h3>
              <p className="text-gray-600 mt-2">{poll.description}</p>
              
              {/* Voting Interface */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Options:</h4>
                <div className="flex flex-wrap gap-2">
                  {poll.options.map((option, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleVote(poll.address, idx)}
                      className={`px-4 py-2 rounded-lg ${
                        poll.hasVoted || Date.now() > poll.endTime
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                      disabled={poll.hasVoted || Date.now() > poll.endTime}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Voting Status */}
                {poll.hasVoted && (
                  <p className="text-green-600 mt-2 text-sm">You've already voted in this poll.</p>
                )}
                {Date.now() > poll.endTime && (
                  <p className="text-red-600 mt-2 text-sm">Voting has ended.</p>
                )}
              </div>

              {/* Live Results */}
{poll.results && (
  <div className="mt-6">
    <h4 className="text-lg font-semibold text-gray-700 mb-2">
      {Date.now() > poll.endTime ? "Final Results" : "Live Results"}
    </h4>
    <div className="space-y-2">
      {poll.results.map((count, idx) => {
        const isWinner = Date.now() > poll.endTime && 
                        poll.winningIndices.includes(idx);
        const totalVotes = poll.results.reduce((a, b) => a + b, 0);
        const percentage = totalVotes > 0 
                          ? (count / totalVotes) * 100 
                          : 0;
                          
        return (
          <div 
            key={idx} 
            className={`flex items-center p-2 rounded ${
              isWinner ? "bg-green-100 border-2 border-green-500" : ""
            }`}
          >
            <span className="w-32">{poll.options[idx]}</span>
            <div className="flex-1 bg-gray-200 h-4 rounded">
            <div 
  className="h-4 rounded transition-all duration-500"
  style={{
    width: `${percentage}%`,
    backgroundColor: isWinner ? "#10B981" : "#3B82F6",
    transition: 'width 0.5s ease-in-out' // Add this line
  }}
></div>

            </div>
            <span className="ml-4 w-16 text-right">
              {count} vote{count !== 1 ? "s" : ""}
            </span>
          </div>
        );
      })}
    </div>
    {Date.now() > poll.endTime && poll.winningIndices.length > 0 && (
      <div className="mt-4 text-green-600 font-semibold">
        Winner: {poll.winningIndices.map(i => poll.options[i]).join(", ")}
      </div>
    )}
  </div>
)}



              {/* Poll Metadata */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Created: {poll.startTimeString} | Ends: {poll.endTimeString}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Contract: {poll.address.slice(0, 6)}...{poll.address.slice(-4)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-600">No active polls found.</p>
        )}
      </div>

    <div className="w-full max-w-4xl mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Create a Poll</h2>
      <form onSubmit={handleSubmitPoll} className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={newPoll.title}
            onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
            className="border border-gray-300 rounded-lg p-4 w-full text-lg"
            placeholder="Poll Title"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-700 mb-2">Description</label>
          <textarea
            value={newPoll.description}
            onChange={(e) => setNewPoll({ ...newPoll, description: e.target.value })}
            className="border border-gray-300 rounded-lg p-4 w-full text-lg"
            placeholder="Poll Description"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-700 mb-2">Options (comma-separated)</label>
          <textarea
            value={newPoll.options}
            onChange={(e) => setNewPoll({ ...newPoll, options: e.target.value })}
            className="border border-gray-300 rounded-lg p-4 w-full text-lg"
            placeholder="Option 1, Option 2, Option 3"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-700 mb-2">Start Time</label>
          <input
            type="datetime-local"
            value={newPoll.startTime}
            onChange={(e) => setNewPoll({ ...newPoll, startTime: e.target.value })}
            className="border border-gray-300 rounded-lg p-4 w-full text-lg"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-bold text-gray-700 mb-2">End Time</label>
          <input
            type="datetime-local"
            value={newPoll.endTime}
            onChange={(e) => setNewPoll({ ...newPoll, endTime: e.target.value })}
            className="border border-gray-300 rounded-lg p-4 w-full text-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white text-lg py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition w-full"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </div>
  </div>
);
}

export default App;
