'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import ReportForm from '../../components/ReportForm';
import ReportsList from '../../components/ReportsList';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'submit'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Submit Report
            </button>
            <button
              onClick={() => setActiveTab('view')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'view'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              View Reports
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'submit' ? (
          <ReportForm />
        ) : (
          <ReportsList />
        )}
      </main>
    </div>
  );
} 