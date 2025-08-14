// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function authMiddlewareFactory(options = {}) {

  const DEBUG = process.env.DEBUG_AUTH === 'true';

  return async function authMiddleware(req, res, next) {
    if (DEBUG) console.log('[auth] invoked ->', req.method, req.originalUrl);

    try {
     
      const authHeader = (req.headers.authorization || req.get('Authorization') || '').toString();
      let token = null;

      if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
      else if (req.cookies && req.cookies.token) token = req.cookies.token;

      if (!token) {
        if (DEBUG) console.log('[auth] no token found');
        return res.status(401).json({ error: 'No token provided' });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('[auth] JWT_SECRET missing from environment!');
        return res.status(500).json({ error: 'Server misconfiguration' });
      }

      let decoded;
      try {
        decoded = jwt.verify(token, secret);
      } catch (err) {
        if (DEBUG) console.log('[auth] token verify failed', err && err.name);
        if (err && err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired' });
        return res.status(401).json({ error: 'Invalid token' });
      }

    
      const userId = decoded.userId || decoded.id || decoded._id;

      if (userId) {
        try {
          const User = require('../models/Users'); 
          const user = await User.findById(userId).select('-password -__v');
          if (!user) {
            if (DEBUG) console.log('[auth] token ok but user not found id=', userId);
            return res.status(401).json({ error: 'User not found' });
          }
          req.user = user;
        } catch (dbErr) {
         
          console.error('[auth] DB lookup failed:', dbErr && dbErr.message);
          req.user = decoded;
        }
      } else {
        
        req.user = decoded;
      }

      if (DEBUG) console.log('[auth] success user=', (req.user && (req.user._id || req.user.userId)) || 'attached-payload');
      return next();
    } catch (err) {
      console.error('[auth] unexpected error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ error: 'Auth error' });
    }
  };
};


