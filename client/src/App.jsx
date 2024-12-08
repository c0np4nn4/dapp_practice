import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Web3 from "web3";
import abi from "./abi.json";

const CONTRACT_ADDRESSES = [
  { label: "Default NFT Contract", value: "0x05a8C5aFa171aFAE09218a9270ECe34Dd32CbdCD" },
];

// Background animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled components
const Background = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(270deg, #ff7eb3, #ff758c, #ff9a76, #ffdf76);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 10s ease infinite;
`;

const Container = styled.div`
  width: 400px;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  font-family: "Roboto", sans-serif;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-family: "Montserrat", sans-serif;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
`;

const Message = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${props => (props.error ? "red" : "green")};
  margin-top: 10px;
`;

const App = () => {
  const [account, setAccount] = useState(null);
  const [selectedContract, setSelectedContract] = useState(CONTRACT_ADDRESSES[0].value);
  const [mintTo, setMintTo] = useState("");
  const [message, setMessage] = useState("");
  const [txHash, setTxHash] = useState(null);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setMessage("Wallet connected successfully!");
    } else {
      setMessage("Please install MetaMask.");
    }
  };

  // Mint NFT
  const mintNFT = async () => {
    if (!account || !mintTo) {
      setMessage("Please fill in the recipient address.");
      return;
    }
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(abi, selectedContract);
      const tx = await contract.methods.safeMint(mintTo).send({ from: account });
      setTxHash(tx.transactionHash);
      setMessage("Minting successful!");
    } catch (error) {
      console.error(error);
      setMessage("Minting failed.");
    }
  };

  return (
    <Background>
      <Container>
        <Title>NFT Minting DApp</Title>
        <Button onClick={connectWallet}>
          {account ? `Wallet Connected: ${account}` : "Connect Wallet"}
        </Button>
        <Select
          value={selectedContract}
          onChange={(e) => setSelectedContract(e.target.value)}
        >
          {CONTRACT_ADDRESSES.map((contract) => (
            <option key={contract.value} value={contract.value}>
              {contract.label}
            </option>
          ))}
        </Select>
        <Input
          type="text"
          placeholder="Recipient Address"
          value={mintTo}
          onChange={(e) => setMintTo(e.target.value)}
        />
        <Button onClick={mintNFT}>Mint NFT</Button>
        {message && <Message error={message.includes("failed")}>{message}</Message>}
        {txHash && (
          <Message>
            View on Etherscan:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {txHash}
            </a>
          </Message>
        )}
      </Container>
    </Background>
  );
};

export default App;

