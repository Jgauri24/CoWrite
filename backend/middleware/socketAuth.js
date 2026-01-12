/
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {

    const token = socket.handshake.auth.token || 
                  socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new Error('User not found'));
    }

  
    socket.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };

    next();
  } catch (error) {
    console.error('Socket Auth Error:', error.message);
    next(new Error('Invalid token'));
  }
};

module.exports = socketAuth;
