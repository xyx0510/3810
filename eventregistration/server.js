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

// In-memory storage
let activities = {
  1: {
    id: 1,
    name: 'Tech Conference 2024',
    description: 'Annual technology conference featuring industry leaders and cutting-edge innovations.',
    date: '2024-06-15',
    time: '09:00',
    location: 'Convention Center',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Please provide accurate information. Student ID verification required.',
      feeRequired: true,
      feeAmount: 50
    },
    checkinCode: 'TECH2024',
    qrCode: 'tech-conf-2024-qr'
  },
  2: {
    id: 2,
    name: 'Coding Workshop',
    description: 'Hands-on programming workshop for beginners. Learn HTML, CSS, and JavaScript basics.',
    date: '2024-06-20',
    time: '14:00',
    location: 'Computer Lab B',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Basic computer knowledge required. Bring your own laptop.',
      feeRequired: false,
      feeAmount: 0
    },
    checkinCode: 'CODE123',
    qrCode: 'coding-workshop-qr'
  },
  3: {
    id: 3,
    name: 'AI Seminar',
    description: 'Explore the latest developments in artificial intelligence and machine learning.',
    date: '2024-06-25',
    time: '10:30',
    location: 'Auditorium A',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Interest in AI and ML technologies.',
      feeRequired: true,
      feeAmount: 25
    },
    checkinCode: 'AISEM',
    qrCode: 'ai-seminar-qr'
  }
};

let registrations = [];
let registrationIdCounter = 1;

let checkins = [];
let checkinIdCounter = 1;

let reminders = [];

// Utility functions
const findRegistrationById = (id) => {
  return registrations.find(reg => reg.id === parseInt(id));
};

const findRegistrationByActivityAndStudent = (activityId, studentId) => {
  return registrations.find(reg => 
    reg.activityId === parseInt(activityId) && reg.studentId === studentId
  );
};

const findCheckinByActivityAndStudent = (activityId, studentId) => {
  return checkins.find(checkin => 
    checkin.activityId === parseInt(activityId) && checkin.studentId === studentId
  );
};

// Serve home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve payment page
app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

// Serve my registrations page
app.get('/my-registrations', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'my-registrations.html'));
});

// Serve checkin page
app.get('/checkin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'checkin.html'));
});

// Process payment
app.post('/api/payments/process', (req, res) => {
  const { registrationId, paymentMethod } = req.body;
  
  const registration = findRegistrationById(registrationId);
  if (!registration) {
    return res.status(404).json({ 
      success: false, 
      message: 'Registration not found' 
    });
  }
  
  // Simulate payment processing
  setTimeout(() => {
    registration.paid = true;
    registration.paymentDate = new Date().toISOString();
    registration.paymentMethod = paymentMethod;
    
    res.json({ 
      success: true, 
      message: 'Payment processed successfully',
      data: registration
    });
  }, 2000);
});

// Get all activities
app.get('/api/activities', (req, res) => {
  const activitiesArray = Object.values(activities);
  res.json({
    success: true,
    data: activitiesArray
  });
});

// Get specific activity
app.get('/api/activities/:id', (req, res) => {
  const activityId = parseInt(req.params.id);
  const activity = activities[activityId];
  
  if (!activity) {
    return res.status(404).json({ 
      success: false, 
      message: 'Activity not found' 
    });
  }

  res.json({ 
    success: true, 
    data: activity 
  });
});

// Get registration form for activity
app.get('/api/activities/:id/registration-form', (req, res) => {
  const activityId = parseInt(req.params.id);
  const activity = activities[activityId];
  
  if (!activity) {
    return res.status(404).json({ 
      success: false, 
      message: 'Activity not found' 
    });
  }

  res.json({ 
    success: true, 
    data: activity.registrationForm 
  });
});

// Check registration eligibility
app.get('/api/activities/:id/check-eligibility', (req, res) => {
  const activityId = parseInt(req.params.id);
  const { studentId } = req.query;
  
  const activity = activities[activityId];
  if (!activity) {
    return res.status(404).json({ 
      success: false, 
      message: 'Activity not found' 
    });
  }

  // Check if already registered
  const existingRegistration = findRegistrationByActivityAndStudent(activityId, studentId);
  if (existingRegistration) {
    return res.json({
      success: true,
      eligible: false,
      message: 'Already registered for this activity',
      registrationId: existingRegistration.id
    });
  }

  res.json({
    success: true,
    eligible: true,
    message: 'Eligible to register'
  });
});

