import { ethers } from 'ethers';
import { CoinbaseWalletSDK } from '@coinbase/wallet-sdk';

// Contract ABI - This will be generated after compilation
const CONTRACT_ABI = [
  "function submitReport(string _title, string _description, string _location, string _imageHash, string _ipfsCID) external",
  "function donate(string _message) external payable",
  "function getAllReports() external view returns (tuple(string title, string description, string location, string imageHash, string ipfsCID, address reporter, uint256 timestamp, bool verified, uint256 verificationCount)[])",
  "function getAllDonations() external view returns (tuple(address donor, uint256 amount, uint256 timestamp, string message)[])",
  "function totalDonations() external view returns (uint256)",
  "function getReportsCount() external view returns (uint256)",
  "function verifyReport(uint256 _reportId) external",
  "function verifiedReporters(address) external view returns (bool)",
  "event ReportSubmitted(uint256 reportId, address reporter, string title, string ipfsCID)",
  "event DonationReceived(address donor, uint256 amount, string message)"
];

let coinbaseWallet;
let provider;
let signer;
let contract;

// Check if Coinbase Wallet extension is available
const isCoinbaseWalletAvailable = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check multiple ways Coinbase Wallet might be detected
  const hasEthereum = window.ethereum !== undefined;
  const isCoinbaseWallet = window.ethereum && window.ethereum.isCoinbaseWallet;
  const hasCoinbaseProvider = window.ethereum && window.ethereum.providers && 
    window.ethereum.providers.some(provider => provider.isCoinbaseWallet);
  
  // Also check if the extension is available by trying to detect its presence
  const hasCoinbaseExtension = window.ethereum && (
    isCoinbaseWallet || 
    hasCoinbaseProvider ||
    window.ethereum.constructor.name === 'CoinbaseWalletProvider' ||
    (window.ethereum._state && window.ethereum._state.isCoinbaseWallet)
  );

  console.log('Coinbase Wallet detection:', {
    hasEthereum,
    isCoinbaseWallet,
    hasCoinbaseProvider,
    hasCoinbaseExtension,
    ethereumType: window.ethereum ? window.ethereum.constructor.name : 'undefined'
  });

  return hasCoinbaseExtension;
};

// Initialize Coinbase Wallet SDK
const initializeCoinbaseWallet = () => {
  if (!coinbaseWallet) {
    try {
      // Check if Coinbase Wallet extension is available
      if (!isCoinbaseWalletAvailable()) {
        console.log('Coinbase Wallet extension not detected, trying SDK...');
      }

      coinbaseWallet = new CoinbaseWalletSDK({
        appName: "Crisis Response dApp",
        appLogoUrl: "https://your-app-logo-url.com/logo.png",
        darkMode: false,
        overrideIsMetaMask: false,
        enableMobileWalletLink: true,
        enableExtension: true,
      });
    } catch (error) {
      console.error('Failed to initialize Coinbase Wallet SDK:', error);
      return null;
    }
  }
  return coinbaseWallet;
};

export const connectWallet = async () => {
  try {
    // First try to use Coinbase Wallet extension if available
    if (isCoinbaseWalletAvailable()) {
      console.log('Using Coinbase Wallet extension');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
      
      return {
        address: accounts[0],
        provider,
        signer,
        contract
      };
    }

    // Fallback: Try to connect to any available Ethereum provider
    if (window.ethereum) {
      console.log('Coinbase Wallet not detected, trying any available Ethereum provider...');
      
      // Try to request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if this might be Coinbase Wallet by looking at the provider
      const providerInfo = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to provider with chainId:', providerInfo);
      
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
      contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
      
      return {
        address: accounts[0],
        provider,
        signer,
        contract
      };
    }

    // If no Ethereum provider is available, throw a clear error
    throw new Error('No Ethereum wallet found. Please install the Coinbase Wallet browser extension to use this dApp.');
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const disconnectWallet = () => {
  if (coinbaseWallet) {
    coinbaseWallet.disconnect();
  }
  provider = null;
  signer = null;
  contract = null;
};

export const getContract = () => {
  if (!contract) {
    throw new Error('Wallet not connected');
  }
  return contract;
};

export const getSigner = () => {
  if (!signer) {
    throw new Error('Wallet not connected');
  }
  return signer;
};

export const getProvider = () => {
  if (!provider) {
    throw new Error('Wallet not connected');
  }
  return provider;
};

export const isWalletConnected = async () => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return null;
    }

    // First check Coinbase Wallet extension
    if (isCoinbaseWalletAvailable()) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0 ? accounts[0] : null;
    }

    // Fallback: Check any available Ethereum provider
    if (window.ethereum) {
      console.log('Checking any available Ethereum provider...');
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts.length > 0 ? accounts[0] : null;
    }

    // If no Ethereum provider is available, return null
    return null;
  } catch (error) {
    console.error('Error checking wallet connection:', error);
    return null;
  }
};

export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatEther = (wei) => {
  return ethers.formatEther(wei);
};

export const parseEther = (ether) => {
  return ethers.parseEther(ether);
};

export const listenToEvents = (contract, eventName, callback) => {
  contract.on(eventName, callback);
  return () => contract.off(eventName, callback);
}; 