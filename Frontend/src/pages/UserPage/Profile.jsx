import axios from 'axios';
import React, { useState, useEffect } from 'react';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myScores, setMyScores] = useState([]);

  useEffect(() => {
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
      }
    };

    const getMyScorecard = async () => {
      try {
        const response = await axios.get('/api/interviewScore/getmyscorecard', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });

        if (response.data) {
          setMyScores(response.data);
        }
      } catch (err) {
        console.error('Error fetching scorecard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    getMyScorecard();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    if (score >= 40) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                onClick={() => {}}
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

        {/* Interview Scores Section */}
        {myScores.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">My Interview Scores</h2>
            <div className="space-y-4">
              {myScores.map((score, index) => (
                <div key={score._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{score.jobId.title}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(score.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-800">
                        {score.interviewScore ?? "N/A"}
                      </p>
                      <p className={`text-sm font-medium ${getScoreColor(score.cvScore)}`}>
                        CV: {score.cvScore}/100
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {myScores.length > 0 && (
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium">Scorecards Generated</h4>
                  <p className="text-xs text-gray-500">You have {myScores.length} interview scorecard{myScores.length > 1 ? 's' : ''}</p>
                  <p className="text-xs text-gray-400 mt-1">Latest: {myScores[0]?.jobId?.title}</p>
                </div>
              </div>
            )}

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