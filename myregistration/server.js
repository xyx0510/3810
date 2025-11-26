const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8099;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Mock data
const registrations = [
  {
    id: 1,
    eventId: 101,
    eventTitle: "2023 Annual Tech Summit",
    eventDate: "2023-11-15",
    eventTime: "09:00 - 17:00",
    eventLocation: "Beijing International Conference Center",
    status: "pending",
    registrationDate: "2023-10-20",
    coverImage: "/api/images/tech-summit.jpg"
  },
  {
    id: 2,
    eventId: 102,
    eventTitle: "Product Design Thinking Workshop",
    eventDate: "2023-11-20",
    eventTime: "13:30 - 16:30",
    eventLocation: "Innovation Center 3F",
    status: "approved",
    registrationDate: "2023-10-18",
    coverImage: "/api/images/design-workshop.jpg"
  },
  {
    id: 3,
    eventId: 103,
    eventTitle: "Advanced Project Management Training",
    eventDate: "2023-11-25",
    eventTime: "10:00 - 16:00",
    eventLocation: "Training Center Building A",
    status: "rejected",
    registrationDate: "2023-10-22",
    coverImage: "/api/images/pm-training.jpg"
  },
  {
    id: 4,
    eventId: 104,
    eventTitle: "Frontend Development Tech Share",
    eventDate: "2023-10-10",
    eventTime: "14:00 - 17:00",
    eventLocation: "Online Meeting",
    status: "completed",
    registrationDate: "2023-09-25",
    coverImage: "/api/images/frontend-share.jpg"
  }
];

const checkins = [
  {
    id: 1,
    eventId: 102,
    eventTitle: "Product Design Thinking Workshop",
    checkinTime: "2023-11-20 13:25",
    method: "qrcode",
    status: "success"
  }
];

// Routes

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get user registrations with filtering
app.get('/api/user/registrations', (req, res) => {
  const { status, page = 1 } = req.query;
  let filteredRegistrations = registrations;
  
  if (status && status !== 'all') {
    filteredRegistrations = registrations.filter(reg => reg.status === status);
  }
  
  // Simple pagination
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, startIndex + pageSize);
  
  res.json({
    registrations: paginatedRegistrations,
    total: filteredRegistrations.length,
    page: parseInt(page),
    pageSize
  });
});

// Get registration details
app.get('/api/registrations/:id', (req, res) => {
  const registration = registrations.find(reg => reg.id === parseInt(req.params.id));
  
  if (!registration) {
    return res.status(404).json({ error: 'Registration not found' });
  }
  
  res.json(registration);
});

// Get reminder settings for a registration
app.get('/api/registrations/:id/reminder', (req, res) => {
  const registration = registrations.find(reg => reg.id === parseInt(req.params.id));
  
  if (!registration) {
    return res.status(404).json({ error: 'Registration not found' });
  }
  
  // Mock reminder data
  res.json({
    registrationId: registration.id,
    eventTitle: registration.eventTitle,
    reminderEnabled: true,
    reminderTime: "1 hour before",
    notificationMethods: ["email", "push"]
  });
});

// Set reminder for a registration
app.post('/api/registrations/:id/reminder', (req, res) => {
  const registration = registrations.find(reg => reg.id === parseInt(req.params.id));
  
  if (!registration) {
    return res.status(404).json({ error: 'Registration not found' });
  }
  
  const { reminderEnabled, reminderTime, notificationMethods } = req.body;
  
  // In a real app, we would save these settings to the database
  res.json({
    message: 'Reminder settings updated successfully',
    reminderEnabled,
    reminderTime,
    notificationMethods
  });
});

// QR Code check-in
app.post('/api/checkin/qrcode', (req, res) => {
  const { eventId, qrCodeData } = req.body;
  
  // Validate QR code data (mock validation)
  if (!qrCodeData || !eventId) {
    return res.status(400).json({ error: 'Invalid QR code or event ID' });
  }
  
  // Find the registration
  const registration = registrations.find(reg => 
    reg.eventId === eventId && reg.status === 'approved'
  );
  
  if (!registration) {
    return res.status(404).json({ error: 'Valid registration not found for this event' });
  }
  
  // Create check-in record
  const newCheckin = {
    id: checkins.length + 1,
    eventId,
    eventTitle: registration.eventTitle,
    checkinTime: new Date().toISOString(),
    method: "qrcode",
    status: "success"
  };
  
  checkins.push(newCheckin);
  
  res.json({
    message: 'Check-in successful',
    checkin: newCheckin
  });
});

// Check-in with code
app.post('/api/checkin/code', (req, res) => {
  const { eventId, checkinCode } = req.body;
  
  // Validate check-in code (mock validation)
  if (!checkinCode || checkinCode.length !== 6) {
    return res.status(400).json({ error: 'Invalid check-in code' });
  }
  
  // Find the registration
  const registration = registrations.find(reg => 
    reg.eventId === eventId && reg.status === 'approved'
  );
  
  if (!registration) {
    return res.status(404).json({ error: 'Valid registration not found for this event' });
  }
  
  // Create check-in record
  const newCheckin = {
    id: checkins.length + 1,
    eventId,
    eventTitle: registration.eventTitle,
    checkinTime: new Date().toISOString(),
    method: "code",
    status: "success"
  };
  
  checkins.push(newCheckin);
  
  res.json({
    message: 'Check-in successful',
    checkin: newCheckin
  });
});

// Get check-in status for an activity
app.get('/api/activities/:id/checkin-status', (req, res) => {
  const eventId = parseInt(req.params.id);
  const checkin = checkins.find(checkin => checkin.eventId === eventId);
  
  if (!checkin) {
    return res.json({
      checkedIn: false,
      message: 'Not checked in yet'
    });
  }
  
  res.json({
    checkedIn: true,
    checkinTime: checkin.checkinTime,
    method: checkin.method
  });
});

// Get user check-in history
app.get('/api/user/checkins', (req, res) => {
  res.json({
    checkins: checkins,
    total: checkins.length
  });
});

// Apply for makeup check-in
app.post('/api/checkin/makeup', (req, res) => {
  const { eventId, reason } = req.body;
  
  if (!eventId || !reason) {
    return res.status(400).json({ error: 'Event ID and reason are required' });
  }
  
  // In a real app, we would create a makeup request in the database
  res.json({
    message: 'Makeup check-in request submitted successfully',
    requestId: Date.now(),
    status: 'pending',
    eventId,
    reason
  });
});

// Update registration
app.put('/api/registrations/:id', (req, res) => {
  const registration = registrations.find(reg => reg.id === parseInt(req.params.id));
  
  if (!registration) {
    return res.status(404).json({ error: 'Registration not found' });
  }
  
  // Update registration data
  Object.assign(registration, req.body);
  
  res.json({
    message: 'Registration updated successfully',
    registration
  });
});

// Cancel registration
app.delete('/api/registrations/:id', (req, res) => {
  const index = registrations.findIndex(reg => reg.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Registration not found' });
  }
  
  const cancelledRegistration = registrations.splice(index, 1)[0];
  
  res.json({
    message: 'Registration cancelled successfully',
    registration: cancelledRegistration
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Event Registration System server running on port ${PORT}`);
  console.log(`Access the application at http://localhost:${PORT}`);
});