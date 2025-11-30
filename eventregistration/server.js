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

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory storage with 2025 data
let activities = {
  1: {
    id: 1,
    name: 'Tech Conference 2025',
    description: 'Annual technology conference featuring industry leaders and cutting-edge innovations.',
    date: '2025-06-15',
    time: '09:00',
    location: 'Convention Center',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Please provide accurate information. Student ID verification required.',
      feeRequired: true,
      feeAmount: 50
    },
    checkinCode: 'TECH2025',
    qrCode: 'tech-conf-2025-qr'
  },
  2: {
    id: 2,
    name: 'Coding Workshop',
    description: 'Hands-on programming workshop for beginners. Learn HTML, CSS, and JavaScript basics.',
    date: '2025-06-20',
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
    date: '2025-06-25',
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
  },
  4: {
    id: 4,
    name: 'Robotics Competition',
    description: 'Annual robotics competition for engineering students.',
    date: '2025-07-10',
    time: '08:00',
    location: 'Engineering Building',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Team registration required. Maximum 4 members per team.',
      feeRequired: true,
      feeAmount: 100
    },
    checkinCode: 'ROBOT2025',
    qrCode: 'robotics-comp-qr'
  },
  5: {
    id: 5,
    name: 'Career Fair 2025',
    description: 'Connect with top employers and explore job opportunities.',
    date: '2025-05-15', // Past event for history testing
    time: '10:00',
    location: 'Student Union',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Bring your resume and dress professionally.',
      feeRequired: false,
      feeAmount: 0
    },
    checkinCode: 'CAREER25',
    qrCode: 'career-fair-qr'
  },
  6: {
    id: 6,
    name: 'Hackathon 2025',
    description: '48-hour coding competition with exciting prizes.',
    date: '2025-07-20',
    time: '18:00',
    location: 'Tech Hub',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Programming experience required. Teams of 2-4 members.',
      feeRequired: false,
      feeAmount: 0
    },
    checkinCode: 'HACK25',
    qrCode: 'hackathon-qr'
  },
  7: {
    id: 7,
    name: 'Science Exhibition',
    description: 'Showcase of student research projects and scientific innovations.',
    date: '2025-05-10', // Past event for history testing
    time: '13:00',
    location: 'Science Building',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Project submission required before registration.',
      feeRequired: false,
      feeAmount: 0
    },
    checkinCode: 'SCIEX25',
    qrCode: 'science-expo-qr'
  },
  8: {
    id: 8,
    name: 'Business Pitch Competition',
    description: 'Pitch your startup ideas to industry experts and investors.',
    date: '2025-08-05',
    time: '14:00',
    location: 'Business School',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Business plan submission required.',
      feeRequired: true,
      feeAmount: 30
    },
    checkinCode: 'PITCH25',
    qrCode: 'pitch-comp-qr'
  }
};

// Sample registrations for different statuses - all with 2025 dates
let registrations = [
  // Pending registrations (等待审核)
  {
    id: 1,
    activityId: 1,
    name: 'John Smith',
    studentId: 'S12345',
    phone: '555-0101',
    email: 'john.smith@student.edu',
    status: 'pending',
    registrationDate: '2025-01-15T10:30:00Z',
    paid: false
  },
  {
    id: 2,
    activityId: 8,
    name: 'Sarah Johnson',
    studentId: 'S12345',
    phone: '555-0102',
    email: 'sarah.johnson@student.edu',
    status: 'pending',
    registrationDate: '2025-01-20T14:15:00Z',
    paid: false
  },

  // Approved registrations (已通过)
  {
    id: 3,
    activityId: 2,
    name: 'John Smith',
    studentId: 'S12345',
    phone: '555-0101',
    email: 'john.smith@student.edu',
    status: 'approved',
    registrationDate: '2025-01-10T09:45:00Z',
    paid: true,
    paymentDate: '2025-01-10T10:00:00Z'
  },
  {
    id: 4,
    activityId: 6,
    name: 'John Smith',
    studentId: 'S12345',
    phone: '555-0101',
    email: 'john.smith@student.edu',
    status: 'approved',
    registrationDate: '2025-01-18T16:20:00Z',
    paid: true,
    paymentDate: '2025-01-18T16:30:00Z'
  },

  // Rejected registrations (已拒绝)
  {
    id: 5,
    activityId: 4,
    name: 'John Smith',
    studentId: 'S12345',
    phone: '555-0101',
    email: 'john.smith@student.edu',
    status: 'rejected',
    registrationDate: '2025-01-12T11:30:00Z',
    paid: false,
    rejectionReason: 'Team registration required for this activity'
  },
  {
    id: 6,
    activityId: 8,
    name: 'John Smith',
    studentId: 'S12345',
    phone: '555-0101',
    email: 'john.smith@student.edu',
    status: 'rejected',
    registrationDate: '2025-01-22T13:45:00Z',
    paid: false,
    rejectionReason: 'Business plan submission missing'
  },

  // History registrations (历史记录) - past events or cancelled
  {
    id: 7,
    activityId: 5,
    name: 'John Smith',
    studentId: 'S12345',
    phone: '555-0101',
    email: 'john.smith@student.edu',
    status: 'approved',
    registrationDate: '2025-01-05T08:30:00Z',
    paid: true,
    paymentDate: '2025-01-05T08:45:00Z'
  },
  {
    id: 8,
    activityId: 7,
    name: 'John Smith',
    studentId: 'S12345',
    phone: '555-0101',
    email: 'john.smith@student.edu',
    status: 'approved',
    registrationDate: '2025-01-03T12:15:00Z',
    paid: true,
    paymentDate: '2025-01-03T12:30:00Z'
  },
  {
    id: 9,
    activityId: 3,
    name: 'John Smith',
    studentId: 'S12345',
    phone: '555-0101',
    email: 'john.smith@student.edu',
    status: 'cancelled',
    registrationDate: '2025-01-08T15:20:00Z',
    paid: false
  }
];

// Sample check-in records for 2025
let checkins = [
  {
    id: 1,
    activityId: 5,
    studentId: 'S12345',
    checkinTime: '2025-05-15T10:05:00Z',
    method: 'qr',
    status: 'checked-in'
  },
  {
    id: 2,
    activityId: 7,
    studentId: 'S12345',
    checkinTime: '2025-05-10T13:10:00Z',
    method: 'code',
    status: 'checked-in'
  },
  {
    id: 3,
    activityId: 2,
    studentId: 'S12345',
    checkinTime: '2025-06-20T14:15:00Z',
    method: 'qr',
    status: 'checked-in'
  }
];

let registrationIdCounter = 10;
let checkinIdCounter = 4;

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

// Render EJS templates
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/payment', (req, res) => {
  res.render('payment');
});

app.get('/my-registrations', (req, res) => {
  res.render('my-registrations');
});

app.get('/checkin', (req, res) => {
  res.render('checkin');
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
  
  // Display sample student ID for testing
  console.log(`\nSample Student ID for testing: S12345`);
  console.log(`This student has registrations in all status categories:`);
  console.log(`- Pending: Tech Conference 2025, Business Pitch Competition`);
  console.log(`- Approved: Coding Workshop, Hackathon 2025`);
  console.log(`- Rejected: Robotics Competition, Business Pitch Competition`);
  console.log(`- History: Career Fair 2025, Science Exhibition (past events), AI Seminar (cancelled)`);
});
