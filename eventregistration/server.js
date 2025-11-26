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
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Please provide accurate information. Student ID verification required.',
      feeRequired: true,
      feeAmount: 50
    }
  },
  2: {
    id: 2,
    name: 'Coding Workshop',
    description: 'Hands-on programming workshop for beginners. Learn HTML, CSS, and JavaScript basics.',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Basic computer knowledge required. Bring your own laptop.',
      feeRequired: false,
      feeAmount: 0
    }
  },
  3: {
    id: 3,
    name: 'AI Seminar',
    description: 'Explore the latest developments in artificial intelligence and machine learning.',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Interest in AI and ML technologies.',
      feeRequired: true,
      feeAmount: 25
    }
  }
};

let registrations = [];
let registrationIdCounter = 1;

// Utility functions
const findRegistrationById = (id) => {
  return registrations.find(reg => reg.id === parseInt(id));
};

const findRegistrationByActivityAndStudent = (activityId, studentId) => {
  return registrations.find(reg => 
    reg.activityId === parseInt(activityId) && reg.studentId === studentId
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

  registrations.splice(registrationIndex, 1);

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
});
