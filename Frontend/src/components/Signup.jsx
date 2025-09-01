import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        avatar: null
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const handleChange = (e) => {
        const { id, value, files } = e.target;

        if (id === 'avatar') {
            const file = files[0];
            setFormData(prevState => ({
                ...prevState,
                avatar: file
            }));

            // Create preview for image
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    setAvatarPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setAvatarPreview(null);
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                [id]: value
            }));
        }

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

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

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

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
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

        try {
            // Create FormData object for file upload
            const submitData = new FormData();
            submitData.append('fullName', formData.fullName);
            submitData.append('email', formData.email);
            submitData.append('password', formData.password);

            if (formData.avatar) {
                submitData.append('avatar', formData.avatar);
            }

            const response = await axios.post("/api/user/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log('Signup successful:', response.data);
            setSignupSuccess(true);

            // Reset form after successful signup
            setFormData({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                avatar: null
            });
            setAvatarPreview(null);

        } catch (error) {
            console.error('Signup error:', error);

            // Handle different error responses
            if (error.response) {
                // The server responded with an error status
                setErrors({ submit: error.response.data.message || 'Signup failed. Please try again.' });
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
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0097b2] focus:border-transparent transition-colors`}
                        placeholder="Ram Bahadur"
                    />
                    {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                </div>
            </div>

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

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#0097b2] focus:border-transparent transition-colors`}
                    placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        {avatarPreview ? (
                            <img
                                src={avatarPreview}
                                alt="Avatar preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            onChange={handleChange}
                            className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:ring-2 focus:ring-[#0097b2] focus:border-transparent transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-[#0097b2] focus:ring-[#0097b2] border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-[#0097b2] hover:text-[#007a9b] transition-colors">Terms and Conditions</a>
                </label>
            </div>

            {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {errors.submit}
                </div>
            )}

            {signupSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                    Account created successfully! You can now login.
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
                        Creating Account...
                    </>
                ) : (
                    'Create Account'
                )}
            </button>
        </form>
    );
};

export default Signup;