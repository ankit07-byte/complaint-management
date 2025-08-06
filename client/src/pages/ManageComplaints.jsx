import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

const ManageComplaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const url = '/complaints/authority';
        const response = await api.get(url);
        setComplaints(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
  
    fetchComplaints();
  }, [user]);
  

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    
    try {
      await api.put(`/complaints/${selectedComplaint._id}`, {
        status,
        remarks,
        assignedTo: user.id
      });
      
      toast.success('Complaint status updated successfully');
      setComplaints(complaints.map(comp => 
        comp._id === selectedComplaint._id ? 
        { ...comp, status, remarks, assignedTo: user.id } : comp
      ));
      setSelectedComplaint(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update complaint status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Complaints | BIT Mesra Complaint System</title>
      </Helmet>
      
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          {user.designation === 'Hostel Clerk' || user.designation === 'Warden' 
            ? `Hostel ${user.hostelNo} Complaints` 
            : 'All Complaints'}
        </h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  complaints.map(complaint => (
                    <tr key={complaint._id}>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{complaint.token}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{complaint.type}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">{complaint.subType}</td>
                      <td className="hidden sm:table-cell px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{complaint.description}</td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                            complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                            complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Status Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
                Update Complaint Status
              </h2>
              <form onSubmit={handleUpdateStatus}>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-1 sm:py-2 px-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="mb-3 sm:mb-4">
                  <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1 sm:mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-1 sm:py-2 px-2 sm:px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="3"
                    placeholder="Enter any remarks..."
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-2 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs sm:text-sm"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageComplaints;