import React, { useState } from 'react';

function Home() {
  const [email, setEmail] = useState('');

  const stats = [
    { number: '50K+', label: 'Jobs Posted' },
    { number: '30K+', label: 'Companies' },
    { number: '2M+', label: 'Candidates' },
    { number: '95%', label: 'Success Rate' },
  ];

  const features = [
    {
      title: 'Smart Matching',
      description: 'Our AI matches the right candidates with the right companies.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0097b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      title: 'Easy Process',
      description: 'Simple and intuitive hiring process for both employers and job seekers.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0097b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Time Saving',
      description: 'Reduce hiring time by up to 70% with our efficient platform.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#0097b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'HR Manager, TechCorp',
      content: 'Hiresence transformed our hiring process. We found the perfect candidates in half the time!',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Software Developer',
      content: 'The job matching algorithm is incredible. I received offers that perfectly matched my skills.',
      avatar: 'MC'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Startup Founder',
      content: 'As a small company, Hiresence helped us compete with big players for top talent.',
      avatar: 'ER'
    },
  ];



  return (
    <div className="min-h-screen bg-white">      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-cyan-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find Your <span className="bg-gradient-to-r from-[#0097b2] to-[#2bbcef] bg-clip-text text-transparent">Dream Job</span> or Candidate
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Hiresence connects top talent with leading companies through AI-powered matching and a streamlined hiring process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-gradient-to-r from-[#0097b2] to-[#2bbcef] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Get Started
                </button>
                <button className="border border-[#0097b2] text-[#0097b2] px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Happy team" 
                  className="rounded-xl w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 w-40">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold">2,500+ Hires</p>
                    <p className="text-xs text-gray-500">This Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-[#0097b2]">{stat.number}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Hiresence</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Our platform is designed to make hiring and job searching effortless and effective.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* How It Works Section */}
<section className="py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Our AI Interview Works</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Our AI mock interview process is simple, fast, and produces amazing results in just a few easy steps.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="text-center">
        <div className="bg-gradient-to-r from-[#0097b2] to-[#2bbcef] w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
        <h3 className="text-lg font-semibold mb-2">Upload Job Description</h3>
        <p className="text-gray-600">Paste or upload any job posting from popular job sites</p>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-r from-[#0097b2] to-[#2bbcef] w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
        <h3 className="text-lg font-semibold mb-2">Start Voice Interview</h3>
        <p className="text-gray-600">Begin your AI-powered mock interview with real-time voice interaction</p>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-r from-[#0097b2] to-[#2bbcef] w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
        <h3 className="text-lg font-semibold mb-2">Get Detailed Feedback</h3>
        <p className="text-gray-600">Receive comprehensive analysis and improvement suggestions</p>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-r from-[#0097b2] to-[#2bbcef] w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
        <h3 className="text-lg font-semibold mb-2">Ace the Real Interview</h3>
        <p className="text-gray-600">Apply your learnings and land your dream job with confidence</p>
      </div>
    </div>
  </div>
</section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-r from-[#0097b2] to-[#2bbcef]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">Hear from companies and candidates who have found success with Hiresence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-[#0097b2] to-[#2bbcef] w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Hiring Process?</h2>
          <p className="text-gray-600 mb-8">Join thousands of companies and candidates who have found success with Hiresence</p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0097b2]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="bg-gradient-to-r from-[#0097b2] to-[#2bbcef] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
                Get Started
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">We care about your data. Read our <a href="#" className="text-[#0097b2] hover:underline">Privacy Policy</a></p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about the platform</p>
          </div>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-2">How does the matching algorithm work?</h3>
              <p className="text-gray-600">Our AI analyzes skills, experience, company culture, and job requirements to find the perfect match between candidates and employers.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-2">Is there a free trial available?</h3>
              <p className="text-gray-600">Yes, we offer a 14-day free trial for all our plans. No credit card required to get started.</p>
            </div>
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold mb-2">How do I get support if I need help?</h3>
              <p className="text-gray-600">We offer 24/7 customer support via email, chat, and phone for all our users regardless of their plan.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;