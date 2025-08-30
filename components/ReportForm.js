'use client';

import { useState } from 'react';

export default function ReportForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    severity: 'medium',
    category: 'natural-disaster'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Submitting your crisis report...');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Convert image to base64 for storage
      let imageData = null;
      if (selectedFile) {
        const reader = new FileReader();
        imageData = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(selectedFile);
        });
      }
      
      const report = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        location: formData.location,
        severity: formData.severity,
        category: formData.category,
        image: imageData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // Store in localStorage
      const existingReports = JSON.parse(localStorage.getItem('crisisReports') || '[]');
      existingReports.push(report);
      localStorage.setItem('crisisReports', JSON.stringify(existingReports));
      
      setSubmitStatus('Report submitted successfully!');
      
      setFormData({ 
        title: '', 
        description: '', 
        location: '', 
        severity: 'medium',
        category: 'natural-disaster'
      });
      setSelectedFile(null);
      
      setTimeout(() => {
        setSubmitStatus('');
        alert('Crisis report submitted successfully!');
      }, 2000);
      
    } catch (error) {
      setSubmitStatus('Failed to submit report. Please try again.');
      setTimeout(() => setSubmitStatus(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Crisis Response Network
        </h1>
        <p className="text-xl text-gray-600">
          Submit verified crisis reports to coordinate emergency response efforts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="text-3xl font-bold">24/7</div>
          <div className="text-blue-100">Active Monitoring</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="text-3xl font-bold">1,247</div>
          <div className="text-green-100">Reports Processed</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="text-3xl font-bold">89%</div>
          <div className="text-purple-100">Response Rate</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit Crisis Report</h2>
            <p className="text-gray-600">Help coordinate emergency response efforts</p>
          </div>
        </div>

        {submitStatus && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse mr-3"></div>
              <p className="text-blue-800">{submitStatus}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Crisis Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Brief, descriptive title of the crisis situation"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Crisis Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="natural-disaster">Natural Disaster</option>
                <option value="medical-emergency">Medical Emergency</option>
                <option value="fire">Fire</option>
                <option value="flood">Flood</option>
                <option value="earthquake">Earthquake</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-semibold text-gray-700 mb-2">
                Severity Level *
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="low">Low - Minor incident</option>
                <option value="medium">Medium - Moderate impact</option>
                <option value="high">High - Significant impact</option>
                <option value="critical">Critical - Life-threatening</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="City, State, Country or specific coordinates"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Provide detailed information about the crisis situation, people affected, immediate needs..."
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
              Upload Image (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                {selectedFile ? (
                  <div>
                    <img 
                      src={URL.createObjectURL(selectedFile)} 
                      alt="Preview" 
                      className="max-h-32 mx-auto rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600">Click to upload an image</p>
                    <p className="text-xs text-gray-500 mt-1">Supports: JPG, PNG, GIF</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Submitting Report...
                </div>
              ) : (
                'Submit Crisis Report'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-red-600 font-semibold text-xs">1</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Submit Report</div>
                <div>Fill out the form with crisis details</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-red-600 font-semibold text-xs">2</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Review Process</div>
                <div>Emergency responders review and verify</div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-red-600 font-semibold text-xs">3</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Response Action</div>
                <div>Coordinated emergency response deployed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 