const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 英文姓名池
const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 
  'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Charles', 'Karen', 'Christopher', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Carol', 'Kevin', 'Amanda', 'Brian', 'Dorothy', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Jason', 'Rebecca', 'Edward', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy', 'Nicholas'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
  'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey'
];

// 专业池 (英文)
const majors = [
  'Computer Science', 'Software Engineering', 'Electronic Information Engineering',
  'Communication Engineering', 'Automation', 'Mechanical Engineering', 'Civil Engineering',
  'Architecture', 'Business Administration', 'Marketing', 'Accounting', 'Finance',
  'International Trade', 'English', 'Japanese', 'Law', 'Chinese Language and Literature',
  'Mathematics', 'Physics', 'Chemistry', 'Biological Sciences', 'Clinical Medicine', 'Nursing',
  'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Digital Media', 'Economics'
];

// 国籍池
const nationalities = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan',
  'South Korea', 'India', 'Brazil', 'Mexico', 'Italy', 'Spain', 'Russia', 'China',
  'Singapore', 'Malaysia', 'Netherlands', 'Sweden', 'Norway', 'Switzerland', 'New Zealand'
];

// 活动类型池 (英文)
const activityTypes = [
  'Academic Lecture', 'Technical Workshop', 'Programming Competition', 'Sports Event',
  'Cultural Performance', 'Club Recruitment', 'Volunteer Service', 'Social Practice',
  'Career Planning', 'Entrepreneurship Competition', 'International Culture', 'Language Exchange'
];

// 活动标题池 (英文)
const activityTitles = [
  'AI Frontiers Lecture', 'Web Development Workshop', 'ACM Programming Contest',
  'Campus Basketball Tournament', 'Spring Music Concert', 'Photography Club Recruitment',
  'Community Environmental Service', 'Company Visit Program', 'Career Planning Seminar',
  'Innovation Entrepreneurship Competition', 'Big Data Analysis Workshop',
  'Mobile App Development Bootcamp', 'Electronic Design Competition', 'Soccer Friendly Match',
  'Drama Performance: "Thunderstorm"', 'Book Sharing Club Meeting', 'Elderly Care Volunteer',
  'Internship Fair', 'Resume Writing & Interview Skills', 'Business Plan Training',
  'International Food Festival', 'Language Partner Program', 'Startup Pitch Competition',
  'Data Science Hackathon', 'Robotics Workshop', 'Digital Art Exhibition',
  'Environmental Sustainability Forum', 'Global Leadership Conference'
];

// 地点池 (英文)
const locations = [
  'Teaching Building A101', 'Teaching Building B205', 'Library Auditorium',
  'Student Activity Center', 'Main Gymnasium', 'Basketball Court', 'Football Field',
  'Concert Hall', 'Online Meeting', 'Laboratory Building 301', 'Innovation Incubator',
  'Multi-function Hall', 'International Conference Center', 'Outdoor Amphitheater'
];