// Submit registration
app.post('/api/activities/:id/register', (req, res) => {
  const activityId = parseInt(req.params.id);
  const { name, studentId, phone, email } = req.body;
  
  // Validate required fields
  if (!name || !studentId || !phone || !email) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }
  
  const activity = activities[activityId];
  if (!activity) {
    return res.status(404).json({ 
      success: false, 
      message: 'Activity not found' 
    });
  }

  // Check if already registered
  const existingRegistration = findRegistrationByActivityAndStudent(activityId, studentId);
  if (existingRegistration) {
    return res.status(400).json({ 
      success: false, 
      message: 'Already registered for this activity' 
    });
  }

  // Create new registration
  const newRegistration = {
    id: registrationIdCounter++,
    activityId,
    name,
    studentId,
    phone,
    email,
    status: 'pending',
    registrationDate: new Date().toISOString(),
    paid: !activity.registrationForm.feeRequired
  };

  registrations.push(newRegistration);

  res.status(201).json({
    success: true,
    message: 'Registration submitted successfully',
    data: newRegistration,
    requiresPayment: activity.registrationForm.feeRequired,
    paymentAmount: activity.registrationForm.feeAmount
  });
});

// Update registration
app.put('/api/registrations/:id', (req, res) => {
  const registrationId = parseInt(req.params.id);
  const { name, phone, email } = req.body;
  
  const registration = findRegistrationById(registrationId);
  if (!registration) {
    return res.status(404).json({ 
      success: false, 
      message: 'Registration not found' 
    });
  }

  if (registration.status !== 'pending') {
    return res.status(400).json({ 
      success: false, 
      message: 'Cannot modify registration after approval' 
    });
  }

  // Update fields
  if (name) registration.name = name;
  if (phone) registration.phone = phone;
  if (email) registration.email = email;

  res.json({ 
    success: true, 
    message: 'Registration updated successfully', 
    data: registration 
  });
});

// Cancel registration
app.delete('/api/registrations/:id', (req, res) => {
  const registrationId = parseInt(req.params.id);
  
  const registrationIndex = registrations.findIndex(reg => reg.id === registrationId);
  if (registrationIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: 'Registration not found' 
    });
  }

  const registration = registrations[registrationIndex];
  
  if (registration.status !== 'pending') {
    return res.status(400).json({ 
      success: false, 
      message: 'Cannot cancel registration after approval' 
    });
  }

  registration.status = 'cancelled';

  res.json({ 
    success: true, 
    message: 'Registration cancelled successfully' 
  });
});

// Get all registrations
app.get('/api/registrations', (req, res) => {
  res.json({ 
    success: true, 
    data: registrations 
  });
});

// Get registrations by student ID
app.get('/api/registrations/student/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const studentRegistrations = registrations.filter(reg => reg.studentId === studentId);
  
  res.json({ 
    success: true, 
    data: studentRegistrations 
  });
});

// ========== 我的报名模块 API ==========

// Get my registrations with filtering and pagination
app.get('/api/user/registrations', (req, res) => {
  const { studentId, status, page = 1, limit = 10 } = req.query;
  
  if (!studentId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student ID is required' 
    });
  }
  
  let filteredRegistrations = registrations.filter(reg => reg.studentId === studentId);
  
  // Filter by status
  if (status && status !== 'all') {
    if (status === 'history') {
      // History: past events or cancelled registrations
      const currentDate = new Date();
      filteredRegistrations = filteredRegistrations.filter(reg => {
        const activity = activities[reg.activityId];
        if (!activity) return false;
        
        const eventDate = new Date(activity.date);
        return eventDate < currentDate || reg.status === 'cancelled';
      });
    } else {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.status === status);
    }
  }
  
  // Sort by registration date (newest first)
  filteredRegistrations.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, endIndex);
  
  // Enrich with activity data
  const enrichedRegistrations = paginatedRegistrations.map(reg => {
    const activity = activities[reg.activityId] || {};
    const checkin = findCheckinByActivityAndStudent(reg.activityId, reg.studentId);
    
    return {
      ...reg,
      activity: {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        date: activity.date,
        time: activity.time,
        location: activity.location
      },
      checkin: checkin || null
    };
  });
  
  res.json({
    success: true,
    data: enrichedRegistrations,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: filteredRegistrations.length,
      totalPages: Math.ceil(filteredRegistrations.length / limit)
    }
  });
});

