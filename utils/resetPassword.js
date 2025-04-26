const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../model/user.model'); 
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    const usersToUpdate = [
      'shrivastavanihal745@gmail.com',
      'shrivastavanihal745+1@gmail.com',
      'shrivastavanihal@gmail.com',
      'shrivastavanihal95@gmail.com'
    ];

    const newPassword = 'newPassword123';

    for (let email of usersToUpdate) {
      const user = await User.findOne({ email });
      if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        console.log(`Password for ${email} updated successfully.`);
      } else {
        console.log(`User ${email} not found.`);
      }
    }

    mongoose.connection.close();
  })
  .catch(error => console.error('Error:', error));