// 生成随机学生信息
function generateStudentInfo(index) {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const major = majors[Math.floor(Math.random() * majors.length)];
  const grade = Math.floor(Math.random() * 4) + 1; // 1-4年级
  const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
  
  return {
    name: `${firstName} ${lastName}`,
    studentId: `STU${String(index).padStart(5, '0')}`,
    major: major,
    grade: `Year ${grade}`,
    nationality: nationality,
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@student.edu`
  };
}

// 生成随机活动信息
function generateActivityInfo(index) {
  const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
  const title = activityTitles[Math.floor(Math.random() * activityTitles.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  // 生成活动时间 (过去、现在、未来)
  const now = new Date();
  const timeTypes = ['past', 'current', 'future'];
  const timeType = timeTypes[Math.floor(Math.random() * timeTypes.length)];
  
  let activityTime;
  switch(timeType) {
    case 'past':
      activityTime = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000); // 过去90天内
      break;
    case 'current':
      activityTime = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // 未来7天内
      break;
    case 'future':
      activityTime = new Date(now.getTime() + Math.random() * 60 * 24 * 60 * 60 * 1000); // 未来60天内
      break;
  }
  
  return {
    id: 200 + index,
    title: title,
    type: type,
    cover: `https://picsum.photos/150/150?random=${index}`,
    location: location,
    activityTime: activityTime.toISOString(),
    checkinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    qrCodeData: `checkin:${200 + index}:${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    checkinEnabled: timeType !== 'past'
  };
}

// 生成报名状态
function generateRegistrationStatus(activityTime) {
  const now = new Date();
  const activityDate = new Date(activityTime);
  const statusWeights = [0.25, 0.35, 0.2, 0.2]; // pending, approved, rejected, history
  
  if (activityDate < now) {
    // 过去的活动更可能是history状态
    return 'history';
  }
  
  const rand = Math.random();
  let sum = 0;
  const statuses = ['pending', 'approved', 'rejected', 'history'];
  
  for (let i = 0; i < statusWeights.length; i++) {
    sum += statusWeights[i];
    if (rand <= sum) {
      return statuses[i];
    }
  }
  
  return 'pending';
}

// 生成审核时间
function generateAuditTime(applyTime, status) {
  if (status === 'pending') return null;
  
  const applyDate = new Date(applyTime);
  const auditDelay = Math.floor(Math.random() * 3) + 1; // 1-3天后审核
  return new Date(applyDate.getTime() + auditDelay * 24 * 60 * 60 * 1000).toISOString();
}

// 生成签到记录
function generateCheckinRecord(registration, activity) {
  if (registration.status !== 'approved' || new Date(activity.activityTime) > new Date()) {
    return null;
  }
  
  // 50%的已批准过去活动有签到记录
  if (Math.random() > 0.5) return null;
  
  const activityTime = new Date(activity.activityTime);
  const checkinTime = new Date(activityTime.getTime() + Math.random() * 2 * 60 * 60 * 1000); // 活动开始后2小时内
  
  return {
    id: registration.id * 10,
    userId: registration.userId,
    activityId: activity.id,
    registrationId: registration.id,
    checkinTime: checkinTime.toISOString(),
    checkinType: Math.random() > 0.5 ? 'qrcode' : 'code',
    status: 'success'
  };
}

// 生成补签申请
function generateMakeupApplication(registration, activity) {
  if (registration.status !== 'approved' || new Date(activity.activityTime) > new Date()) {
    return null;
  }
  
  // 只有10%的已批准过去活动有补签申请
  if (Math.random() > 0.1) return null;
  
  const activityTime = new Date(activity.activityTime);
  const applyTime = new Date(activityTime.getTime() + (Math.random() * 3 + 1) * 24 * 60 * 60 * 1000); // 活动结束后1-4天
  
  const reasons = [
    "I was sick and couldn't attend the activity",
    "Transportation issues prevented me from arriving on time",
    "Unexpected family emergency",
    "Conflicting schedule with another important event",
    "Forgot to check in at the venue",
    "Technical issues with the check-in system"
  ];
  
  return {
    id: registration.id * 10 + 1,
    userId: registration.userId,
    activityId: activity.id,
    registrationId: registration.id,
    applyTime: applyTime.toISOString(),
    reason: reasons[Math.floor(Math.random() * reasons.length)],
    status: Math.random() > 0.3 ? 'approved' : 'pending', // 70% approved, 30% pending
    auditTime: Math.random() > 0.3 ? new Date(applyTime.getTime() + 24 * 60 * 60 * 1000).toISOString() : null,
    auditReason: Math.random() > 0.3 ? "Application approved" : null
  };
}

// 生成模拟数据
function generateMockData() {
  const registrations = [];
  const activities = [];
  const checkins = [];
  const makeupApplications = [];
  
  // 生成20个活动
  for (let i = 0; i < 20; i++) {
    activities.push(generateActivityInfo(i));
  }
  
  // 生成120个报名记录
  for (let i = 1; i <= 120; i++) {
    const studentInfo = generateStudentInfo(i);
    const activity = activities[Math.floor(Math.random() * activities.length)];
    
    const now = new Date();
    const applyTime = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // 过去30天内申请
    const status = generateRegistrationStatus(activity.activityTime);
    const auditTime = generateAuditTime(applyTime, status);
    
    const registration = {
      id: i,
      userId: Math.floor(Math.random() * 50) + 1, // 50个不同用户
      activityId: activity.id,
      activityTitle: activity.title,
      activityCover: activity.cover,
      status: status,
      applyTime: applyTime.toISOString(),
      auditTime: auditTime,
      activityTime: activity.activityTime,
      location: activity.location,
      formData: {
        name: studentInfo.name,
        phone: studentInfo.phone,
        email: studentInfo.email,
        studentId: studentInfo.studentId,
        major: studentInfo.major,
        grade: studentInfo.grade,
        nationality: studentInfo.nationality
      },
      reminderSet: Math.random() > 0.7 // 30%设置了提醒
    };
    
    registrations.push(registration);
    
    // 生成对应的签到记录
    const checkin = generateCheckinRecord(registration, activity);
    if (checkin) {
      checkins.push(checkin);
    }
    
    // 生成对应的补签申请
    const makeupApp = generateMakeupApplication(registration, activity);
    if (makeupApp) {
      makeupApplications.push(makeupApp);
    }
  }
  
  return {
    registrations,
    activities,
    checkins,
    makeupApplications
  };
}

// 生成数据
const mockData = generateMockData();
let { registrations, activities, checkins, makeupApplications } = mockData;

console.log(`Generated ${registrations.length} registrations`);
console.log(`Generated ${activities.length} activities`);
console.log(`Generated ${checkins.length} checkins`);
console.log(`Generated ${makeupApplications.length} makeup applications`);

// API路由保持不变...
// 获取我的报名列表
app.get('/api/user/registrations', (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const userId = 1; // 假设当前用户ID为1
  
  let filteredRegistrations = registrations.filter(reg => reg.userId === userId);
  
  if (status && status !== 'all') {
    filteredRegistrations = filteredRegistrations.filter(reg => reg.status === status);
  }
  
  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = filteredRegistrations.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      registrations: result,
      total: filteredRegistrations.length,
      page: parseInt(page),
      totalPages: Math.ceil(filteredRegistrations.length / limit)
    }
  });
});

// 获取报名详情
app.get('/api/registrations/:id', (req, res) => {
  const registrationId = parseInt(req.params.id);
  const registration = registrations.find(reg => reg.id === registrationId);
  
  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'Registration record not found'
    });
  }
  
  res.json({
    success: true,
    data: registration
  });
});

// 获取活动提醒设置
app.get('/api/registrations/:id/reminder', (req, res) => {
  const registrationId = parseInt(req.params.id);
  const registration = registrations.find(reg => reg.id === registrationId);
  
  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'Registration record not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      reminderSet: registration.reminderSet
    }
  });
});

// 设置活动提醒
app.post('/api/registrations/:id/reminder', (req, res) => {
  const registrationId = parseInt(req.params.id);
  const { reminderSet } = req.body;
  const registration = registrations.find(reg => reg.id === registrationId);
  
  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'Registration record not found'
    });
  }
  
  registration.reminderSet = reminderSet;
  
  res.json({
    success: true,
    message: reminderSet ? 'Activity reminder set' : 'Activity reminder canceled',
    data: registration
  });
});

// 修改报名信息
app.put('/api/registrations/:id', (req, res) => {
  const registrationId = parseInt(req.params.id);
  const registration = registrations.find(reg => reg.id === registrationId);
  
  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'Registration record not found'
    });
  }
  
  if (registration.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Only pending registrations can be modified'
    });
  }
  
  // 更新表单数据
  if (req.body.formData) {
    registration.formData = { ...registration.formData, ...req.body.formData };
  }
  
  res.json({
    success: true,
    message: 'Registration information updated',
    data: registration
  });
});

// 取消报名
app.delete('/api/registrations/:id', (req, res) => {
  const registrationId = parseInt(req.params.id);
  const registrationIndex = registrations.findIndex(reg => reg.id === registrationId);
  
  if (registrationIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Registration record not found'
    });
  }
  
  const registration = registrations[registrationIndex];
  
  if (registration.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Only pending registrations can be canceled'
    });
  }
  
  registrations.splice(registrationIndex, 1);
  
  res.json({
    success: true,
    message: 'Registration canceled'
  });
});

// 签到相关API

// 获取活动签到状态
app.get('/api/activities/:id/checkin-status', (req, res) => {
  const activityId = parseInt(req.params.id);
  const userId = 1; // 假设当前用户ID为1
  
  // 查找对应的报名记录
  const registration = registrations.find(
    reg => reg.userId === userId && reg.activityId === activityId
  );
  
  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'No corresponding registration record found'
    });
  }
  
  // 查找签到记录
  const checkin = checkins.find(
    c => c.userId === userId && c.activityId === activityId
  );
  
  // 查找活动信息
  const activity = activities.find(a => a.id === activityId);
  
  res.json({
    success: true,
    data: {
      registrationStatus: registration.status,
      checkinStatus: checkin ? checkin.status : 'not_checked_in',
      checkinTime: checkin ? checkin.checkinTime : null,
      checkinType: checkin ? checkin.checkinType : null,
      checkinEnabled: activity ? activity.checkinEnabled : false,
      activityTime: registration.activityTime
    }
  });
});

// 获取我的签到记录
app.get('/api/user/checkins', (req, res) => {
  const userId = 1; // 假设当前用户ID为1
  const { page = 1, limit = 10 } = req.query;
  
  const userCheckins = checkins.filter(c => c.userId === userId);
  
  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const result = userCheckins.slice(startIndex, endIndex);
  
  // 关联活动信息
  const checkinsWithActivity = result.map(checkin => {
    const registration = registrations.find(r => r.id === checkin.registrationId);
    const activity = activities.find(a => a.id === checkin.activityId);
    
    return {
      ...checkin,
      activityTitle: activity ? activity.title : 'Unknown Activity',
      activityTime: registration ? registration.activityTime : null
    };
  });
  
  res.json({
    success: true,
    data: {
      checkins: checkinsWithActivity,
      total: userCheckins.length,
      page: parseInt(page),
      totalPages: Math.ceil(userCheckins.length / limit)
    }
  });
});

// 扫码签到
app.post('/api/checkin/qrcode', (req, res) => {
  const { qrCodeData } = req.body;
  const userId = 1; // 假设当前用户ID为1
  
  // 解析二维码数据 (格式: checkin:activityId:checkinCode)
  const parts = qrCodeData.split(':');
  if (parts.length !== 3 || parts[0] !== 'checkin') {
    return res.status(400).json({
      success: false,
      message: 'Invalid QR code'
    });
  }
  
  const activityId = parseInt(parts[1]);
  const checkinCode = parts[2];
  
  // 验证活动
  const activity = activities.find(a => a.id === activityId);
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  // 验证签到码
  if (activity.checkinCode !== checkinCode) {
    return res.status(400).json({
      success: false,
      message: 'Check-in code does not match'
    });
  }
  
  // 验证报名状态
  const registration = registrations.find(
    r => r.userId === userId && r.activityId === activityId
  );
  
  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'No corresponding registration record found'
    });
  }
  
  if (registration.status !== 'approved') {
    return res.status(400).json({
      success: false,
      message: 'Only approved registrations can check in'
    });
  }
  
  // 检查是否已签到
  const existingCheckin = checkins.find(
    c => c.userId === userId && c.activityId === activityId
  );
  
  if (existingCheckin) {
    return res.status(400).json({
      success: false,
      message: 'You have already checked in'
    });
  }
  
  // 创建签到记录
  const newCheckin = {
    id: checkins.length + 1,
    userId,
    activityId,
    registrationId: registration.id,
    checkinTime: new Date().toISOString(),
    checkinType: 'qrcode',
    status: 'success'
  };
  
  checkins.push(newCheckin);
  
  res.json({
    success: true,
    message: 'Check-in successful',
    data: newCheckin
  });
});

// 签到码签到
app.post('/api/checkin/code', (req, res) => {
  const { activityId, checkinCode } = req.body;
  const userId = 1; // 假设当前用户ID为1
  
  // 验证活动
  const activity = activities.find(a => a.id === parseInt(activityId));
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  // 验证签到码
  if (activity.checkinCode !== checkinCode) {
    return res.status(400).json({
      success: false,
      message: 'Invalid check-in code'
    });
  }
  
  // 验证报名状态
  const registration = registrations.find(
    r => r.userId === userId && r.activityId === parseInt(activityId)
  );
  
  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'No corresponding registration record found'
    });
  }
  
  if (registration.status !== 'approved') {
    return res.status(400).json({
      success: false,
      message: 'Only approved registrations can check in'
    });
  }
  
  // 检查是否已签到
  const existingCheckin = checkins.find(
    c => c.userId === userId && c.activityId === parseInt(activityId)
  );
  
  if (existingCheckin) {
    return res.status(400).json({
      success: false,
      message: 'You have already checked in'
    });
  }
  
  // 创建签到记录
  const newCheckin = {
    id: checkins.length + 1,
    userId,
    activityId: parseInt(activityId),
    registrationId: registration.id,
    checkinTime: new Date().toISOString(),
    checkinType: 'code',
    status: 'success'
  };
  
  checkins.push(newCheckin);
  
  res.json({
    success: true,
    message: 'Check-in successful',
    data: newCheckin
  });
});

// 申请补签
app.post('/api/checkin/makeup', (req, res) => {
  const { activityId, reason } = req.body;
  const userId = 1; // 假设当前用户ID为1
  
  // 验证活动
  const activity = activities.find(a => a.id === parseInt(activityId));
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  // 验证报名状态
  const registration = registrations.find(
    r => r.userId === userId && r.activityId === parseInt(activityId)
  );
  
  if (!registration) {
    return res.status(404).json({
      success: false,
      message: 'No corresponding registration record found'
    });
  }
  
  if (registration.status !== 'approved') {
    return res.status(400).json({
      success: false,
      message: 'Only approved registrations can apply for makeup check-in'
    });
  }
  
  // 检查是否已签到
  const existingCheckin = checkins.find(
    c => c.userId === userId && c.activityId === parseInt(activityId)
  );
  
  if (existingCheckin) {
    return res.status(400).json({
      success: false,
      message: 'You have already checked in, no need for makeup application'
    });
  }
  
  // 检查是否已有补签申请
  const existingApplication = makeupApplications.find(
    a => a.userId === userId && a.activityId === parseInt(activityId)
  );
  
  if (existingApplication) {
    return res.status(400).json({
      success: false,
      message: 'You have already submitted a makeup application, please wait for review'
    });
  }
  
  // 创建补签申请
  const newApplication = {
    id: makeupApplications.length + 1,
    userId,
    activityId: parseInt(activityId),
    registrationId: registration.id,
    applyTime: new Date().toISOString(),
    reason,
    status: 'pending',
    auditTime: null,
    auditReason: null
  };
  
  makeupApplications.push(newApplication);
  
  res.json({
    success: true,
    message: 'Makeup application submitted, please wait for review',
    data: newApplication
  });
});

// 生成二维码（用于演示）
app.get('/api/activities/:id/qrcode', async (req, res) => {
  const activityId = parseInt(req.params.id);
  const activity = activities.find(a => a.id === activityId);
  
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  try {
    const qrCodeDataURL = await QRCode.toDataURL(activity.qrCodeData);
    res.json({
      success: true,
      data: {
        qrCode: qrCodeDataURL
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code'
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Sample student data has been generated:');
  console.log(`- ${registrations.length} registration records`);
  console.log(`- ${activities.length} activities`);
  console.log(`- ${checkins.length} check-in records`);
  console.log(`- ${makeupApplications.length} makeup applications`);
});