// Get registration details
app.get('/api/registrations/:id', (req, res) => {
  const registrationId = parseInt(req.params.id);
  const registration = findRegistrationById(registrationId);
  
  if (!registration) {
    return res.status(404).json({ 
      success: false, 
      message: 'Registration not found' 
    });
  }
  
  const activity = activities[registration.activityId] || {};
  const checkin = findCheckinByActivityAndStudent(registration.activityId, registration.studentId);
  
  const enrichedRegistration = {
    ...registration,
    activity: {
      id: activity.id,
      name: activity.name,
      description: activity.description,
      date: activity.date,
      time: activity.time,
      location: activity.location,
      checkinCode: activity.checkinCode,
      qrCode: activity.qrCode
    },
    checkin: checkin || null
  };
  
  res.json({ 
    success: true, 
    data: enrichedRegistration 
  });
});

// Get activity reminder settings
app.get('/api/registrations/:id/reminder', (req, res) => {
  const registrationId = parseInt(req.params.id);
  const registration = findRegistrationById(registrationId);
  
  if (!registration) {
    return res.status(404).json({ 
      success: false, 
      message: 'Registration not found' 
    });
  }
  
  // Find reminder for this registration
  const reminder = reminders.find(r => r.registrationId === registrationId);
  
  res.json({ 
    success: true, 
    data: reminder || { 
      enabled: false,
      notifyBefore: 24 // hours
    }
  });
});

// Set activity reminder
app.post('/api/registrations/:id/reminder', (req, res) => {
  const registrationId = parseInt(req.params.id);
  const { enabled, notifyBefore } = req.body;
  
  const registration = findRegistrationById(registrationId);
  if (!registration) {
    return res.status(404).json({ 
      success: false, 
      message: 'Registration not found' 
    });
  }
  
  // Find existing reminder or create new
  let reminderIndex = reminders.findIndex(r => r.registrationId === registrationId);
  
  if (reminderIndex === -1) {
    reminders.push({
      registrationId,
      enabled: enabled !== undefined ? enabled : true,
      notifyBefore: notifyBefore || 24
    });
  } else {
    reminders[reminderIndex] = {
      ...reminders[reminderIndex],
      enabled: enabled !== undefined ? enabled : reminders[reminderIndex].enabled,
      notifyBefore: notifyBefore || reminders[reminderIndex].notifyBefore
    };
  }
  
  res.json({ 
    success: true, 
    message: 'Reminder settings updated successfully',
    data: reminders.find(r => r.registrationId === registrationId)
  });
});

// ========== 签到模块 API ==========

// QR code checkin
app.post('/api/checkin/qrcode', (req, res) => {
  const { studentId, qrCode } = req.body;
  
  if (!studentId || !qrCode) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student ID and QR code are required' 
    });
  }
  
  // Find activity by QR code
  const activity = Object.values(activities).find(a => a.qrCode === qrCode);
  if (!activity) {
    return res.status(404).json({ 
      success: false, 
      message: 'Invalid QR code' 
    });
  }
  
  // Check if student is registered for this activity
  const registration = findRegistrationByActivityAndStudent(activity.id, studentId);
  if (!registration) {
    return res.status(400).json({ 
      success: false, 
      message: 'You are not registered for this activity' 
    });
  }
  
  if (registration.status !== 'approved') {
    return res.status(400).json({ 
      success: false, 
      message: 'Your registration is not approved yet' 
    });
  }
  
  // Check if already checked in
  const existingCheckin = findCheckinByActivityAndStudent(activity.id, studentId);
  if (existingCheckin) {
    return res.status(400).json({ 
      success: false, 
      message: 'You have already checked in for this activity' 
    });
  }
  
  // Create checkin record
  const newCheckin = {
    id: checkinIdCounter++,
    activityId: activity.id,
    studentId,
    checkinTime: new Date().toISOString(),
    method: 'qr',
    status: 'checked-in'
  };
  
  checkins.push(newCheckin);
  
  res.json({
    success: true,
    message: 'Check-in successful!',
    data: newCheckin
  });
});

