# VoteSafe: A Decentralized Anonymous Voting Platform

VoteSafe is a secure, anonymous, tamper-proof voting DApp built with blockchain and smart contracts. It empowers individuals, communities, and organizations to create and participate in trustworthy polls, without compromising privacy or transparency.

## Features

- **Create Polls:** Anyone can create a poll with custom options and duration.
- **Decentralized Voting:** Votes are stored on-chain using Ethereum smart contracts.
- **Anonymity:** No user identity is tracked or stored.
- **Live Results:** Real-time results are viewable after voting.
- **Wallet Integration:** MetaMask-based wallet connection.

## Why VoteSafe?

While platforms like Google Forms or WhatsApp Polls are popular, they lack trustless verifiability, tamper resistance, and true anonymity. VoteSafe uses blockchain to ensure:

- **No Duplicate Voting**
- **No Vote Manipulation**
- **No Centralized Control**

VoteSafe can power elections for student bodies, decentralized communities (DAOs), hackathons, and more.

---

## Tech Stack

| Layer         | Tech                        |
|---------------|-----------------------------|
| Smart Contract | Solidity, Ethereum         |
| Frontend       | React, Tailwind CSS        |
| Web3           | ethers.js, MetaMask        |
| Tooling        | Hardhat                    |

---

## Screenshots

### 🗳️ Poll Creation
./assests/1.png

### ✅ Voting Interface
./assests/2.png

---


## Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/votesafe-dapp.git
cd votesafe-dapp
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Compile and Deploy Smart Contract
```bash
cd ..
npx hardhat compile
npx hardhat run scripts/deploy.js --network <your-network>
```

Update the deployed contract address in `frontend/src/pages/Home.js` and `CreatePoll.js`.

### 4. Run the Frontend
```bash
cd frontend
npm run dev
```

---

## Folder Structure

```
votesafe-dapp/
├── contracts/              # Solidity contract
├── scripts/                # Deployment scripts
├── frontend/               # React + Tailwind frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page routes
│   │   └── abi/            # ABI for contract
```

---

## Contributors

Made with passion at [HackIndia] by:
- [Jaspinder Singh] (@jspHarry)
- [Noor Gumber]
- [Keshav Garg]
- [Harshita Sharma]
