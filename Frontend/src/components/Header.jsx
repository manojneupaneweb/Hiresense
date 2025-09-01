import React, { useState, useEffect } from 'react';
import Logo from '../../public/Hiresense.png';
import Login from './Login';
import Signup from './Signup';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [user, setUser] = useState(null); // State to store user data

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Job', href: '/job' },
    { name: 'How It Works', href: 'work' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ];

  // Check for existing user data on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Function to check if user is logged in by verifying tokens
  const checkAuthStatus = () => {
    // Check if we have access token in cookies
    const accessToken = getCookie('accessToken');
    
    if (accessToken) {
      // If we have a token, try to get user data from localStorage
      const userData = localStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // If no user data in storage but we have token, fetch user data
        fetchUserData(accessToken);
      }
    }
  };

  // Function to get cookie value by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Function to fetch user data using access token
  const fetchUserData = async (token) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
      } else {
        // If token is invalid, clear stored data
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Function to handle login success
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    setActiveForm(null); // Close the login form
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Clear local storage
    localStorage.removeItem('userData');
    
    // Reset user state
    setUser(null);
    
    // Close user menu
    setIsUserMenuOpen(false);
  };

  // Close forms when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setActiveForm(null);
    }
  };

  return (
    <>
      <header className="bg-white shadow-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  <img src={Logo} alt="Hiresense Logo" className="h-8 w-auto" />
                </div>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[#0097b2] to-[#2bbcef] bg-clip-text text-transparent">
                  Hiresence
                </span>
              </div>
            </div>
            <div className="hidden md:block ml-10">
              <nav className="flex space-x-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 hover:text-[#0097b2] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0097b2] transition-all duration-200 group-hover:w-full"></span>
                  </a>
                ))}
              </nav>
            </div>
            
            {/* User section - Conditionally render based on login status */}
            <div className="hidden md:block relative">
              {user ? (
                // Display user profile when logged in
                <div className="flex items-center">
                  <span className="mr-4 text-gray-700">Hi, {user.fullName}</span>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2bbcef] transition-transform duration-200 hover:scale-110"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#0097b2] to-[#2bbcef] flex items-center justify-center shadow-md cursor-pointer">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="h-10 w-10 rounded-full" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-3 w-48 rounded-lg shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-all duration-200 transform opacity-100 scale-100">
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#0097b2] transition-colors duration-200"
                      >
                        Your Profile
                      </a>
                      <a
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#0097b2] transition-colors duration-200"
                      >
                        Settings
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#0097b2] transition-colors duration-200"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Display login/signup buttons when not logged in
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2bbcef] transition-transform duration-200 hover:scale-110"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#0097b2] to-[#2bbcef] flex items-center justify-center shadow-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              )}

              {!user && isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-3 w-36 rounded-lg shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 transition-all duration-200 transform opacity-100 scale-100">
                  <button
                    onClick={() => {
                      setActiveForm('login');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#0097b2] transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setActiveForm('signup');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#0097b2] transition-colors duration-200 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-[#0097b2] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2bbcef]"
              >
                <span className="sr-only">Open main menu</span>
                {/* Hamburger icon */}
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-[#0097b2] block px-3 py-2 rounded-md text-base font-medium relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#0097b2] transition-all duration-200 group-hover:w-full"></span>
                </a>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-base font-medium text-gray-800">
                      Hi, {user.fullName}
                    </div>
                    <a
                      href="/profile"
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-[#0097b2] hover:bg-gray-50"
                    >
                      Your Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-[#0097b2] hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setActiveForm('login');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-[#0097b2] hover:bg-gray-50"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setActiveForm('signup');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-[#0097b2] hover:bg-gray-50"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Form Overlay with Glassmorphism Effect */}
      {activeForm && (
        <div 
          className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white/90 rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-95 animate-in fade-in-90 border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200/50 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {activeForm === 'login' ? 'Login to Your Account' : 'Create an Account'}
              </h3>
              <button 
                onClick={() => setActiveForm(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-5">
              {activeForm === 'login' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
              ) : (
                <Signup onSignupSuccess={handleLoginSuccess} />
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200/50">
              <p className="text-sm text-center text-gray-600">
                {activeForm === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => setActiveForm(activeForm === 'login' ? 'signup' : 'login')}
                  className="font-medium text-[#0097b2] hover:text-[#007a9b] transition-colors"
                >
                  {activeForm === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;