// Checkin code checkin
app.post('/api/checkin/code', (req, res) => {
  const { studentId, activityId, checkinCode } = req.body;
  
  if (!studentId || !activityId || !checkinCode) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student ID, Activity ID and check-in code are required' 
    });
  }
  
  const activity = activities[activityId];
  if (!activity) {
    return res.status(404).json({ 
      success: false, 
      message: 'Activity not found' 
    });
  }
  
  // Verify checkin code
  if (activity.checkinCode !== checkinCode) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid check-in code' 
    });
  }
  
  // Check if student is registered for this activity
  const registration = findRegistrationByActivityAndStudent(activityId, studentId);
  if (!registration) {
    return res.status(400).json({ 
      success: false, 
      message: 'You are not registered for this activity' 
    });
  }
  
  if (registration.status !== 'approved') {
    return res.status(400).json({ 
      success: false, 
      message: 'Your registration is not approved yet' 
    });
  }
  
  // Check if already checked in
  const existingCheckin = findCheckinByActivityAndStudent(activityId, studentId);
  if (existingCheckin) {
    return res.status(400).json({ 
      success: false, 
      message: 'You have already checked in for this activity' 
    });
  }
  
  // Create checkin record
  const newCheckin = {
    id: checkinIdCounter++,
    activityId: parseInt(activityId),
    studentId,
    checkinTime: new Date().toISOString(),
    method: 'code',
    status: 'checked-in'
  };
  
  checkins.push(newCheckin);
  
  res.json({
    success: true,
    message: 'Check-in successful!',
    data: newCheckin
  });
});

// Get checkin status for an activity
app.get('/api/activities/:id/checkin-status', (req, res) => {
  const activityId = parseInt(req.params.id);
  const { studentId } = req.query;
  
  if (!studentId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student ID is required' 
    });
  }
  
  const activity = activities[activityId];
  if (!activity) {
    return res.status(404).json({ 
      success: false, 
      message: 'Activity not found' 
    });
  }
  
  const checkin = findCheckinByActivityAndStudent(activityId, studentId);
  
  res.json({
    success: true,
    data: {
      checkedIn: !!checkin,
      checkinTime: checkin ? checkin.checkinTime : null,
      method: checkin ? checkin.method : null
    }
  });
});

// Get user's checkin records
app.get('/api/user/checkins', (req, res) => {
  const { studentId } = req.query;
  
  if (!studentId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student ID is required' 
    });
  }
  
  const userCheckins = checkins.filter(checkin => checkin.studentId === studentId);
  
  // Enrich with activity data
  const enrichedCheckins = userCheckins.map(checkin => {
    const activity = activities[checkin.activityId] || {};
    return {
      ...checkin,
      activity: {
        id: activity.id,
        name: activity.name,
        date: activity.date,
        time: activity.time,
        location: activity.location
      }
    };
  });
  
  res.json({
    success: true,
    data: enrichedCheckins
  });
});

// Apply for makeup checkin
app.post('/api/checkin/makeup', (req, res) => {
  const { studentId, activityId, reason } = req.body;
  
  if (!studentId || !activityId || !reason) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student ID, Activity ID and reason are required' 
    });
  }
  
  const activity = activities[activityId];
  if (!activity) {
    return res.status(404).json({ 
      success: false, 
      message: 'Activity not found' 
    });
  }
  
  // Check if student is registered for this activity
  const registration = findRegistrationByActivityAndStudent(activityId, studentId);
  if (!registration) {
    return res.status(400).json({ 
      success: false, 
      message: 'You are not registered for this activity' 
    });
  }
  
  // Check if already checked in
  const existingCheckin = findCheckinByActivityAndStudent(activityId, studentId);
  if (existingCheckin) {
    return res.status(400).json({ 
      success: false, 
      message: 'You have already checked in for this activity' 
    });
  }
  
  // Create makeup checkin request
  const makeupCheckin = {
    id: checkinIdCounter++,
    activityId: parseInt(activityId),
    studentId,
    reason,
    requestTime: new Date().toISOString(),
    status: 'pending',
    type: 'makeup'
  };
  
  checkins.push(makeupCheckin);
  
  res.json({
    success: true,
    message: 'Makeup check-in request submitted successfully',
    data: makeupCheckin
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Activity Registration Server running on port ${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
  console.log(`Payment page: http://localhost:${PORT}/payment`);
  console.log(`My Registrations: http://localhost:${PORT}/my-registrations`);
  console.log(`Check-in Page: http://localhost:${PORT}/checkin`);
});
