import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem("accessToken");
    
    if (!token) {
      setError('No authentication token found. Please log in.');
      setLoading(false);
      return;
    }   

    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user/getuser', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });

        if (response.data && response.data.user) {
          setUserData(response.data.user);
        } else {
          setError('Invalid user data received');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <h2 className="mt-6 text-xl font-medium text-gray-900">Loading your profile...</h2>
            <p className="mt-2 text-sm text-gray-600">Please wait while we fetch your information</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Oops! Something went wrong</h3>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900">No user data available</h3>
            <p className="mt-2 text-sm text-gray-600">Please check your connection and try again</p>
          </div>
        </div>
      </div>
    );
  }

  // Format the date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0">
                {userData.avatar ? (
                  <img 
                    src={userData.avatar} 
                    alt={userData.fullName} 
                    className="h-24 w-24 rounded-full object-cover border-4 border-white border-opacity-30"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl font-bold">
                    {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                <h1 className="text-2xl font-bold">{userData.fullName}</h1>
                <p className="text-blue-100">{userData.email}</p>
                <p className="mt-2 text-blue-100 capitalize">{userData.role || 'User'}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Personal Details</h3>
                <dl className="mt-2 space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Full Name</dt>
                    <dd className="text-sm text-gray-900">{userData.fullName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Email Address</dt>
                    <dd className="text-sm text-gray-900">{userData.email}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Role</dt>
                    <dd className="text-sm text-gray-900 capitalize">{userData.role}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account Information</h3>
                <dl className="mt-2 space-y-3">
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Member Since</dt>
                    <dd className="text-sm text-gray-900">{formatDate(userData.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Last Updated</dt>
                    <dd className="text-sm text-gray-900">{formatDate(userData.updatedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Status</dt>
                    <dd className="text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {/* Add edit functionality */}}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium">Profile updated</h4>
                <p className="text-xs text-gray-500">You updated your profile information</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(userData.updatedAt)}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium">Account created</h4>
                <p className="text-xs text-gray-500">You successfully created your account</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(userData.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;