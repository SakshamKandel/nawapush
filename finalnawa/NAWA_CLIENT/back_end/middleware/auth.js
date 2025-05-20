import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';

configDotenv();

export const verifyToken = (req, res, next) => {
  const token = req.cookies.adminToken || req.cookies.teacherToken;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export const verifyAdmin = (req, res, next) => {
  const token = req.cookies.adminToken;
  console.log('Admin token:', token); // Debug log
  
  if (!token) {
    return res.status(401).json({ message: 'Admin access denied. No token provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log('Decoded token:', decoded); // Debug log
    
    if (!decoded.user || decoded.user.role !== 'Admin') {
      console.log('Role check failed. User:', decoded.user); // Debug log
      return res.status(403).json({ message: 'Forbidden: Admins only.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification error:', error); // Debug log
    res.status(400).json({ message: 'Invalid token.' });
  }
};
 