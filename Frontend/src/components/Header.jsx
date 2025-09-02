import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Logo from '../../public/Hiresense.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Job', href: '/job' },
    { name: 'How It Works', href: '/work' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ];

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  const checkAuthStatus = async () => {
    // First check if we have user data in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing saved user data:', e);
        localStorage.removeItem('user');
      }
    }

    const token = getCookie('accessToken') || localStorage.getItem('accessToken');
    if (token) {
      try {
        const response = await axios.get('/api/user/getuser', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data.user);
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Clear invalid user data
        localStorage.removeItem('user');
        // if (error.response?.status === 401 || error.response?.status === 403) {
        //   handleLogout();
        // }
      }
    } else {
      console.log('No authentication token found');
      // Clear any existing user data if no token
      localStorage.removeItem('user');
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleLogin = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/user/login', credentials);
      localStorage.setItem('accessToken', response.data.accessToken);
      
      const { user: userData, token } = response.data;

      // Set token in cookie
      document.cookie = `accessToken=${token}; path=/; max-age=86400`; // 1 day

      setUser(userData);
      setActiveForm(null);
      setIsUserMenuOpen(false);
      toast.success(`Welcome back, ${userData.fullName}!`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (userData) => {
  setLoading(true);
  try {

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("fullName", userData.fullName);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("role", userData.role);

    // Append avatar file
    if (userData.avatar) {
      formData.append("avatar", userData.avatar); // avatar must be a File object
    }

    const response = await axios.post("/api/user/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { user: newUser, token } = response.data;

    document.cookie = `accessToken=${token}; path=/; max-age=86400`;
    setUser(newUser);
    setActiveForm(null);
    setIsUserMenuOpen(false);
    toast.success(`Account created successfully! Welcome, ${newUser.fullName}!`);
  } catch (error) {
    console.error("Signup error:", error);
    toast.error(error.response?.data?.message || "Signup failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    // Clear cookies and storage
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');

    setUser(null);
    setIsUserMenuOpen(false);
    toast.info('You have been logged out');
    window.location.href = '/';
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setActiveForm(null);
    }
  };

  const isOrganization = user && user.role === 'recruiter';

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <header className="bg-white shadow-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href="/">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  <img src={Logo} className='w-10' alt="Hiresense Logo" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Hiresence
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <nav className="flex space-x-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-gray-600 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-200 group-hover:w-full"></span>
                  </a>
                ))}
              </nav>
            </div>

            {/* User section */}
            <div className="hidden md:block relative">
              {user ? (
                <div className="flex items-center">
                  <span className="mr-4 text-gray-700">Hi, {user.fullName}</span>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform duration-200 hover:scale-110"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-md cursor-pointer">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="h-10 w-10 rounded-full" />
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      )}
                    </div>
                  </button>

                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 top-10 mt-3 w-48 rounded-lg shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      {isOrganization ? (
                        <>
                          <a
                            href="/organization/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-500 transition-colors duration-200"
                          >
                            <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                          </a>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-500 transition-colors duration-200"
                          >
                            <i className="fas fa-sign-out-alt mr-2"></i>Sign out
                          </button>
                        </>
                      ) : (
                        <>
                          <a
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-500 transition-colors duration-200"
                          >
                            <i className="fas fa-user-circle mr-2"></i>Your Profile
                          </a>
                          <a
                            href="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-500 transition-colors duration-200"
                          >
                            <i className="fas fa-cog mr-2"></i>Settings
                          </a>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-500 transition-colors duration-200"
                          >
                            <i className="fas fa-sign-out-alt mr-2"></i>Sign out
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform duration-200 hover:scale-110"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-md cursor-pointer">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                </button>
              )}

              {!user && isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-3 w-36 rounded-lg shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <button
                    onClick={() => {
                      setActiveForm('login');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-500 transition-colors duration-200 flex items-center"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>Login
                  </button>
                  <button
                    onClick={() => {
                      setActiveForm('signup');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-500 transition-colors duration-200 flex items-center"
                  >
                    <i className="fas fa-user-plus mr-2"></i>Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-blue-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 pb-3 border-t border-gray-200">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-base font-medium text-gray-800">
                      Hi, {user.fullName}
                    </div>
                    {isOrganization ? (
                      <>
                        <a
                          href="/dashboard"
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                        >
                          Dashboard
                        </a>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <a
                          href="/profile"
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                        >
                          Your Profile
                        </a>
                        <a
                          href="/settings"
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                        >
                          Settings
                        </a>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                        >
                          Sign Out
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setActiveForm('login');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setActiveForm('signup');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-gray-50"
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

      {/* Auth Form Overlay */}
      {activeForm && (
        <div
          className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white/90 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20">
            <div className="px-6 py-4 border-b border-gray-200/50 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {activeForm === 'login' ? 'Login to Your Account' : 'Create an Account'}
              </h3>
              <button
                onClick={() => setActiveForm(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="px-6 py-5">
              {activeForm === 'login' ? (
                <LoginForm onSubmit={handleLogin} loading={loading} />
              ) : (
                <SignupForm onSubmit={handleSignup} loading={loading} />
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200/50">
              <p className="text-sm text-center text-gray-600">
                {activeForm === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setActiveForm(activeForm === 'login' ? 'signup' : 'login')}
                  className="font-medium text-blue-500 hover:text-blue-700 transition-colors"
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
};

const LoginForm = ({ onSubmit, loading }) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(credentials);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};

const SignupForm = ({ onSubmit, loading }) => {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
    avatar: null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    onSubmit(userData);
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={userData.fullName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-colors"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-colors"
          required
        />
      </div>

      {/* Role */}
      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-semibold text-gray-800 mb-2"
        >
          I am a
        </label>
        <select
          id="role"
          name="role"
          value={userData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-blue-500 bg-white text-gray-700 transition-all"
        >
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-colors"
          required
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-colors"
          required
        />
      </div>

      {/* Avatar Upload */}
      <div>
        <label
          htmlFor="avatar"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Upload Avatar
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          onChange={(e) =>
            setUserData({ ...userData, avatar: e.target.files[0] })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-colors"
        />
        {userData.avatar && (
          <img
            src={URL.createObjectURL(userData.avatar)}
            alt="Avatar Preview"
            className="mt-2 w-16 h-16 rounded-full object-cover border"
          />
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 
                   text-white py-2 px-4 rounded-md hover:opacity-90 
                   transition-opacity focus:ring-2 focus:ring-offset-2 
                   focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};



export default Header;