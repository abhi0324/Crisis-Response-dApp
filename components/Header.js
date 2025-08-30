'use client';

import { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, isWalletConnected, formatAddress } from '../utils/web3';

export default function Header() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const address = await isWalletConnected();
      if (address) {
        setWalletAddress(address);
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('walletConnected', { detail: address }));
      } else {
        setWalletAddress('');
        window.dispatchEvent(new CustomEvent('walletDisconnected'));
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWalletAddress('');
      window.dispatchEvent(new CustomEvent('walletDisconnected'));
    }
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('walletConnected', { detail: address }));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please make sure Coinbase Wallet is installed.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setWalletAddress('');
    window.dispatchEvent(new CustomEvent('walletDisconnected'));
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-crisis-red">
                Crisis Response
              </h1>
            </div>
            <nav className="ml-10 flex space-x-8">
              <a href="/" className="text-gray-900 hover:text-crisis-red px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="/reports" className="text-gray-900 hover:text-crisis-red px-3 py-2 rounded-md text-sm font-medium">
                Reports
              </a>
              <a href="/donate" className="text-gray-900 hover:text-crisis-red px-3 py-2 rounded-md text-sm font-medium">
                Donate
              </a>
            </nav>
          </div>
          
          <div className="flex items-center">
            {walletAddress ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Connected: {formatAddress(walletAddress)}
                </span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <button
                  onClick={handleDisconnectWallet}
                  className="text-sm text-gray-500 hover:text-crisis-red"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? 'Connecting...' : 'Connect Coinbase Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 