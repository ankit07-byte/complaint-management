import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../utils/api';

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    hostelNo: '',
    type: '',
    status: ''
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const hostelNo = queryParams.get('hostelNo') || '';
    const type = queryParams.get('type') || '';
    const status = queryParams.get('status') || '';

    setFilter({ hostelNo, type, status });

    fetchComplaints(hostelNo, type, status);
  }, [location]);

  const fetchComplaints = async (hostelNo, type, status) => {
    setLoading(true);
    try {
      let url = '/complaints/admin/all';
      const params = new URLSearchParams();

      if (hostelNo) params.append('hostelNo', hostelNo);
      if (type) params.append('type', type);
      if (status) params.append('status', status);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await api.get(url);
      setComplaints(res.data.data);
    } catch (error) {
      toast.error('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filter.hostelNo) params.append('hostelNo', filter.hostelNo);
    if (filter.type) params.append('type', filter.type);
    if (filter.status) params.append('status', filter.status);

    navigate(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilter({
      hostelNo: '',
      type: '',
      status: ''
    });
    navigate('');
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
        <title>View Complaints | BIT Mesra Complaint System</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">View Complaints</h1>

        <div className="bg-white shadow rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-md sm:text-lg font-medium text-gray-800 mb-3 sm:mb-4">Filters</h2>

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div>
              <label htmlFor="hostelNo" className="block text-sm font-medium text-gray-700">
                Hostel No
              </label>
              <select
                id="hostelNo"
                name="hostelNo"
                value={filter.hostelNo}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Hostels</option>
                {[...Array(13).keys()].map(num => (
                  <option key={num + 1} value={num + 1}>Hostel {num + 1}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Complaint Type
              </label>
              <select
                id="type"
                name="type"
                value={filter.type}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option value="Hostel">Hostel</option>
                <option value="College">College</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 sm:space-x-3 mt-4">
            <button
              onClick={clearFilters}
              className="px-3 sm:px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition text-sm sm:text-base"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm sm:text-base"
            >
              Apply
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No complaints found
                    </td>
                  </tr>
                ) : (
                  complaints.map(complaint => (
                    <tr key={complaint._id}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{complaint.token}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.type}</td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.student?.name} ({complaint.student?.rollNo})
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{complaint.subType}</td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {complaint.assignedTo?.name || '-'}
                        {complaint.assignedTo?.designation && ` (${complaint.assignedTo.designation})`}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewComplaints;