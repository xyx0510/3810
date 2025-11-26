const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8099;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage (replace with database in production)
let activities = {
  1: {
    id: 1,
    name: 'Tech Conference 2024',
    description: 'Annual technology conference',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Please fill all fields accurately',
      feeRequired: true,
      feeAmount: 50
    }
  },
  2: {
    id: 2,
    name: 'Coding Workshop',
    description: 'Learn programming basics',
    registrationForm: {
      fields: ['name', 'studentId', 'phone', 'email'],
      requirements: 'Basic programming knowledge required',
      feeRequired: false,
      feeAmount: 0
    }
  }
};

let registrations = [];
let registrationIdCounter = 1;

// Utility function to find registration by ID
const findRegistrationById = (id) => {
  return registrations.find(reg => reg.id === parseInt(id));
};

// Utility function to find registration by activity and student ID
const findRegistrationByActivityAndStudent = (activityId, studentId) => {
  return registrations.find(reg => 
    reg.activityId === parseInt(activityId) && reg.studentId === studentId
  );
};

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
    paid: !activity.registrationForm.feeRequired // If no fee required, mark as paid
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

  // Check if registration can be modified (only pending status)
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
  
  // Check if registration can be cancelled (only pending status)
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

// Get all registrations (for testing)
app.get('/api/registrations', (req, res) => {
  res.json({
    success: true,
    data: registrations
  });
});

// Get activity details
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

// Start server
app.listen(PORT, () => {
  console.log(`Activity Registration Server running on port ${PORT}`);
  console.log(`Access the application at: http://localhost:${PORT}`);
});