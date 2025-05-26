import express from 'express';
import { ObjectId } from 'mongodb';
import auth from '../middleware/auth.js';
import { getTimestamps, updateTimestamp, handleApiError } from '../utils/db.js';

const router = express.Router();

// Get user notifications with pagination and filters
router.get('/', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { page = 1, limit = 10, type, read } = req.query;
    
    let query = { users: req.userId };
    
    if (type) {
      query.type = type;
    }
    
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      db.collection('Notification')
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      db.collection('Notification').countDocuments(query)
    ]);
    
    res.json({
      notifications,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        hasMore: skip + notifications.length < total
      }
    });
  } catch (error) {
    handleApiError(error, res);
  }
});

// Mark multiple notifications as read
router.patch('/mark-read', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { notificationIds } = req.body;
    
    if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ message: "Invalid notification IDs" });
    }
    
    const result = await db.collection('Notification').updateMany(
      { 
        _id: { $in: notificationIds.map(id => new ObjectId(id)) },
        users: req.userId
      },
      { 
        $set: { 
          read: true,
          ...updateTimestamp()
        } 
      }
    );

    res.json({ 
      message: "Notifications marked as read",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    handleApiError(error, res);
  }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.collection('Notification').deleteOne({
      _id: new ObjectId(req.params.id),
      users: req.userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({ message: "Notification deleted successfully" });
  } catch (error) {
    handleApiError(error, res);
  }
});

export default router;