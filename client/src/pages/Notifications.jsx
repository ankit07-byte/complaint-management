import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from '../context/AuthContext';


const Notifications = () => {
  const [formData, setFormData] = useState({ title: "", message: "", hostel: "" });
  const [pdf, setPdf] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const currentHostel = user?.hostelNo || 'all'; 


  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/notifications/${currentHostel}`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("message", formData.message);
    data.append("hostel", formData.hostel);
    if (pdf) data.append("pdf", pdf);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/notifications", data);
      toast.success("Notification posted!");
      setFormData({ title: "", message: "", hostel: "" });
      setPdf(null);
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to post notification");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`);
      toast.success("Notification deleted");
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Post Notification</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-10 space-y-4">
        <input
          type="text"
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        />
        <textarea
          placeholder="Message"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full border px-4 py-2 rounded"
          rows="4"
        />
        <select
          required
          value={formData.hostel}
          onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Select Target</option>
          <option value="all">Whole College</option>
          <option value="1">Hostel 1</option>
          <option value="2">Hostel 2</option>
          <option value="3">Hostel 3</option>
          <option value="4">Hostel 4</option>
          <option value="5">Hostel 5</option>
          <option value="6">Hostel 6</option>
          <option value="7">Hostel 7</option>
          <option value="8">Hostel 8</option>
          <option value="9">Hostel 9</option>
          <option value="10">Hostel 10</option>
          <option value="11">Hostel 11</option>``
          <option value="12">Hostel 12</option>
          <option value="13">Hostel 13</option>
        </select>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdf(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post Notification"}
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-4">Posted Notifications</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map(notif => (
            <div key={notif._id} className="border bg-gray-50 p-4 rounded shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg">{notif.title}</h4>
                  <p className="text-gray-700">{notif.message}</p>
                  <small className="text-gray-500 block mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </small>
                  {notif.pdfUrl && (
                    <a
                      href={`http://localhost:5000${notif.pdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm mt-2 inline-block"
                    >
                      📄 View Attachment
                    </a>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(notif._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
