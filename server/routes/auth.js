import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getNextSequence, getTimestamps } from '../utils/db.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = req.app.locals.db;
    
    const existingUser = await db.collection('User').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = await getNextSequence(db, 'User');
    
    const user = {
      _id: userId,
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdEvents: [],
      subscribedEvents: [],
      ...getTimestamps()
    };

    await db.collection('User').insertOne(user);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.app.locals.db;

    const user = await db.collection('User').findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials " });
    }
    const hash = await bcrypt.hash(password, 12);
    console.log(hash);
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.json({ token, userId: user._id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const user = await db.collection('User').findOne(
      { _id: parseInt(req.userId) },
      { projection: { password: 0 } } // Escludiamo la password
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Contiamo gli eventi
    const eventiPartecipati = await db.collection('Event')
      .find({ participants: parseInt(req.userId) })
      .toArray();
    
    const eventiOrganizzati = await db.collection('Event')
      .find({ creator: parseInt(req.userId) })
      .toArray();

    res.json({
      ...user,
      eventiPartecipati: eventiPartecipati.length,
      eventiOrganizzati: eventiOrganizzati.length
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

export default router;