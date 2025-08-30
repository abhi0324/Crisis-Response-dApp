'use client';
import { useState, useEffect } from 'react';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [currentReporter, setCurrentReporter] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    loadReports();
    loadCurrentReporter();
  }, []);

  const loadReports = () => {
    const storedReports = localStorage.getItem('crisisReports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  };

  const loadCurrentReporter = () => {
    const storedReporter = localStorage.getItem('currentReporter');
    if (storedReporter) {
      setCurrentReporter(JSON.parse(storedReporter));
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'natural disaster': return '🌪️';
      case 'medical emergency': return '🏥';
      case 'fire': return '🔥';
      case 'accident': return '🚗';
      case 'security threat': return '🚨';
      default: return '⚠️';
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getVerificationStatus = (report) => {
    const approvals = report.approvals || [];
    const uniqueApprovals = [...new Set(approvals)];
    
    if (uniqueApprovals.length >= 3) {
      return { status: 'verified', color: 'text-green-600', bgColor: 'bg-green-100' };
    } else if (uniqueApprovals.length > 0) {
      return { status: 'pending', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else {
      return { status: 'unverified', color: 'text-red-600', bgColor: 'bg-red-100' };
    }
  };

  const handleApproveReport = async (reportId) => {
    if (!currentReporter) {
      setShowAuthModal(true);
      return;
    }

    setVerifying(true);
    
    try {
      const updatedReports = reports.map(report => {
        if (report.id === reportId) {
          const approvals = report.approvals || [];
          if (!approvals.includes(currentReporter.id)) {
            return {
              ...report,
              approvals: [...approvals, currentReporter.id]
            };
          }
        }
        return report;
      });

      localStorage.setItem('crisisReports', JSON.stringify(updatedReports));
      setReports(updatedReports);
    } catch (error) {
      console.error('Error approving report:', error);
    } finally {
      setVerifying(false);
    }
  };

  const hasReporterApproved = (report) => {
    if (!currentReporter) return false;
    const approvals = report.approvals || [];
    return approvals.includes(currentReporter.id);
  };

  const handleReporterRegister = (reporterData) => {
    const existingReporters = JSON.parse(localStorage.getItem('reporters') || '[]');
    
    if (existingReporters.find(r => r.email === reporterData.email)) {
      alert('A reporter with this email already exists!');
      return false;
    }

    const newReporter = {
      id: Date.now().toString(),
      ...reporterData,
      registeredAt: new Date().toISOString()
    };

    existingReporters.push(newReporter);
    localStorage.setItem('reporters', JSON.stringify(existingReporters));
    localStorage.setItem('currentReporter', JSON.stringify(newReporter));
    
    setCurrentReporter(newReporter);
    setShowAuthModal(false);
    return true;
  };

  const handleReporterLogin = (loginData) => {
    const existingReporters = JSON.parse(localStorage.getItem('reporters') || '[]');
    const reporter = existingReporters.find(r => r.email === loginData.email && r.password === loginData.password);
    
    if (reporter) {
      localStorage.setItem('currentReporter', JSON.stringify(reporter));
      setCurrentReporter(reporter);
      setShowAuthModal(false);
      return true;
    } else {
      alert('Invalid email or password!');
      return false;
    }
  };

  const handleReporterLogout = () => {
    localStorage.removeItem('currentReporter');
    setCurrentReporter(null);
  };

  const handleDeleteAllData = () => {
    if (confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
      localStorage.removeItem('crisisReports');
      localStorage.removeItem('reporters');
      localStorage.removeItem('currentReporter');
      setReports([]);
      setCurrentReporter(null);
    }
  };

  const handleDeleteAllReports = () => {
    if (confirm('Are you sure you want to delete all reports? This cannot be undone!')) {
      localStorage.removeItem('crisisReports');
      setReports([]);
    }
  };

  const handleDeleteAllReporters = () => {
    if (confirm('Are you sure you want to delete all reporters? This cannot be undone!')) {
      localStorage.removeItem('reporters');
      localStorage.removeItem('currentReporter');
      setCurrentReporter(null);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'verified' && getVerificationStatus(report).status === 'verified') ||
                         (filter === 'pending' && getVerificationStatus(report).status === 'pending') ||
                         (filter === 'unverified' && getVerificationStatus(report).status === 'unverified');
    
    return matchesSearch && matchesFilter;
  });

  const ReporterLoginForm = () => (
    <div className="bg-white rounded-lg p-6 shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Reporter Login</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleReporterLogin({
          email: formData.get('email'),
          password: formData.get('password')
        });
      }}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );

  const ReporterRegisterForm = () => (
    <div className="bg-white rounded-lg p-6 shadow-xl">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Reporter Registration</h3>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        if (formData.get('password') !== formData.get('confirmPassword')) {
          alert('Passwords do not match!');
          return;
        }
        handleReporterRegister({
          name: formData.get('name'),
          email: formData.get('email'),
          password: formData.get('password')
        });
      }}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Crisis Reports Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor and verify crisis reports from around the world. Help ensure accurate information reaches emergency responders.
          </p>
        </div>

        {/* Authentication Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚨</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Reporter Authentication</h2>
                <p className="text-gray-600">Login or register to verify reports</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {currentReporter ? (
                <>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{currentReporter.name}</p>
                    <p className="text-sm text-gray-600">{currentReporter.email}</p>
                  </div>
                  <button
                    onClick={handleReporterLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => getVerificationStatus(r).status === 'verified').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => getVerificationStatus(r).status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unverified</p>
                <p className="text-2xl font-bold text-red-600">
                  {reports.filter(r => getVerificationStatus(r).status === 'unverified').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Reports</label>
              <input
                type="text"
                placeholder="Search by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              >
                <option value="all">All Reports</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-6">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Reports Found</h3>
              <p className="text-gray-600">
                {reports.length === 0 
                  ? "No crisis reports have been submitted yet." 
                  : "No reports match your current search or filter criteria."}
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const verificationStatus = getVerificationStatus(report);
              const approvals = report.approvals || [];
              const uniqueApprovals = [...new Set(approvals)];
              
              return (
                <div key={report.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Section */}
                    {report.image && (
                      <div className="lg:w-1/3">
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                          <img
                            src={report.image}
                            alt="Crisis report"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getCategoryIcon(report.category)}</span>
                            <h3 className="text-2xl font-bold text-gray-800">{report.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                              {formatDate(report.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                              {report.location}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(report.severity)} text-white`}>
                            {report.severity}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${verificationStatus.bgColor} ${verificationStatus.color}`}>
                            {verificationStatus.status.charAt(0).toUpperCase() + verificationStatus.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4 leading-relaxed">{report.description}</p>
                      
                      {/* Verification Progress */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Verification Progress</span>
                          <span className="text-sm text-gray-600">
                            {uniqueApprovals.length}/3 approvals
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              uniqueApprovals.length >= 3 ? 'bg-green-500' : 
                              uniqueApprovals.length > 0 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min((uniqueApprovals.length / 3) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        {currentReporter ? (
                          hasReporterApproved(report) ? (
                            <button
                              disabled
                              className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                            >
                              ✓ Already Approved
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApproveReport(report.id)}
                              disabled={verifying}
                              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {verifying ? 'Approving...' : 'Approve Report'}
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                          >
                            Login to Approve
                          </button>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          Category: {report.category}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Data Management */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mt-8 shadow-xl border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🗑️</span>
            Data Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleDeleteAllReports}
              className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              Delete All Reports
            </button>
            <button
              onClick={handleDeleteAllReporters}
              className="bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              Delete All Reporters
            </button>
            <button
              onClick={handleDeleteAllData}
              className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              Delete Everything
            </button>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {authMode === 'login' ? 'Reporter Login' : 'Reporter Registration'}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              {authMode === 'login' ? <ReporterLoginForm /> : <ReporterRegisterForm />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsList; 