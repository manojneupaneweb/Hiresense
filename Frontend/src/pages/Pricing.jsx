import React, { useState } from "react";
import { initiateKhaltiPayment } from "../../utils/payment";

function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or annual
  const [currency, setCurrency] = useState("USD"); // USD or NPR

  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly");
  };
  const toggleCurrency = () => {
    setCurrency(currency === "USD" ? "NPR" : "USD");
  };

  const exchangeRate = 133.5;

  const plans = [
    {
      name: "Basic",
      description: "For individuals and small teams",
      monthlyPrice: 5,
      annualPrice: 50, // Changed to reflect actual annual price (5*10 = 50)
      annualSavings: "17%",
      features: [
        "Post up to 5 jobs",
        "30-day listing duration",
        "Basic analytics",
        "Email support",
        "100 applicant profiles",
      ],
      cta: "Get Started",
      popular: false,
      color: "blue",
    },
    {
      name: "Professional",
      description: "For growing businesses",
      monthlyPrice: 49,
      annualPrice: 470, // Changed to reflect actual annual price (49*10 = 490, with discount 470)
      annualSavings: "20%",
      features: [
        "Post up to 20 jobs",
        "60-day listing duration",
        "Advanced analytics",
        "Priority email & chat support",
        "500 applicant profiles",
        "Company branding",
        "Custom application form",
      ],
      cta: "Get Started",
      popular: true,
      color: "purple",
    },
    {
      name: "Enterprise",
      description: "For large organizations",
      monthlyPrice: 99,
      annualPrice: 950, // Changed to reflect actual annual price (99*10 = 990, with discount 950)
      annualSavings: "20%",
      features: [
        "Unlimited job posts",
        "90-day listing duration",
        "Premium analytics dashboard",
        "24/7 phone support",
        "Unlimited applicant profiles",
        "Advanced company branding",
        "Custom workflows",
        "API access",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      popular: false,
      color: "gray",
    },
  ];

  const formatPrice = (price) => {
    if (currency === "NPR") {
      return `NPR ${(price * exchangeRate).toLocaleString("en-NP")}`;
    }
    return `$${price.toLocaleString("en-US")}`;
  };

  const handlePayment = (plan) => {
    if (plan.name === "Enterprise") {
      // For Enterprise plan, redirect to contact page instead of payment
      window.location.href = "/contact";
      return;
    }

    // Calculate price based on billing cycle and currency
    const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
    const amount = currency === "USD" ? price * exchangeRate * 100 : price * 100; // Convert to paisa
    
    // Generate a unique product ID (you might want to use a different logic)
    const productId = `${plan.name}-${billingCycle}-${Date.now()}`;
    
    // Determine redirect URL based on success
    const redirectUrl = `${window.location.origin}/payment-success`;
    
    console.log("Initiating payment for:", plan.name, "Amount:", amount, "Product ID:", productId);
    
    // Initiate Khalti payment
    initiateKhaltiPayment(amount, productId, redirectUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that works best for your hiring needs
          </p>

          {/* Combined Billing and Currency Toggle */}
          <div className="mt-8 flex flex-col items-center space-y-4 md:flex-row md:justify-center md:space-y-0 md:space-x-8">
            {/* Billing Toggle */}
            <div className="flex items-center">
              <span
                className={`text-lg font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"
                  }`}
              >
                Monthly
              </span>
              <button
                onClick={toggleBillingCycle}
                className="mx-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                style={{
                  backgroundColor:
                    billingCycle === "monthly" ? "#d1d5db" : "#3b82f6",
                }}
              >
                <span className="sr-only">Toggle billing cycle</span>
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${billingCycle === "monthly"
                    ? "translate-x-0"
                    : "translate-x-5"
                    }`}
                />
              </button>
              <div className="flex items-center">
                <span
                  className={`text-lg font-medium ${billingCycle === "annual"
                    ? "text-gray-900"
                    : "text-gray-500"
                    }`}
                >
                  Annual
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                  Save up to 20%
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block h-6 w-px bg-gray-300"></div>

            {/* Currency Toggle */}
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-700 mr-3">
                Currency:
              </span>
              <button
                onClick={toggleCurrency}
                className="relative inline-flex items-center px-3 py-2 rounded-lg bg-white border border-gray-300 shadow-sm"
              >
                <span
                  className={`px-2 py-1 rounded-md transition-colors ${currency === "USD"
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "text-gray-600"
                    }`}
                >
                  USD
                </span>
                <span
                  className={`px-2 py-1 rounded-md transition-colors ${currency === "NPR"
                    ? "bg-blue-100 text-blue-800 font-medium"
                    : "text-gray-600"
                    }`}
                >
                  NPR
                </span>
                <span
                  className={`absolute inset-y-1 left-1 w-12 bg-blue-500 rounded-md transition-transform duration-300 ease-in-out ${currency === "USD"
                    ? "transform translate-x-0"
                    : "transform translate-x-12"
                    }`}
                  style={{ zIndex: -1 }}
                ></span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${plan.popular
                ? "ring-2 ring-purple-500 transform hover:scale-105"
                : "border border-gray-200 transform hover:scale-102"
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 text-sm font-semibold rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h2>
                <p className="mt-2 text-gray-600">{plan.description}</p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {formatPrice(
                      billingCycle === "monthly"
                        ? plan.monthlyPrice
                        : plan.annualPrice
                    )}
                  </span>
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    {billingCycle === "monthly" ? "/month" : "/year"}
                  </span>
                </div>

                {billingCycle === "annual" && (
                  <p className="mt-1 text-sm text-green-600">
                    Save {plan.annualSavings} compared to monthly billing
                  </p>
                )}

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-gray-50">
                <button
                  onClick={() => handlePayment(plan)}
                  className={`w-full py-3 px-4 rounded-md text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:shadow-md ${plan.popular
                    ? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 hover:-translate-y-0.5"
                    : plan.name === "Enterprise"
                      ? "bg-gray-800 hover:bg-gray-900 focus:ring-gray-500 hover:-translate-y-0.5"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 hover:-translate-y-0.5"
                    }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-900">
                Can I change my plan later?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. When
                upgrading, the new rate will be applied immediately. When
                downgrading, the change will take effect at the start of your
                next billing cycle.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-900">
                Do you offer discounts for nonprofits?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, we offer a 25% discount for registered nonprofit
                organizations. Please contact our sales team with proof of your
                nonprofit status to get started.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-900">
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for
                annual plans. All payments are processed securely through our
                payment partners.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-medium text-gray-900">
                Is there a setup fee?
              </h3>
              <p className="mt-2 text-gray-600">
                No, there are no setup fees for any of our plans. You only pay
                the monthly or annual subscription fee for your selected plan.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center transform hover:-translate-y-1 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-white">
            Still have questions?
          </h2>
          <p className="mt-2 text-blue-100">
            Our team is here to help you choose the right plan for your business
            needs.
          </p>
          <div className="mt-6">
            <button 
              onClick={() => window.location.href = "/contact"}
              className="bg-white text-blue-600 px-6 py-3 rounded-md text-base font-medium hover:bg-blue-50 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;