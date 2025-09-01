import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setLoginSuccess(false);
    
    try {
      const response = await axios.post('/api/user/loginuser', {
        email: formData.email,
        password: formData.password
      });
      
      // Handle successful login
      console.log('Login successful:', response.data);
      setLoginSuccess(true);
      
      // You might want to redirect the user or store the authentication token
      // For example: localStorage.setItem('authToken', response.data.token);
      
      // Reset form after successful login
      setFormData({
        email: '',
        password: ''
      });
      
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error responses
      if (error.response) {
        // The server responded with an error status
        setErrors({ submit: error.response.data.message || 'Login failed. Please try again.' });
      } else if (error.request) {
        // The request was made but no response was received
        setErrors({ submit: 'Network error. Please check your connection.' });
      } else {
        // Something else happened
        setErrors({ submit: 'An unexpected error occurred.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input 
          type="email" 
          id="email" 
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0097b2] focus:border-transparent transition-colors`}
          placeholder="your.email@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input 
          type="password" 
          id="password" 
          value={formData.password}
          onChange={handleChange}
          className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0097b2] focus:border-transparent transition-colors`}
          placeholder="••••••••"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="remember" 
            className="h-4 w-4 text-[#0097b2] focus:ring-[#0097b2] border-gray-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
        </div>
        <a href="#" className="text-sm text-[#0097b2] hover:text-[#007a9b] transition-colors">Forgot password?</a>
      </div>
      
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {errors.submit}
        </div>
      )}
      
      {loginSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
          Login successful! Redirecting...
        </div>
      )}
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#0097b2] to-[#2bbcef] text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity focus:ring-2 focus:ring-offset-2 focus:ring-[#0097b2] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
};

export default Login;