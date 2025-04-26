const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user.model'); 
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
async function hashPasswords() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const users = await User.find();

    for (const user of users) {
      if (user.password.length < 20) { 
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);

        user.password = hashedPassword;
        await user.save();

        console.log(`Password hashed for user: ${user.email}`);
      } else {
        console.log(`Password already hashed for user: ${user.email}`);
      }
    }

    console.log('Password hashing completed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during password hashing:', error);
    process.exit(1);
  }
}

hashPasswords();
