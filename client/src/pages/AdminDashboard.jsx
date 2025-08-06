import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalFeedback: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [complaintsRes, feedbackRes] = await Promise.all([
          api.get('/complaints/admin/all'),
          api.get('/feedback')
        ]);

        const totalComplaints = complaintsRes.data.count;
        const pendingComplaints = complaintsRes.data.data.filter(
          c => c.status === 'Pending'
        ).length;
        const resolvedComplaints = complaintsRes.data.data.filter(
          c => c.status === 'Resolved'
        ).length;

        const totalFeedback = feedbackRes.data.count;
        const averageRating = feedbackRes.data.count > 0
          ? feedbackRes.data.data.reduce((sum, f) => sum + f.rating, 0) / feedbackRes.data.count
          : 0;

        setStats({
          totalComplaints,
          pendingComplaints,
          resolvedComplaints,
          totalFeedback,
          averageRating: parseFloat(averageRating.toFixed(1))
        });
      } catch (error) {
        toast.error('Failed to fetch dashboard data');
        console.error("Dashboard fetch error:", error?.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <title>Admin Dashboard | BIT Mesra Complaint System</title>
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-medium text-gray-500">Total Complaints</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1 sm:mt-2">{stats.totalComplaints}</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-medium text-gray-500">Pending Complaints</h3>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-1 sm:mt-2">{stats.pendingComplaints}</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-medium text-gray-500">Resolved Complaints</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{stats.resolvedComplaints}</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-base sm:text-lg font-medium text-gray-500">Avg. Rating</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">
              {stats.averageRating}/5
            </p>
          </div>
        </div>

        {/* Bottom Section - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3 sm:mb-4">Quick Actions</h3>
            <div className="space-y-2 sm:space-y-3">
              <Link
                to="/notifications"
                className="block px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition text-sm sm:text-base"
              >
                📢 Post Notification
              </Link>

              <Link
                to="/view-complaints"
                className="block px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition text-sm sm:text-base"
              >
                View All Complaints
              </Link>

              <Link
                to="/view-complaints?type=College"
                className="block px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition text-sm sm:text-base"
              >
                View College Complaints
              </Link>
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-3 sm:mb-4">Recent Feedback</h3>
            {stats.totalFeedback === 0 ? (
              <p className="text-gray-500 text-sm sm:text-base">No feedback submitted yet</p>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start">
                  <div className="text-yellow-400 text-lg sm:text-xl">★★★★★</div>
                  <div className="ml-2 sm:ml-3">
                    <p className="text-xs sm:text-sm text-gray-600">"The complaint was resolved very quickly. Excellent service!"</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-yellow-400 text-lg sm:text-xl">★★★☆☆</div>
                  <div className="ml-2 sm:ml-3">
                    <p className="text-xs sm:text-sm text-gray-600">"It took some time but the issue was finally resolved."</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;