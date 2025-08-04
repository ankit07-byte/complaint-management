import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';


const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  const handleLogout = async () => {
    await logout(); // Wait for logout
    toast.success('Logged out successfully');
    setJustLoggedOut(true); // trigger redirect
  };

  useEffect(() => {
    if (justLoggedOut && !user && !loading) {
      navigate('/');
      setJustLoggedOut(false); // Reset flag
    }
  }, [justLoggedOut, user, loading, navigate]);

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
  <div className="container mx-auto px-4 py-3 flex justify-between items-center">
    <Link to="/" className="text-2xl font-bold">
      BIT Mesra Complaint System
    </Link>
    <Link to="/student-notifications">View Notifications</Link>


    <div className="flex items-center space-x-6">
      {/* Always visible Team link */}
      <Link 
  to="/team" 
  className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-blue-700 transition"
>
  <FaUser />
  <span>Team</span>
</Link>


      {!user ? (
        <>
          <div className="relative group">
            <button className="px-3 py-2 rounded hover:bg-blue-700 transition">
              Student
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link 
                to="/student-login" 
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Login
              </Link>
              <Link 
                to="/student-signup" 
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Signup
              </Link>
            </div>
          </div>

          <div className="relative group">
            <button className="px-3 py-2 rounded hover:bg-blue-700 transition">
              Authority
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link 
                to="/authority-login" 
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Login
              </Link>
              <Link 
                to="/authority-signup" 
                className="block px-4 py-2 hover:bg-blue-100"
              >
                Signup
              </Link>
            </div>
          </div>

          <Link 
            to="/admin-login" 
            className="px-3 py-2 rounded hover:bg-blue-700 transition"
          >
            Admin
          </Link>
        </>
      ) : (
        <>
          {user.role === 'student' && (
            <>
              <Link 
                to="/student-dashboard" 
                className="px-3 py-2 rounded hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
              <Link 
                to="/file-complaint" 
                className="px-3 py-2 rounded hover:bg-blue-700 transition"
              >
                File Complaint
              </Link>
            </>
          )}

          {user.role === 'authority' && (
            <Link 
              to="/authority-dashboard" 
              className="px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
          )}

          {user.role === 'admin' && (
            <Link 
              to="/admin-dashboard" 
              className="px-3 py-2 rounded hover:bg-blue-700 transition"
            >
              Dashboard
            </Link>
          )}

          <button 
            onClick={handleLogout}
            className="px-3 py-2 rounded hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </>
      )}
    </div>
  </div>
</nav>

  );
};

export default Navbar; 