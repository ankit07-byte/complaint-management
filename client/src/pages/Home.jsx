import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Home | BIT Mesra Complaint System</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-blue-800 text-white py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <img 
                  src="/Birla_Institute_of_Technology_Mesra_logo.png" 
                  alt="BIT Mesra Logo" 
                  className="h-20 sm:h-24 md:h-28 w-auto"
                />
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold whitespace-nowrap">BIT MESRA</h1>
              </div>
              <div className="bg-red-200/20 rounded-2xl p-2 sm:p-3 md:p-4 mt-2 sm:mt-3 md:mt-4 inline-block">
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold whitespace-nowrap mb-2 sm:mb-3 md:mb-4">Complaint System</h1>
              </div>
            </div>
            <p className="text-lg mt-1 sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
              A seamless platform for students to file complaints and track their resolution status.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                to="/student-login" 
                className="bg-white text-blue-800 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-red-100 hover:text-blue-800 transition"
              >
                Student Login
              </Link>
              <Link 
                to="/authority-login" 
                className="bg-transparent border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-800 transition"
              >
                Authority Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="border border-gray-300 rounded-3xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <h2 className="text-xl sm:text-3xl font-bold text-center px-4 bg-white text-gray-800">How It Works</h2>
              </div>
              <div className="pt-8 sm:pt-12 pb-8 sm:pb-12 px-6 sm:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="bg-gray-50 border border-gray-500/10 rounded-3xl  p-4 sm:p-6 shadow-sm">
                    <div className="bg-blue-100 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <svg className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">File a Complaint</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Students can easily file complaints regarding hostel or college issues with detailed descriptions.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-500/10 rounded-3xl p-4 sm:p-6 shadow-sm">
                    <div className="bg-blue-100 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <svg className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Track Status</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Each complaint gets a unique token number to track its status (Pending, In Progress, Resolved).
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 sm:p-6 border border-gray-500/10 rounded-3xl shadow-sm">
                    <div className="bg-blue-100 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <svg className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">Quick Resolution</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Complaints are automatically routed to the concerned authorities for quick resolution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;