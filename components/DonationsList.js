'use client';

import { useState, useEffect } from 'react';
import { getContract, formatAddress, formatEther, isWalletConnected } from '../utils/web3';

export default function DonationsList() {
  const [donations, setDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);

  useEffect(() => {
    checkWalletConnection();

    // Listen for wallet connection events
    const handleWalletConnected = () => {
      setWalletConnected(true);
      fetchDonations();
    };

    const handleWalletDisconnected = () => {
      setWalletConnected(false);
      loadLocalDonations();
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
      const address = await isWalletConnected();
      if (address) {
        setWalletConnected(true);
        fetchDonations();
      } else {
        setWalletConnected(false);
        loadLocalDonations();
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWalletConnected(false);
      loadLocalDonations();
    }
  };

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const contract = getContract();
      
      // Fetch total donations
      const total = await contract.totalDonations();
      setTotalDonations(formatEther(total));
      
      // Fetch all donations
      const donationsData = await contract.getAllDonations();
      
      const formattedDonations = donationsData.map((donation, index) => ({
        id: index,
        donor: donation.donor,
        amount: formatEther(donation.amount),
        timestamp: new Date(Number(donation.timestamp) * 1000),
        message: donation.message,
        type: 'blockchain'
      }));

      setDonations(formattedDonations.reverse()); // Show newest first
    } catch (error) {
      console.error('Error fetching donations:', error);
      if (error.message.includes('Wallet not connected')) {
        setError('Please connect your wallet to view blockchain donations');
        loadLocalDonations();
      } else {
        setError('Failed to load blockchain donations');
        loadLocalDonations();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLocalDonations = () => {
    try {
      setLoading(true);
      setError(null);
      
      const localDonations = JSON.parse(localStorage.getItem('localDonations') || '[]');
      
      const formattedDonations = localDonations.map(donation => ({
        id: donation.id,
        donor: donation.donor || 'Anonymous',
        amount: donation.amount.toString(),
        timestamp: new Date(donation.timestamp),
        message: donation.message,
        type: 'local'
      }));

      const total = localDonations.reduce((sum, donation) => sum + donation.amount, 0);
      setTotalDonations(total.toString());
      setDonations(formattedDonations.reverse()); // Show newest first
    } catch (error) {
      console.error('Error loading local donations:', error);
      setError('Failed to load local donations');
      setDonations([]);
      setTotalDonations('0');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return timestamp.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading donations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">💚</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recent Donations</h2>
              <p className="text-gray-600">
                {walletConnected ? 'Blockchain donations' : 'Local storage donations'}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{totalDonations} ETH</div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Donations List */}
      {donations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💚</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Donations Yet</h3>
          <p className="text-gray-600">
            {walletConnected 
              ? "No blockchain donations have been made yet." 
              : "No local donations have been made yet."}
          </p>
          <div className="mt-4">
            <a 
              href="/donate" 
              className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              Make First Donation
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div key={donation.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">💚</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {donation.type === 'blockchain' ? formatAddress(donation.donor) : donation.donor}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(donation.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {donation.message && (
                    <p className="text-gray-700 mt-2 italic">"{donation.message}"</p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{donation.amount} ETH</div>
                    <div className="text-sm text-gray-500">
                      {donation.type === 'blockchain' ? 'Blockchain' : 'Local Storage'}
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    donation.type === 'blockchain' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {donation.type === 'blockchain' ? '🔗' : '💾'} {donation.type}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mode Information */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200/50">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg">ℹ️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Donation Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-gray-700">Blockchain: Immutable, transparent donations on Ethereum</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-gray-700">Local Storage: Demo donations stored locally</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 