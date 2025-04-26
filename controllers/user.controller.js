const User = require('../model/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // we'll create this next

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, phoneNumber, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    const user = new User({ username, email, password, phoneNumber, role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Error creating user', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  }
  catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.loginUser = async (req, res) => {
  try {
    if(req.body?.identifier === undefined || req.body?.password === undefined) {
      return res.status(400).json({ message: 'Identifier and password are required' });
    }
    const { identifier, password } = req.body;
    const user = await User.findOne({
        $or: [
          { email: identifier },
          { username: identifier },
          { phoneNumber: identifier }
        ]
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  }
  catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful' });
  }
  catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  }
  catch (error) {
    console.error('Error updating user password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    if (!req.body?.email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // token valid for 1 hour
    await user.save();

    console.log(user)
    // Create reset link
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`; // frontend URL

    const message = `
      <h1>Password Reset Request</h1>
      <p>Please click the link below to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: message,
    });

    res.status(200).json({ message: 'Reset password link sent to your email' });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
    try {
        console.log(req.params);
      const { token } = req.params;
      const { newPassword } = req.body;
  
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
  
      user.password = newPassword; // will be hashed by pre-save
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Password has been reset successfully!' });
    } catch (error) {
      console.error('Error in resetPassword:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
