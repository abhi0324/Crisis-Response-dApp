import Header from '../components/Header';
import ReportsList from '../components/ReportsList';
import DonationsList from '../components/DonationsList';

export default function Home() {
  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-crisis-red to-crisis-orange text-white py-8 px-6 rounded-lg mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Build to Defend
            </h1>
            <p className="text-2xl font-semibold mb-4">
              War-Time Crisis Response Network
            </p>
            <p className="text-lg opacity-90 max-w-4xl mx-auto">
              After the 2025 Indo-Pak escalation, war has gone beyond borders. 
              This decentralized platform combats digital identity loss, misinformation, 
              and enables citizen-led relief efforts through secure blockchain technology.
            </p>
          </div>
          
          <div className="bg-white shadow-lg rounded-lg p-8 border-l-4 border-crisis-red">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What This Platform Does
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              A Web3 solution for national crisis response that helps with fake news verification, 
              secure on-chain donations, citizen reporting, and proof-of-help protocols.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-crisis-red rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Fake News Verification</h3>
                  <p className="text-gray-600">Community-driven verification via oracles to combat misinformation</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-crisis-red rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Donations</h3>
                  <p className="text-gray-600">Transparent on-chain donations with full traceability</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-crisis-red rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Citizen Reporting</h3>
                  <p className="text-gray-600">Decentralized crisis reporting via dApps with IPFS storage</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-crisis-red rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Proof-of-Help</h3>
                  <p className="text-gray-600">Verifiable protocols for humanitarian assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="card text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <div className="text-3xl font-bold text-crisis-red mb-2">0</div>
            <div className="text-gray-700 font-medium">Crisis Reports</div>
            <div className="text-sm text-gray-500">Submitted & Verified</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">0 ETH</div>
            <div className="text-gray-700 font-medium">Total Donations</div>
            <div className="text-sm text-gray-500">For Relief Efforts</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-gray-700 font-medium">Verified Reporters</div>
            <div className="text-sm text-gray-500">Trusted Sources</div>
          </div>
          <div className="card text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <div className="text-gray-700 font-medium">Donors</div>
            <div className="text-sm text-gray-500">Supporting Relief</div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-crisis-red rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Report Crisis</h3>
              <p className="text-gray-600">
                Submit crisis reports with images and location data. All data is stored securely on IPFS with blockchain verification.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Verify Information</h3>
              <p className="text-gray-600">
                Community verification system ensures accurate information. Multiple verified reporters must confirm each report.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Support Relief</h3>
              <p className="text-gray-600">
                Make secure donations in ETH. All transactions are transparent and traceable on the blockchain.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card text-center border-2 border-orange-200 bg-orange-50">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Trust & Transparency</h3>
            <p className="text-gray-600">
              Blockchain ensures all data is immutable and transparent
            </p>
          </div>

          <div className="card text-center border-2 border-purple-200 bg-purple-50">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Borderless Relief</h3>
            <p className="text-gray-600">
              Decentralized platform works across borders and jurisdictions
            </p>
          </div>

          <div className="card text-center border-2 border-green-200 bg-green-50">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Storage</h3>
            <p className="text-gray-600">
              IPFS ensures data is decentralized and censorship-resistant
            </p>
          </div>

          <div className="card text-center border-2 border-blue-200 bg-blue-50">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Citizen-led verification and reporting system
            </p>
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Crisis Reports</h2>
          <ReportsList />
        </div>

        {/* Recent Donations Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h2>
          <DonationsList />
        </div>

        {/* Call to Action */}
        <div className="card bg-gradient-to-r from-crisis-red to-crisis-orange text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Crisis Response Network</h2>
          <p className="text-xl mb-6">
            Your contribution can make a difference during national emergencies. 
            Submit verified reports or make secure donations to support relief efforts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/reports" className="btn-primary bg-white text-crisis-red hover:bg-gray-100 text-lg px-8 py-3">
              Submit Crisis Report
            </a>
            <a href="/donate" className="btn-secondary bg-transparent border-white text-white hover:bg-white hover:text-crisis-red text-lg px-8 py-3">
              Make Secure Donation
            </a>
          </div>
        </div>
      </main>
    </div>
  );
} 