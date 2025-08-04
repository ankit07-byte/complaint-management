import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BIT Mesra Complaint System</h3>
            <p className="text-gray-400">
              A platform for students to file complaints and get them resolved efficiently.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/file-complaint" className="text-gray-400 hover:text-white transition">
                  File a Complaint
                </Link>
              </li>
              <li>
                <Link to="/complaint-status" className="text-gray-400 hover:text-white transition">
                  Check Complaint Status
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-gray-400 hover:text-white transition">
                  Give Feedback
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: complaints@bitmesra.ac.in</li>
              <li>Phone: +91 1234567890</li>
              <li>
                <a 
                  href="https://www.bitmesra.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  College Website
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} BIT Mesra Complaint System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;