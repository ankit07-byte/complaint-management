import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AuthorityDashboard = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints/authority');

        // Filter complaints based on authority type
        let filteredComplaints = res.data.data;

        if (user?.department === 'Network') {
          filteredComplaints = res.data.data.filter(complaint =>
            complaint.type === 'Network' ||
            complaint.subType === 'Network' ||
            complaint.subType === 'Internet'
          );
        } else if (user?.designation === 'Hostel Clerk' || user?.designation === 'Warden') {
          filteredComplaints = res.data.data;
        }

        setComplaints(filteredComplaints);

        const pending = filteredComplaints.filter(c => c.status === 'Pending').length;
        const resolved = filteredComplaints.filter(c => c.status === 'Resolved').length;

        setStats({
          total: filteredComplaints.length,
          pending,
          resolved
        });

      } catch (error) {
        toast.error('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

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
        <title>Dashboard | BIT Mesra Complaint System</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {user?.designation}
              {user?.department ? ` - ${user.department} Department` : ''}
              {user?.hostelNo ? ` - Hostel ${user.hostelNo}` : ''}
            </p>
          </div>
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/notifications"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition text-sm sm:text-base"
            >
              📢 Post Notification
            </Link>
            <Link
              to="/manage-complaints"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-md transition text-sm sm:text-base"
            >
              Manage Complaints
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-medium text-gray-500">Total Complaints</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">
              {stats.total}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-medium text-gray-500">Pending Complaints</h3>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1 sm:mt-2">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-medium text-gray-500">Resolved Complaints</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">
              {stats.resolved}
            </p>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2">
            <h2 className="text-base sm:text-lg font-medium text-gray-800">Recent Complaints</h2>
            {complaints.length > 5 && (
              <Link
                to="/manage-complaints"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            )}
          </div>

          {complaints.length === 0 ? (
            <div className="p-4 sm:p-6 text-center text-sm sm:text-base text-gray-500">
              No complaints found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="hidden xs:table-cell px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {complaints.slice(0, 5).map(complaint => (
                    <tr key={complaint._id}>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                        <Link
                          to={`/complaint-status?token=${complaint.token}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {complaint.token}
                        </Link>
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 capitalize">
                        {complaint.type}
                      </td>
                      <td className="px-3 sm:px-6 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${complaint.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="hidden xs:table-cell px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthorityDashboard;