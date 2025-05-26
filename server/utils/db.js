// Utility function to get next sequence value for auto-incrementing IDs
export async function getNextSequence(db, name) {
  const result = await db.collection('Counters').findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { returnDocument: 'after' }
  );
  return result.value.seq;
}

// Utility function to create timestamps
export function getTimestamps() {
  const now = new Date();
  return {
    createdAt: now,
    updatedAt: now
  };
}

// Utility function to update timestamp
export function updateTimestamp() {
  return {
    updatedAt: new Date()
  };
}

// Utility function to format event data
export function formatEventData(event, creator = null) {
  return {
    ...event,
    id: event._id.toString(),
    titolo: event.title,
    data: event.date.toISOString(),
    luogo: event.location,
    categoria: event.category,
    immagine: event.image || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
    partecipanti: event.participants?.length || 0,
    organizzatore: creator?.name || 'Organizzatore'
  };
}

// Utility function to validate event data
export function validateEventData(data) {
  const requiredFields = ['title', 'description', 'date', 'time', 'location', 'maxParticipants'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  if (new Date(data.date) < new Date()) {
    throw new Error('Event date cannot be in the past');
  }
  
  if (data.maxParticipants && data.maxParticipants < 1) {
    throw new Error('Maximum participants must be at least 1');
  }
  
  return true;
}

// Utility function to handle API errors
export function handleApiError(error, res) {
  console.error('API Error:', error);
  res.status(500).json({ 
    message: error.message || "Internal server error",
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
}