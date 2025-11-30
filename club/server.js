const express = require('express');
const path = require('path');
const app = express();
const PORT = 8099;

// 设置 EJS 为模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Mock data - 更新时间为2025年
const clubs = {
  1: {
    id: 1,
    name: 'Tech Innovators Club',
    description: 'A community of technology enthusiasts exploring the latest innovations.',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    followers: 245,
    activities: 12,
    members: 48,
    detailedDescription: 'The Tech Innovators Club is a vibrant community of students passionate about technology and innovation. We organize workshops, hackathons, and guest speaker events to explore cutting-edge technologies and develop practical skills.',
    established: 'January 2020',
    meetingTime: 'Every Wednesday, 6:00 PM',
    location: 'Engineering Building, Room 302',
    category: 'Technology',
    featured: true
  },
  2: {
    id: 2,
    name: 'Art & Design Society',
    description: 'Expressing creativity through various art forms and design thinking.',
    logo: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    followers: 178,
    activities: 8,
    members: 32,
    detailedDescription: 'The Art & Design Society brings together creative minds to explore various forms of artistic expression. From painting workshops to digital design sessions, we provide a space for artists of all levels to grow and collaborate.',
    established: 'March 2019',
    meetingTime: 'Every Friday, 4:00 PM',
    location: 'Arts Center, Studio B',
    category: 'Arts',
    featured: false
  },
  3: {
    id: 3,
    name: 'Environmental Awareness Group',
    description: 'Promoting sustainability and environmental consciousness on campus.',
    logo: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    followers: 156,
    activities: 6,
    members: 28,
    detailedDescription: 'We are dedicated to creating a more sustainable campus and raising awareness about environmental issues. Join us for clean-up drives, educational workshops, and advocacy campaigns.',
    established: 'September 2021',
    meetingTime: 'Every Tuesday, 5:00 PM',
    location: 'Environmental Science Building',
    category: 'Environment',
    featured: true
  },
  4: {
    id: 4,
    name: 'Business & Entrepreneurship Club',
    description: 'Developing future business leaders and entrepreneurs.',
    logo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
    followers: 198,
    activities: 10,
    members: 42,
    detailedDescription: 'Our club provides students with opportunities to develop business skills, network with professionals, and work on real-world projects. We host pitch competitions, mentorship programs, and industry visits.',
    established: 'January 2020',
    meetingTime: 'Every Thursday, 6:30 PM',
    location: 'Business School, Room 105',
    category: 'Business',
    featured: false
  }
};

const activities = {
  1: [
    {
      id: 1,
      title: 'AI Workshop: Introduction to Machine Learning',
      date: 'March 15, 2025',
      location: 'Computer Lab 3',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Join us for an interactive workshop on the basics of machine learning. We will cover topics such as linear regression, classification, and clustering. No prior experience required! This workshop is perfect for beginners who want to get started with AI and machine learning.'
    },
    {
      id: 2,
      title: 'Hackathon 2025',
      date: 'April 5-6, 2025',
      location: 'Innovation Center',
      image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: '48-hour hackathon where you can build anything you want. Work in teams or solo to create innovative projects. Prizes for the top three projects! Food and drinks will be provided throughout the event.'
    }
  ],
  2: [
    {
      id: 3,
      title: 'Watercolor Painting Workshop',
      date: 'March 22, 2025',
      location: 'Arts Center, Studio A',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Learn the basics of watercolor painting in this hands-on workshop. All materials provided. No experience necessary!'
    }
  ],
  3: [
    {
      id: 4,
      title: 'Campus Clean-up Day',
      date: 'April 10, 2025',
      location: 'Main Campus',
      image: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Join us for our quarterly campus clean-up event. Gloves and bags provided. All volunteers receive a free eco-friendly water bottle!'
    }
  ],
  4: [
    {
      id: 5,
      title: 'Startup Pitch Competition',
      date: 'May 8, 2025',
      location: 'Business School Auditorium',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      description: 'Pitch your business idea to a panel of judges for a chance to win seed funding and mentorship opportunities.'
    }
  ]
};

const members = {
  1: [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'President',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      name: 'Sarah Miller',
      role: 'Vice President',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
  ],
  2: [
    {
      id: 3,
      name: 'Jessica Brown',
      role: 'President',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
  ],
  3: [
    {
      id: 4,
      name: 'Michael Chen',
      role: 'President',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
  ],
  4: [
    {
      id: 5,
      name: 'David Wilson',
      role: 'President',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
  ]
};

const followStatus = {
  1: false,
  2: false,
  3: false,
  4: false
};

// 获取所有活动（用于首页显示最新活动）
function getAllActivities() {
  const allActivities = [];
  for (const clubId in activities) {
    allActivities.push(...activities[clubId]);
  }
  // 按日期排序（最新的在前面）
  return allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Routes

// 首页 - 显示所有社团概览
app.get('/', (req, res) => {
  const allClubs = Object.values(clubs);
  const recentActivities = getAllActivities().slice(0, 6); // 获取最近6个活动
  const featuredClubs = allClubs.filter(club => club.featured);
  const categories = [...new Set(allClubs.map(club => club.category))];
  
  res.render('home', {
    clubs: allClubs,
    featuredClubs: featuredClubs,
    recentActivities: recentActivities,
    categories: categories
  });
});

// 社团主页
app.get('/club/:id', (req, res) => {
  const clubId = req.params.id;
  const club = clubs[clubId];
  
  if (!club) {
    return res.status(404).send('Club not found');
  }
  
  res.render('club', { 
    club: club,
    activities: activities[clubId] || [],
    members: members[clubId] || [],
    isFollowing: followStatus[clubId] || false
  });
});

// API Routes (保持不变)
app.get('/api/clubs/:id', (req, res) => {
  const clubId = req.params.id;
  const club = clubs[clubId];
  
  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  res.json(club);
});

app.get('/api/clubs/:id/activities', (req, res) => {
  const clubId = req.params.id;
  const clubActivities = activities[clubId] || [];
  
  res.json(clubActivities);
});

app.get('/api/clubs/:id/members', (req, res) => {
  const clubId = req.params.id;
  const clubMembers = members[clubId] || [];
  
  res.json(clubMembers);
});

app.post('/api/clubs/:id/follow', (req, res) => {
  const clubId = req.params.id;
  
  if (!clubs[clubId]) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  followStatus[clubId] = true;
  clubs[clubId].followers += 1;
  
  res.json({ success: true, message: 'Successfully followed the club' });
});

app.delete('/api/clubs/:id/follow', (req, res) => {
  const clubId = req.params.id;
  
  if (!clubs[clubId]) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  followStatus[clubId] = false;
  clubs[clubId].followers = Math.max(0, clubs[clubId].followers - 1);
  
  res.json({ success: true, message: 'Successfully unfollowed the club' });
});

app.get('/api/clubs/:id/follow-status', (req, res) => {
  const clubId = req.params.id;
  
  if (!clubs[clubId]) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  res.json({ isFollowing: followStatus[clubId] || false });
});

app.get('/api/activities/:id', (req, res) => {
  const activityId = parseInt(req.params.id);
  let activity = null;
  
  for (const clubId in activities) {
    activity = activities[clubId].find(a => a.id === activityId);
    if (activity) break;
  }
  
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  
  res.json(activity);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
