const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 8099;

// 设置 EJS 为模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage with 2025 data (保持不变)
let activities = {
  // ... 保持原有的 activities 数据不变
};

let registrations = [
  // ... 保持原有的 registrations 数据不变
];

let checkins = [
  // ... 保持原有的 checkins 数据不变
];

let registrationIdCounter = 10;
let checkinIdCounter = 4;
let reminders = [];

// Utility functions (保持不变)
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

// ========== 页面路由（使用 EJS 渲染） ==========

// 首页
app.get('/', (req, res) => {
  const activitiesArray = Object.values(activities);
  res.render('index', {
    title: 'Activity Registration System',
    activities: activitiesArray,
    totalActivities: activitiesArray.length
  });
});

// 支付页面
app.get('/payment', (req, res) => {
  res.render('payment', {
    title: 'Payment - Activity Registration System'
  });
});

// 我的报名页面
app.get('/my-registrations', (req, res) => {
  res.render('my-registrations', {
    title: 'My Registrations - Activity Registration System'
  });
});

// 签到页面
app.get('/checkin', (req, res) => {
  res.render('checkin', {
    title: 'Check In - Activity System'
  });
});

// ========== API 路由（保持不变） ==========

// Process payment
app.post('/api/payments/process', (req, res) => {
  // ... 保持原有的支付处理逻辑不变
});

// Get all activities
app.get('/api/activities', (req, res) => {
  // ... 保持原有的活动获取逻辑不变
});

// Get specific activity
app.get('/api/activities/:id', (req, res) => {
  // ... 保持原有的单个活动获取逻辑不变
});

// ... 保持所有其他 API 路由不变

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