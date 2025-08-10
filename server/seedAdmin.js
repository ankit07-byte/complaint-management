// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config(); // Load from .envh

// Make sure the path is correct
const Admin = require('./models/Admin'); 

const createAdmin = async () => {
  try {
    // Connect to MongoDB using .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const email = 'btech1049822.22@bitmesra.ac.in';
    const plainPassword = 'admin1234';

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`⚠️ Admin already exists with email: ${email}`);
      await mongoose.disconnect();
      return;
    }

    //const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = new Admin({
      email,
      password: plainPassword,
      role: 'admin' // include this if your Admin schema requires a role
    });

    await admin.save();

    console.log(`✅ Admin created successfully!
Email: ${email}
Password: ${plainPassword}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

createAdmin();
