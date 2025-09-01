import React from "react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900">How It Works</h1>
          <p className="mt-4 text-xl text-gray-600">
            Find your dream job or the perfect candidate in just a few simple
            steps
          </p>
        </div>

        {/* Tabs for Job Seekers vs Employers */}
        <div className="flex justify-center mb-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="whitespace-nowrap pb-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                For Job Seekers
              </button>
              <button className="whitespace-nowrap pb-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                For Employers
              </button>
            </nav>
          </div>
        </div>

        {/* Steps for Job Seekers */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Find Your Dream Job in 4 Easy Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Search Jobs
              </h3>
              <p className="text-gray-600">
                Browse through thousands of job listings filtered by category,
                location, salary, and more.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Apply with Profile
              </h3>
              <p className="text-gray-600">
                Create a profile showcasing your skills and experience, then
                apply to jobs with a single click.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Get Noticed
              </h3>
              <p className="text-gray-600">
                Employers review your application and profile. Stand out with a
                complete and compelling profile.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">4</span>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Land Your Job
              </h3>
              <p className="text-gray-600">
                Interview with employers and receive offers directly through the
                platform. Start your new career!
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-20 text-white text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-lg">Jobs Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg">Companies Hiring</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-lg">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* For Employers Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Hire Top Talent in 3 Simple Steps
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-2/5 mb-8 md:mb-0">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl font-bold text-purple-600">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Post a Job
                    </h3>
                    <p className="text-gray-600">
                      Create a compelling job listing with details about the
                      role, requirements, and benefits.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 mt-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl font-bold text-purple-600">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Review Applications
                    </h3>
                    <p className="text-gray-600">
                      Browse through qualified candidates, filter applications,
                      and shortlist the best fits.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 mt-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl font-bold text-purple-600">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Hire the Best
                    </h3>
                    <p className="text-gray-600">
                      Connect with candidates, schedule interviews, and make
                      offers to your top choices.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="bg-gray-100 rounded-xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-24 h-24 text-gray-400 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2h2a2 2 0 002-2V6m0 0v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2a2 2 0 012-2h4a2 2 0 012 2h2a2 2 0 012 2z"
                    />
                  </svg>
                  <p className="mt-4 text-gray-600">
                    Visual representation of the hiring process
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Success Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                  <p className="text-sm text-gray-600">
                    Software Engineer at TechCorp
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I found my dream job in just two weeks! The application process
                was so smooth, and I connected with amazing companies."
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">Michael Chen</h3>
                  <p className="text-sm text-gray-600">
                    HR Manager at DataSystems
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "We've hired over 50 talented professionals through this
                platform. The quality of applicants is exceptional."
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Jessica Williams
                  </h3>
                  <p className="text-sm text-gray-600">
                    UX Designer at DesignHub
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The profile system helped me showcase my portfolio effectively.
                I received multiple offers within a week of joining!"
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">
            Join thousands of job seekers and employers who have found success
            with our platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200">
              Create Your Profile
            </button>
            <button className="bg-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-900 transition-colors duration-200">
              Post a Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
