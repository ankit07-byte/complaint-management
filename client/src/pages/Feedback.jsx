import { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';


const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingComplaints, setFetchingComplaints] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints/student');
        // Filter only resolved complaints
        const resolvedComplaints = res.data.data.filter(
          complaint => complaint.status === 'Resolved'
        );
        setComplaints(resolvedComplaints);
      } catch (error) {
        toast.error('Failed to fetch your complaints');
      } finally {
        setFetchingComplaints(false);
      }
    };
    
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedComplaint) {
      toast.error('Please select a complaint');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.post('/feedback', {
        complaintId: selectedComplaint,
        rating,
        comments
      });
      
      toast.success('Feedback submitted successfully');
      navigate('/student-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Feedback | BIT Mesra Complaint System</title>
      </Helmet>
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit Feedback</h1>
          
          {fetchingComplaints ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You don't have any resolved complaints to provide feedback for.</p>
              <button
                onClick={() => navigate('/student-dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="complaint" className="block text-sm font-medium text-gray-700">
                  Select Complaint
                </label>
                <select
                  id="complaint"
                  name="complaint"
                  value={selectedComplaint}
                  onChange={(e) => setSelectedComplaint(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="">Select a complaint</option>
                  {complaints.map(complaint => (
                    <option key={complaint._id} value={complaint._id}>
                      {complaint.token} - {complaint.subType} ({new Date(complaint.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="ml-2 text-gray-600">{rating} out of 5</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">
                  Comments (Optional)
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows="4"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                  placeholder="Share your experience with the complaint resolution..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Feedback;