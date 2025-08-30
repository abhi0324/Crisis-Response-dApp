'use client';

import { useState, useEffect } from 'react';
import { getContract, parseEther, formatEther, isWalletConnected } from '../utils/web3';

export default function DonationForm() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [donationStatus, setDonationStatus] = useState('');

  useEffect(() => {
    checkWalletConnection();
    
    // Listen for wallet connection events
    const handleWalletConnected = () => {
      setWalletConnected(true);
    };

    const handleWalletDisconnected = () => {
      setWalletConnected(false);
    };

    window.addEventListener('walletConnected', handleWalletConnected);
    window.addEventListener('walletDisconnected', handleWalletDisconnected);

    return () => {
      window.removeEventListener('walletConnected', handleWalletConnected);
      window.removeEventListener('walletDisconnected', handleWalletDisconnected);
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      console.log('Checking wallet connection...');
      const address = await isWalletConnected();
      console.log('Wallet address:', address);
      const connected = !!address;
      setWalletConnected(connected);
      console.log('Wallet connected status:', connected);
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWalletConnected(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== DONATION SUBMIT START ===');
    console.log('Form data:', { amount, message, walletConnected });
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    setIsDonating(true);
    setDonationStatus('Processing your donation...');

    try {
      console.log('Wallet connected:', walletConnected);
      
      if (walletConnected) {
        // Blockchain donation
        console.log('Attempting blockchain donation...');
        await handleBlockchainDonation();
      } else {
        // Local storage donation (simplified version)
        console.log('Attempting local donation...');
        await handleLocalDonation();
      }
      
      console.log('=== DONATION SUBMIT SUCCESS ===');
    } catch (error) {
      console.error('=== DONATION SUBMIT ERROR ===');
      console.error('Error making donation:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        walletConnected: walletConnected,
        amount: amount,
        message: message
      });
      
      // Provide more specific error messages
      if (error.message.includes('Wallet not connected')) {
        setDonationStatus('Please connect your wallet first. Trying local mode...');
        // Fallback to local donation
        try {
          await handleLocalDonation();
        } catch (localError) {
          console.error('Local donation also failed:', localError);
          setDonationStatus('Failed to process donation. Please try again.');
        }
      } else if (error.message.includes('insufficient funds')) {
        setDonationStatus('Insufficient funds in your wallet.');
      } else if (error.message.includes('user rejected')) {
        setDonationStatus('Transaction was cancelled by user.');
      } else {
        setDonationStatus('Failed to process donation. Please try again.');
      }
      
      setTimeout(() => setDonationStatus(''), 5000);
    } finally {
      setIsDonating(false);
      console.log('=== DONATION SUBMIT END ===');
    }
  };

  const handleBlockchainDonation = async () => {
    try {
      const contract = getContract();
      const amountInWei = parseEther(amount);
      
      const tx = await contract.donate(message, { value: amountInWei });
      setDonationStatus('Transaction submitted! Waiting for confirmation...');
      
      await tx.wait();
      
      setDonationStatus('Thank you for your donation! Transaction confirmed.');
      setAmount('');
      setMessage('');
      
      setTimeout(() => {
        setDonationStatus('');
        alert('Thank you for your donation! Your transaction has been confirmed on the blockchain.');
      }, 2000);
      
    } catch (error) {
      console.error('Blockchain donation error:', error);
      if (error.message.includes('Wallet not connected')) {
        setDonationStatus('Please connect your wallet first.');
      } else if (error.message.includes('insufficient funds')) {
        setDonationStatus('Insufficient funds in your wallet.');
      } else if (error.message.includes('user rejected')) {
        setDonationStatus('Transaction was cancelled by user.');
      } else {
        setDonationStatus('Blockchain transaction failed. Please try again.');
      }
      throw error;
    }
  };

  const handleLocalDonation = async () => {
    try {
      console.log('Starting local donation process...');
      
      // Validate amount
      const donationAmount = parseFloat(amount);
      if (isNaN(donationAmount) || donationAmount <= 0) {
        throw new Error('Invalid donation amount');
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const donation = {
        id: Date.now(),
        amount: donationAmount,
        message: message || 'Anonymous donation',
        timestamp: new Date().toISOString(),
        donor: 'Anonymous',
        status: 'completed'
      };

      console.log('Donation object created:', donation);

      // Store in localStorage
      try {
        const existingDonations = JSON.parse(localStorage.getItem('localDonations') || '[]');
        console.log('Existing donations:', existingDonations);
        
        existingDonations.push(donation);
        localStorage.setItem('localDonations', JSON.stringify(existingDonations));
        
        console.log('Donation saved to localStorage successfully');
      } catch (storageError) {
        console.error('Error saving to localStorage:', storageError);
        throw new Error('Failed to save donation to local storage');
      }
      
      setDonationStatus('Thank you for your donation! (Local storage)');
      setAmount('');
      setMessage('');
      
      setTimeout(() => {
        setDonationStatus('');
        alert('Thank you for your donation! This is a local storage donation for demonstration purposes.');
      }, 2000);
      
    } catch (error) {
      console.error('Local donation error:', error);
      setDonationStatus(`Failed to save donation locally: ${error.message}`);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Support Crisis Relief
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your donation helps provide immediate assistance to those affected by crises. 
          All donations are transparent and tracked on the blockchain.
        </p>
      </div>

      {/* Wallet Status */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-xl border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${walletConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {walletConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
              </h3>
              <p className="text-gray-600">
                {walletConnected 
                  ? 'You can make blockchain donations' 
                  : 'Connect your wallet for blockchain donations or use local storage mode'}
              </p>
            </div>
          </div>
          
          {!walletConnected && (
            <div className="flex gap-2">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Connect Wallet
              </button>
              <button
                onClick={checkWalletConnection}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Refresh Status
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Donation Form */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/30">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Make a Donation</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount (ETH) *
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="0.001"
                step="0.001"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm pr-12"
                placeholder="0.01"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">ETH</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum donation: 0.001 ETH</p>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              placeholder="Leave a message of support..."
            />
          </div>

          {/* Status Message */}
          {donationStatus && (
            <div className={`p-4 rounded-lg text-center ${
              donationStatus.includes('Thank you') 
                ? 'bg-green-100 text-green-700' 
                : donationStatus.includes('Failed') || donationStatus.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {donationStatus}
            </div>
          )}

          <button
            type="submit"
            disabled={isDonating}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isDonating ? 'Processing Donation...' : 'Donate Now'}
          </button>
        </form>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">💚</span>
              How your donation helps
            </h3>
            <ul className="text-sm text-green-700 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Emergency relief supplies
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Medical assistance
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Food and water distribution
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Shelter and infrastructure
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              Transparency & Security
            </h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Blockchain verification
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Transparent tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Immutable records
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Secure transactions
              </li>
            </ul>
          </div>
        </div>

        {/* Mode Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-4">
            {walletConnected 
              ? '🟢 Blockchain Mode: Your donation will be processed on the Ethereum blockchain for maximum transparency.'
              : '🟡 Local Mode: Your donation will be stored locally for demonstration purposes. Connect your wallet for blockchain donations.'
            }
          </p>
          
          {/* Debug/Test Section */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Debug Information</h4>
            <div className="text-xs text-blue-800 space-y-1">
              <p>Wallet Connected: {walletConnected ? 'Yes' : 'No'}</p>
              <p>Amount: {amount || 'Not set'}</p>
              <p>Message: {message || 'Not set'}</p>
            </div>
            <button
              onClick={async () => {
                setAmount('0.01');
                setMessage('Test donation');
                console.log('Test values set');
              }}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
            >
              Set Test Values
            </button>
            <button
              onClick={async () => {
                console.log('Testing local donation...');
                try {
                  await handleLocalDonation();
                } catch (error) {
                  console.error('Test donation failed:', error);
                }
              }}
              className="mt-2 ml-2 bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
            >
              Test Local Donation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 