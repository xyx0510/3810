const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// 模拟数据库


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
      message: '报名记录不存在'
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
      message: '报名记录不存在'
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
      message: '报名记录不存在'
    });
  }
  
  registration.reminderSet = reminderSet;
  
  res.json({
    success: true,
    message: reminderSet ? '活动提醒已设置' : '活动提醒已取消',
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
      message: '报名记录不存在'
    });
  }
  
  if (registration.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: '只有待审核的报名可以修改'
    });
  }
  
  // 更新表单数据
  if (req.body.formData) {
    registration.formData = { ...registration.formData, ...req.body.formData };
  }
  
  res.json({
    success: true,
    message: '报名信息已更新',
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
      message: '报名记录不存在'
    });
  }
  
  const registration = registrations[registrationIndex];
  
  if (registration.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: '只有待审核的报名可以取消'
    });
  }
  
  registrations.splice(registrationIndex, 1);
  
  res.json({
    success: true,
    message: '报名已取消'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
