import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // if you're using one

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext); 

  useEffect(() => {
    const fetchNotifications = async () => {
      const hostel = user?.hostelNo || 'all'; 
      try {
        const res = await axios.get(`http://localhost:5000/api/notifications/${hostel}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications', err);
      }
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif._id} className="border p-3 mb-3 rounded bg-gray-50">
            <h3 className="font-semibold">{notif.title}</h3>
            <p>{notif.message}</p>
            <small className="text-gray-500">{new Date(notif.createdAt).toLocaleString()}</small>
            {notif.pdfUrl && (
              <div>
                <a
                  href={`http://localhost:5000${notif.pdfUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm block mt-1"
                >
                  📄 View Attachment
                </a>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentNotifications;

