const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Authority = require('../models/Authority');
const Admin = require('../models/Admin');

// Protect routes
exports.authMiddleware = (roles) => {
  return async (req, res, next) => {
    let token;
    
    // Get token from header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if roles array includes the user role
      if (roles && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to access this route'
        });
      }

      // Find user based on role
      let user;
      if (decoded.role === 'student') {
        user = await Student.findById(decoded.id);
      } else if (decoded.role === 'authority') {
        user = await Authority.findById(decoded.id);
      } else if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = user;
      next();

    } catch (error) {
      console.error('Error in authentication middleware:', error);
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  };
};