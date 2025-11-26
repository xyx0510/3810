const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8099;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Mock database
let activities = [
  {
    id: '1',
    title: 'Frontend Technology Sharing',
    description: 'Learn the latest frontend technology trends',
    startTime: '2024-01-15 14:00:00',
    endTime: '2024-01-15 16:00:00',
    location: 'Teaching Building A101',
    maxParticipants: 50,
    currentParticipants: 25,
    requiresPayment: false,
    fee: 0,
    registrationDeadline: '2024-01-14 23:59:59',
    status: 'published'
  },
  {
    id: '2',
    title: 'Programming Competition',
    description: 'Annual Programming Competition',
    startTime: '2024-01-20 09:00:00',
    endTime: '2024-01-20 17:00:00',
    location: 'Computer Science Lab',
    maxParticipants: 100,
    currentParticipants: 78,
    requiresPayment: true,
    fee: 50,
    registrationDeadline: '2024-01-18 23:59:59',
    status: 'published'
  },
  {
    id: '3',
    title: 'AI Workshop',
    description: 'Hands-on AI and Machine Learning workshop',
    startTime: '2024-01-25 10:00:00',
    endTime: '2024-01-25 16:00:00',
    location: 'Tech Innovation Center',
    maxParticipants: 30,
    currentParticipants: 15,
    requiresPayment: true,
    fee: 100,
    registrationDeadline: '2024-01-23 23:59:59',
    status: 'published'
  }
];

let registrations = [];
let registrationForms = {
  '1': {
    activityId: '1',
    customFields: [
      {
        id: 'class',
        label: 'Class',
        type: 'text',
        required: true
      },
      {
        id: 'experience',
        label: 'Frontend Development Experience',
        type: 'select',
        options: ['None', 'Less than 1 year', '1-3 years', 'More than 3 years'],
        required: true
      }
    ]
  },
  '2': {
    activityId: '2',
    customFields: [
      {
        id: 'student_id',
        label: 'Student ID',
        type: 'text',
        required: true
      },
      {
        id: 'programming_level',
        label: 'Programming Level',
        type: 'select',
        options: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
      },
      {
        id: 'team_name',
        label: 'Team Name',
        type: 'text',
        required: false
      }
    ]
  },
  '3': {
    activityId: '3',
    customFields: [
      {
        id: 'major',
        label: 'Major',
        type: 'text',
        required: true
      },
      {
        id: 'python_experience',
        label: 'Python Experience',
        type: 'select',
        options: ['None', 'Basic', 'Intermediate', 'Advanced'],
        required: true
      },
      {
        id: 'laptop',
        label: 'Will you bring a laptop?',
        type: 'select',
        options: ['Yes', 'No'],
        required: true
      }
    ]
  }
};

// Routes

// Get activities list
app.get('/api/activities', (req, res) => {
  res.json({
    success: true,
    data: activities.filter(activity => activity.status === 'published')
  });
});

// Get activity details
app.get('/api/activities/:id', (req, res) => {
  const activity = activities.find(a => a.id === req.params.id);
  if (!activity) {
    return res.status(404).json({ success: false, message: 'Activity not found' });
  }
  res.json({ success: true, data: activity });
});

// Get registration form configuration
app.get('/api/activities/:id/registration-form', (req, res) => {
  const form = registrationForms[req.params.id];
  if (!form) {
    return res.status(404).json({ success: false, message: 'Registration form not found' });
  }
  res.json({ success: true, data: form });
});

// Check registration eligibility
app.get('/api/activities/:id/check-eligibility', (req, res) => {
  const activity = activities.find(a => a.id === req.params.id);
  if (!activity) {
    return res.json({ success: false, eligible: false, message: 'Activity not found' });
  }

  // Mock user ID (should come from authentication in real app)
  const userId = 'user123';
  
  // Check if already registered
  const existingRegistration = registrations.find(
    r => r.activityId === req.params.id && r.userId === userId
  );

  if (existingRegistration) {
    return res.json({
      success: true,
      eligible: false,
      status: existingRegistration.status,
      registration: existingRegistration
    });
  }

  // Check if activity is full
  if (activity.currentParticipants >= activity.maxParticipants) {
    return res.json({
      success: true,
      eligible: false,
      message: 'Activity is full'
    });
  }

  // Check registration deadline
  const now = new Date();
  const deadline = new Date(activity.registrationDeadline);
  if (now > deadline) {
    return res.json({
      success: true,
      eligible: false,
      message: 'Registration deadline has passed'
    });
  }

  res.json({
    success: true,
    eligible: true,
    status: 'none'
  });
});

// Submit registration application
app.post('/api/activities/:id/register', (req, res) => {
  const { name, studentId, phone, customFields, userId = 'user123' } = req.body;
  const activityId = req.params.id;

  const activity = activities.find(a => a.id === activityId);
  if (!activity) {
    return res.status(404).json({ success: false, message: 'Activity not found' });
  }

  // Check if already registered
  const existingRegistration = registrations.find(
    r => r.activityId === activityId && r.userId === userId
  );
  if (existingRegistration) {
    return res.status(400).json({ success: false, message: 'You have already registered for this activity' });
  }

  // Create registration record
  const registration = {
    id: uuidv4(),
    activityId,
    userId,
    name,
    studentId,
    phone,
    customFields,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  registrations.push(registration);
  
  // Update activity participant count
  activity.currentParticipants += 1;

  res.json({
    success: true,
    message: 'Registration successful',
    data: registration
  });
});

// Update registration information
app.put('/api/registrations/:id', (req, res) => {
  const { name, studentId, phone, customFields } = req.body;
  const registrationId = req.params.id;

  const registration = registrations.find(r => r.id === registrationId);
  if (!registration) {
    return res.status(404).json({ success: false, message: 'Registration record not found' });
  }

  // Only pending registrations can be modified
  if (registration.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Cannot modify approved registration information' });
  }

  // Update information
  registration.name = name;
  registration.studentId = studentId;
  registration.phone = phone;
  registration.customFields = customFields;
  registration.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Registration information updated successfully',
    data: registration
  });
});

// Cancel registration
app.delete('/api/registrations/:id', (req, res) => {
  const registrationId = req.params.id;

  const registrationIndex = registrations.findIndex(r => r.id === registrationId);
  if (registrationIndex === -1) {
    return res.status(404).json({ success: false, message: 'Registration record not found' });
  }

  const registration = registrations[registrationIndex];
  
  // Only pending registrations can be cancelled
  if (registration.status !== 'pending') {
    return res.status(400).json({ success: false, message: 'Cannot cancel approved registration' });
  }

  // Remove from array
  registrations.splice(registrationIndex, 1);
  
  // Update activity participant count
  const activity = activities.find(a => a.id === registration.activityId);
  if (activity) {
    activity.currentParticipants = Math.max(0, activity.currentParticipants - 1);
  }

  res.json({
    success: true,
    message: 'Registration cancelled successfully'
  });
});

// Get user's registration records
app.get('/api/my-registrations', (req, res) => {
  const userId = 'user123'; // Mock user ID
  const userRegistrations = registrations.filter(r => r.userId === userId);
  
  const result = userRegistrations.map(reg => {
    const activity = activities.find(a => a.id === reg.activityId);
    return {
      ...reg,
      activity: activity ? {
        title: activity.title,
        startTime: activity.startTime,
        location: activity.location
      } : null
    };
  });

  res.json({ success: true, data: result });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
