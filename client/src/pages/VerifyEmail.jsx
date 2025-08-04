import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';


const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email);
      setRole(location.state.role);
    } else {
      navigate(role === 'student' ? '/student-signup' : '/authority-signup');
    }
  }, [location, navigate, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = role === 'student' 
        ? '/auth/verify-email' 
        : '/auth/verify-authority-email';
      
      const response = await api.post(endpoint, {
        email,
        otp
      });
      
      toast.success(response.data.message);
      
      // Store token and redirect
      localStorage.setItem('token', response.data.token);
      
      if (role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/authority-dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Verify Email | BIT Mesra Complaint System</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent an OTP to {email}. Please enter it below to verify your email.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Didn't receive OTP?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => navigate(role === 'student' ? '/student-signup' : '/authority-signup')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;