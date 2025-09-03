import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const params = new URLSearchParams(location.search);

  const pidx = params.get("pidx");
  const transaction_id = params.get("transaction_id");
  const amount = params.get("amount");
  const status = params.get("status");

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate("/organization/dashboard");
    }, 5000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Transaction Details
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium text-green-600 capitalize">{status}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium text-gray-800">{transaction_id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Payment ID:</span>
              <span className="font-medium text-gray-800">{pidx}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-medium text-gray-800">${amount ? (amount / 100).toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Redirect Message */}
        <div className="text-center text-gray-600">
          <p>Redirecting to organization dashboard in {countdown} seconds...</p>
        </div>

        {/* Manual Redirect Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/organization/dashboard")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;