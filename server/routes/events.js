import express from 'express';
import auth, { adminAuth } from '../middleware/auth.js';
import { 
  getNextSequence, 
  getTimestamps, 
  updateTimestamp, 
  formatEventData,
  validateEventData,
  handleApiError 
} from '../utils/db.js';

const router = express.Router();

// Get all events with filters and pagination
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { search, category, city, date, page = 1, limit = 12 } = req.query;
    
    let query = { isPublic: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (city) {
      query.location = { $regex: `^${city}`, $options: 'i' };
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    const skip = (page - 1) * limit;
    
    const [events, total] = await Promise.all([
      db.collection('Event')
        .find(query)
        .sort({ date: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      db.collection('Event').countDocuments(query)
    ]);
    
    const populatedEvents = await Promise.all(events.map(async (event) => {
      const creator = await db.collection('User').findOne(
        { _id: event.creator },
        { projection: { name: 1 } }
      );
      return formatEventData(event, creator);
    }));
    
    res.json({
      events: populatedEvents,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        hasMore: skip + events.length < total
      }
    });
  } catch (error) {
    handleApiError(error, res);
  }
});

// Create event with image upload support
router.post('/', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    validateEventData(req.body);
    
    const eventId = await getNextSequence(db, 'Event');
    
    const event = {
      _id: eventId,
      ...req.body,
      creator: req.userId,
      participants: [],
      isPublic: req.body.isPublic ?? true,
      ...getTimestamps()
    };

    await db.collection('Event').insertOne(event);
    
    // Update user's created events
    await db.collection('User').updateOne(
      { _id: req.userId },
      { $push: { createdEvents: eventId } }
    );

    // Create notification for followers
    const creator = await db.collection('User').findOne({ _id: req.userId });
    if (creator.followers?.length > 0) {
      const notification = {
        type: 'new_event',
        message: `${creator.name} ha creato un nuovo evento: ${event.title}`,
        users: creator.followers,
        eventId: eventId,
        ...getTimestamps()
      };
      await db.collection('Notification').insertOne(notification);
    }

    res.status(201).json(formatEventData(event, creator));
  } catch (error) {
    handleApiError(error, res);
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const event = await db.collection('Event').findOne({ _id: parseInt(req.params.id) });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    
    // Populate creator and participants
    const creator = await db.collection('User').findOne(
      { _id: event.creator },
      { projection: { name: 1 } }
    );
    
    const participants = await db.collection('User')
      .find(
        { _id: { $in: event.participants } },
        { projection: { name: 1 } }
      )
      .toArray();
    
    res.json({ ...event, creator, participants });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: "Error fetching event" });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const eventId = parseInt(req.params.id);
    const event = await db.collection('Event').findOne({ _id: eventId });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.creator !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedEvent = await db.collection('Event').findOneAndUpdate(
      { _id: eventId },
      { 
        $set: { 
          ...req.body,
          ...updateTimestamp()
        } 
      },
      { returnDocument: 'after' }
    );

    res.json(updatedEvent.value);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: "Error updating event" });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const eventId = parseInt(req.params.id);
    const event = await db.collection('Event').findOne({ _id: eventId });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.creator !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await db.collection('Event').deleteOne({ _id: eventId });
    await db.collection('User').updateMany(
      { 
        $or: [
          { createdEvents: eventId },
          { subscribedEvents: eventId }
        ]
      },
      { 
        $pull: { 
          createdEvents: eventId,
          subscribedEvents: eventId
        }
      }
    );

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: "Error deleting event" });
  }
});

// Join event
router.post('/:id/join', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const eventId = parseInt(req.params.id);
    const event = await db.collection('Event').findOne({ _id: eventId });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.participants.includes(req.userId)) {
      return res.status(400).json({ message: "Already joined this event" });
    }

    if (event.participants.length >= event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    await db.collection('Event').updateOne(
      { _id: eventId },
      { 
        $push: { participants: req.userId },
        $set: { ...updateTimestamp() }
      }
    );

    await db.collection('User').updateOne(
      { _id: req.userId },
      { $push: { subscribedEvents: eventId } }
    );

    res.json({ message: "Successfully joined event" });
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ message: "Error joining event" });
  }
});

// Leave event
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const eventId = parseInt(req.params.id);
    const event = await db.collection('Event').findOne({ _id: eventId });
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.participants.includes(req.userId)) {
      return res.status(400).json({ message: "Not joined this event" });
    }

    await db.collection('Event').updateOne(
      { _id: eventId },
      { 
        $pull: { participants: req.userId },
        $set: { ...updateTimestamp() }
      }
    );

    await db.collection('User').updateOne(
      { _id: req.userId },
      { $pull: { subscribedEvents: eventId } }
    );

    res.json({ message: "Successfully left event" });
  } catch (error) {
    console.error('Error leaving event:', error);
    res.status(500).json({ message: "Error leaving event" });
  }
});

// Get events by category
router.get('/category/:category', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const events = await db.collection('Event')
      .find({
        category: req.params.category,
        isPublic: true
      })
      .sort({ date: 1 })
      .toArray();
    
    // Populate creator information
    const populatedEvents = await Promise.all(events.map(async (event) => {
      const creator = await db.collection('User').findOne(
        { _id: event.creator },
        { projection: { name: 1 } }
      );
      return { ...event, creator };
    }));
    
    res.json(populatedEvents);
  } catch (error) {
    console.error('Error fetching events by category:', error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

// Get user's events
router.get('/user/events', auth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const user = await db.collection('User').findOne({ _id: req.userId });
    
    const createdEvents = await db.collection('Event')
      .find({ _id: { $in: user.createdEvents } })
      .toArray();
      
    const subscribedEvents = await db.collection('Event')
      .find({ _id: { $in: user.subscribedEvents } })
      .toArray();
    
    res.json({
      createdEvents,
      subscribedEvents
    });
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: "Error fetching user events" });
  }
});

// Get event categories
router.get('/categories', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const categories = await db.collection('Event')
      .distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Get event cities
router.get('/cities', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const locations = await db.collection('Event')
      .distinct('location');
    
    // Estraggo solo le città (prima parte della location)
    const cities = [...new Set(locations.map(loc => loc.split(',')[0]))];
    
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ message: "Error fetching cities" });
  }
});

export default router;