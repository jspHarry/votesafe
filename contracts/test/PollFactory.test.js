const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PollFactory and Poll", function () {
  let pollFactory, pollFactoryAddress;
  let owner, user1;
  const title = "Your Favorite Programming Language?";
  const description = "Vote for your favorite!";
  const options = ["Solidity", "JavaScript", "Python"];
  const now = Math.floor(Date.now() / 1000);
  const startTime = now + 10; // 10 seconds from now
  const endTime = now + 3600; // 1 hour from now

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
  
    const PollFactory = await ethers.getContractFactory("PollFactory");
    
    pollFactory = await PollFactory.deploy();
    
    pollFactoryAddress = await pollFactory.getAddress(); 
  });

  it("should deploy PollFactory successfully", async () => {
    expect(pollFactoryAddress).to.be.properAddress;
  });

  it("should allow a user to create a poll", async () => {
    const tx = await pollFactory.createPoll(
      title,
      description,
      options,
      startTime,
      endTime
    );
    await tx.wait();

    const polls = await pollFactory.getAllPolls();
    expect(polls.length).to.equal(1);

    const createdPollAddress = polls[0];
    expect(createdPollAddress).to.be.properAddress;
  });

  it("should track polls by creator", async () => {
    await pollFactory.createPoll(title, description, options, startTime, endTime);

    const userPolls = await pollFactory.getPollsByCreator(owner.address);
    expect(userPolls.length).to.equal(1);
  });

  // Inside your "should allow voting on a created poll" test

  it("should allow voting on a created poll", async () => {
    await pollFactory.createPoll(title, description, options, startTime, endTime);
    const [pollAddress] = await pollFactory.getAllPolls();
  
    const Poll = await ethers.getContractFactory("Poll");
    const poll = await Poll.attach(pollAddress);
  
    // Fast-forward time to start voting
    await ethers.provider.send("evm_increaseTime", [20]);
    await ethers.provider.send("evm_mine");
  
    const voteTx = await poll.connect(user1).vote(1); // Voting for "JavaScript" (index 1)
    await voteTx.wait();
  
    // Use the getResults() function defined in your Poll contract
    const results = await poll.getResults();
    expect(results[1]).to.equal(1); // Check that the vote count for index 1 is 1
  });
});
