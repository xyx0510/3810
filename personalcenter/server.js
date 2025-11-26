const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8099;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Mock user data
let userData = {
  id: 1,
  name: 'John Doe',
  studentId: '20230001',
  department: 'Computer Science',
  email: 'john.doe@university.edu',
  avatar: 'https://via.placeholder.com/150',
  joinDate: 'September 2023'
};

let userStats = {
  points: 850,
  certificates: 12,
  activities: 24,
  participated: 24,
  earnedPoints: 850
};

// API Routes

// GET /api/user/profile - Get user profile
app.get('/api/user/profile', (req, res) => {
  res.json({
    success: true,
    data: userData
  });
});

// PUT /api/user/profile - Update user profile
app.put('/api/user/profile', (req, res) => {
  const { name, studentId, department, email } = req.body;
  
  if (name) userData.name = name;
  if (studentId) userData.studentId = studentId;
  if (department) userData.department = department;
  if (email) userData.email = email;
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: userData
  });
});

// POST /api/user/avatar - Upload avatar
app.post('/api/user/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  // Update user avatar path
  userData.avatar = `/uploads/avatars/${req.file.filename}`;
  
  res.json({
    success: true,
    message: 'Avatar uploaded successfully',
    data: {
      avatarUrl: userData.avatar
    }
  });
});

// PUT /api/user/password - Change password
app.put('/api/user/password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // In a real application, you would:
  // 1. Verify the current password
  // 2. Hash the new password
  // 3. Update the password in the database
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }
  
  // Mock password change
  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// GET /api/user/statistics - Get user statistics
app.get('/api/user/statistics', (req, res) => {
  res.json({
    success: true,
    data: userStats
  });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});