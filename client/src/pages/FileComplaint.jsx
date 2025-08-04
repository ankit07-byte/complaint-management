import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const FileComplaint = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    type: 'Hostel',
    hostelNo: '',
    roomNo: '',
    subType: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const startTime = performance.now();

    try {
      const response = await api.post('/complaints', {
        ...formData,
        student: user.id
      });

      const duration = performance.now() - startTime;
      console.log(`Complaint submission took ${duration.toFixed(2)} ms`);

      toast.success(`Complaint filed successfully! Token: ${response.data.token}`);
      setFormData({
        type: 'Hostel',
        hostelNo: '',
        roomNo: '',
        subType: '',
        description: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to file complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Helmet>
        <title>File Complaint | BIT Mesra Complaint System</title>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">File a Complaint</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complaint Type
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="Hostel"
                    checked={formData.type === 'Hostel'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">Hostel</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="College"
                    checked={formData.type === 'College'}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">College</span>
                </label>
              </div>
            </div>

            {formData.type === 'Hostel' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hostelNo" className="block text-sm font-medium text-gray-700">
                      Hostel No (1-13)
                    </label>
                    <select
                      id="hostelNo"
                      name="hostelNo"
                      required
                      value={formData.hostelNo}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select Hostel</option>
                      {[...Array(13).keys()].map(num => (
                        <option key={num + 1} value={num + 1}>Hostel {num + 1}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="roomNo" className="block text-sm font-medium text-gray-700">
                      Room No
                    </label>
                    <input
                      type="text"
                      id="roomNo"
                      name="roomNo"
                      required
                      value={formData.roomNo}
                      onChange={handleChange}
                      className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </>
            )}

            {formData.type === 'Hostel' ? (
              <div>
                <label htmlFor="subType" className="block text-sm font-medium text-gray-700">
                  Problem Type
                </label>
                <select
                  id="subType"
                  name="subType"
                  required
                  value={formData.subType}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Problem Type</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Internet">Internet</option>
                  <option value="Network">Network</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Fan">Fan</option>
                  <option value="Socket">Socket</option>
                  <option value="Bulb">Bulb</option>
                  <option value="Window Glass">Window Glass</option>
                  <option value="Chair">Chair</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            ) : (
              <div>
                <label htmlFor="subType" className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  id="subType"
                  name="subType"
                  required
                  value={formData.subType}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Department</option>
                  <option value="Electrical">Electrical</option>
                  <option value="IT Support">IT Support</option>
                  <option value="Housekeeping">Housekeeping</option>
                  <option value="Academic">Academic</option>
                  <option value="Examination">Examination</option>
                  <option value="Library">Library</option>
                  <option value="Canteen">Canteen</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}


            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                placeholder="Please describe your complaint in detail..."
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default FileComplaint;