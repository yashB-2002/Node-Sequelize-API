const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
 
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, accessTokenSecret, (err, user) => {
      
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
      
        req.user = user;
        next();
    })
  }

  else {
    res.status(401).json({ message: 'Authorization header missing.' });
  }
};
 
module.exports = authMiddleware;
 