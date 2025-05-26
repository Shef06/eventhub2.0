import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = parseInt(decodedToken.userId);
    
    // Add user role to request for authorization checks
    const db = req.app.locals.db;
    const user = await db.collection('User').findOne({ _id: req.userId });
    req.userRole = user?.role || 'user';
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware for checking admin role
export const adminAuth = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export default auth;