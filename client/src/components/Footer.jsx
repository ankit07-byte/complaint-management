import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">BIT Mesra Complaint System</h3>
            <p className="text-gray-400 text-sm sm:text-base">
              A platform for students to file complaints and get them resolved efficiently.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/file-complaint" 
                  className="text-gray-400 hover:text-white transition text-sm sm:text-base block"
                >
                  File a Complaint
                </Link>
              </li>
              <li>
                <Link 
                  to="/complaint-status" 
                  className="text-gray-400 hover:text-white transition text-sm sm:text-base block"
                >
                  Check Complaint Status
                </Link>
              </li>
              <li>
                <Link 
                  to="/feedback" 
                  className="text-gray-400 hover:text-white transition text-sm sm:text-base block"
                >
                  Give Feedback
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="text-sm sm:text-base">Email: complaints@bitmesra.ac.in</li>
              <li className="text-sm sm:text-base">Phone: +91 1234567890</li>
              <li>
                <a 
                  href="https://www.bitmesra.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition text-sm sm:text-base"
                >
                  College Website
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm sm:text-base">
          <p>&copy; {new Date().getFullYear()} BIT Mesra Complaint System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;