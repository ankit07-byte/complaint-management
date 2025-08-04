const app = require('./app');
const connectDB = require('./config/db');
const path = require('path');
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Serve uploaded PDFs statically
app.use('/uploads', require('express').static(path.join(__dirname, '/uploads')));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
