// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); 


module.exports = async function authMiddleware(req, res, next) {
  try {
    
    const authHeader = (req.headers.authorization || req.get('Authorization') || '').toString();
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET missing in environment');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decoded.userId || decoded.id || decoded._id;
    if (!userId) {
      req.user = decoded;
      return next();
    }


    try {
      const user = await User.findById(userId).select('-password -__v');
      if (!user) return res.status(401).json({ error: 'User not found' });
      req.user = user;
      return next();
    } catch (dbErr) {
      console.error('auth middleware DB lookup failed:', dbErr);
    
      req.user = decoded;
      return next();
    }
  } catch (err) {
    console.error('authMiddleware unexpected error:', err);
    return res.status(500).json({ error: 'Auth error' });
  }
};
