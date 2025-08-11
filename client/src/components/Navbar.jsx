import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaBars, FaTimes, FaBell, FaInfoCircle    } from 'react-icons/fa';
import { MdAdminPanelSettings } from "react-icons/md";
const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    setJustLoggedOut(true);
    setIsMobileMenuOpen(false); // Close mobile menu on logout
  };

  useEffect(() => {
    if (justLoggedOut && !user && !loading) {
      navigate('/');
      setJustLoggedOut(false);
    }
  }, [justLoggedOut, user, loading, navigate]);

  return (
    <>
      <nav className="bg-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center justify-between w-full md:w-auto">
          
          <Link to="/" className="flex items-center space-x-2 text-xl md:text-2xl font-bold">
            <img 
              src="/Birla_Institute_of_Technology_Mesra_logo.png" 
              alt="BIT Mesra Logo" 
              className="h-8 md:h-10 w-auto"
            />
            <span>Complaint System</span>
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/student-notifications" className="flex rounded-3xl bg-blue-700 hover:bg-blue-600 px-3 py-2 items-center space-x-2">
            <FaBell />
            <span>Notifications</span>
          </Link>
          <Link 
            to="/team" 
            className="flex items-center space-x-2 px-3 py-2 rounded-3xl bg-blue-700 hover:bg-blue-600 transition"
          >
            <FaInfoCircle/> 
            <span>About</span>
          </Link>

          {!user ? (
            <>
              <div className="relative group">
                <button className="px-3 flex items-center space-x-2 py-2 rounded-3xl bg-blue-700 hover:bg-blue-600 transition-colors">
                  <FaUser />
                  <span>Student</span>
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
                <button className="px-3 py-2 rounded-3xl bg-blue-700 hover:bg-blue-600 transition-colors">
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
                className="px-3 py-2 flex items-center space-x-1 rounded-3xl bg-blue-700 hover:bg-blue-600 transition-colors"
              > <MdAdminPanelSettings />
                <span>Admin</span>
              </Link>
            </>
          ) : (
            <>
              {user.role === 'student' && (
                <>
                  <Link 
                    to="/student-dashboard" 
                    className="px-3 py-2 rounded-3xl bg-blue-700 hover:bg-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/file-complaint" 
                    className="px-3 py-2 rounded-3xl bg-blue-700 hover:bg-blue-600 transition-colors"
                  >
                    File Complaint
                  </Link>
                </>
              )}

              {user.role === 'authority' && (
                <Link 
                  to="/authority-dashboard" 
                  className="px-3 py-2 rounded-3xl bg-blue-700 hover:bg-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {user.role === 'admin' && (
                <Link 
                  to="/admin-dashboard" 
                  className="px-3 py-2 rounded-3xl bg-blue-700 hover:bg-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <button 
                onClick={handleLogout}
                className="px-3 py-2 rounded-3xl bg-red-700 hover:bg-blue-600 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <>
            {/* Background blur overlay */}
            <div className="fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
            {/* Mobile navigation panel */}
            <div className="md:hidden rounded-b-3xl fixed top-16 left-0 right-0 bg-blue-800 z-20 py-4 pb-8 border-blue-300/20 px-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/student-notifications" 
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-red-200/10 hover:bg-blue-700 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaBell />
                <span>Notifications</span>
              </Link>
              
              <Link 
                to="/team" 
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-red-200/10 hover:bg-blue-700 transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaInfoCircle  />
                <span>About</span>
              </Link>

              {!user ? (
                <>
                  <div className="w-full rounded-xl bg-red-200/10 pb-4">
                    <div className="flex items-center space-x-2 font-medium px-3 py-2">
                      <FaUser />
                      <span>Student</span>
                    </div>
                    <div className="flex items-center space-x-6 justify-center pl-4">
                      <Link 
                        to="/student-login" 
                        className="bg-white text-blue-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-100 hover:text-blue-800 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/student-signup" 
                        className="bg-transparent border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-800 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Signup
                      </Link>
                    </div>
                  </div>

                  <div className="w-full rounded-xl bg-red-200/10 pb-4">
                    <div className="font-medium px-3 py-2">Authority</div>
                    <div className="flex items-center space-x-6 justify-center pl-4">

                      <Link 
                        to="/authority-login" 
                        className="bg-white text-blue-800 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-100 hover:text-blue-800 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        to="/authority-signup" 
                        className="bg-transparent border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-800 transition"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Signup
                      </Link>
                    </div>
                  </div>

                  <Link 
                    to="/admin-login" 
                    className="px-3 py-2 flex items-center space-x-2 rounded-lg bg-red-200/10 hover:bg-blue-600 transition-colors"

                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <MdAdminPanelSettings />
                    <span>Admin</span>
                  </Link>
                </>
              ) : (
                <>
                  {user.role === 'student' && (
                    <>
                      <Link 
                    to="/student-dashboard" 
                    className="px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                      <Link 
                    to="/file-complaint" 
                    className="px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    File Complaint
                  </Link>
                    </>
                  )}

                  {user.role === 'authority' && (
                    <Link 
                      to="/authority-dashboard" 
                      className="px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link 
                      to="/admin-dashboard" 
                      className="px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md bg-blue-700 hover:bg-blue-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
            </div>
          </>
        )}
      </div>
      </nav>
      {/* Glass-like separator below navbar */}
      <div className="w-full h-px bg-white/10 backdrop-blur-md"></div>
    </>
  );
};

export default Navbar;