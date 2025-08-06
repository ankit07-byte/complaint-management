import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AuthoritySignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: '',
    hostelNo: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'designation' && value === 'Network Department' && { hostelNo: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/authority-signup', {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        designation: formData.designation,
        department: formData.designation === 'Network Department' ? 'Network' : undefined,
        hostelNo: formData.designation === 'Hostel Clerk' || formData.designation === 'Warden' 
          ? formData.hostelNo 
          : undefined,
        password: formData.password
      });
      
      toast.success(response.data.message);
      navigate('/verify-email', { 
        state: { 
          email: formData.email,
          role: 'authority' 
        } 
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Authority Signup | BIT Mesra Complaint System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-2 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create authority account
          </h2>
          <p className="mt-2 text-center text-xs sm:text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/authority-login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 sm:mt-8 mx-auto w-full max-w-md">
          <div className="bg-white py-6 px-4 shadow rounded-lg sm:py-8 sm:px-10">
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                  College Email (@bitmesra.ac.in)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="mobile" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Mobile Number (India)
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="designation" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Designation
                </label>
                <select
                  id="designation"
                  name="designation"
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={formData.designation}
                  onChange={handleChange}
                >
                  <option value="">Select Designation</option>
                  <option value="Hostel Clerk">Hostel Clerk</option>
                  <option value="Warden">Warden</option>
                  <option value="Network Department">Network Department</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {(formData.designation === 'Hostel Clerk' || formData.designation === 'Warden') && (
                <div>
                  <label htmlFor="hostelNo" className="block text-xs sm:text-sm font-medium text-gray-700">
                    Hostel No (1-13)
                  </label>
                  <select
                    id="hostelNo"
                    name="hostelNo"
                    required={formData.designation === 'Hostel Clerk' || formData.designation === 'Warden'}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    value={formData.hostelNo}
                    onChange={handleChange}
                  >
                    <option value="">Select Hostel</option>
                    {[...Array(13).keys()].map(num => (
                      <option key={num+1} value={num+1}>Hostel {num+1}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength="8"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength="8"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Signing up...' : 'Sign up'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthoritySignup;