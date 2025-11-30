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
    logo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.linkedin.com%2Fcompany%2Ftech-innovators7&psig=AOvVaw2XDNMbyMKPYJUTEBjslz-l&ust=1764582108233000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCMCur-XKmZEDFQAAAAAdAAAAABAE',
    followers: 245,
    activities: 12,
    members: 48,
    detailedDescription: 'The Tech Innovators Club is a vibrant community of students passionate about technology and innovation. We organize workshops, hackathons, and guest speaker events to explore cutting-edge technologies and develop practical skills.',
    established: 'January 2020',
    meetingTime: 'Every Wednesday, 6:00 PM',
    location: 'Engineering Building, Room 302'
  },
  2: {
    id: 2,
    name: 'Art & Design Society',
    description: 'Expressing creativity through various art forms and design thinking.',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOLA5LFJiFWAY9FZzYX0rCe1_nNsTYg59Rig&s',
    followers: 178,
    activities: 8,
    members: 32,
    detailedDescription: 'The Art & Design Society brings together creative minds to explore various forms of artistic expression. From painting workshops to digital design sessions, we provide a space for artists of all levels to grow and collaborate.',
    established: 'March 2019',
    meetingTime: 'Every Friday, 4:00 PM',
    location: 'Arts Center, Studio B'
  }
};

const activities = {
  1: [
    {
      id: 1,
      title: 'AI Workshop: Introduction to Machine Learning',
      date: 'March 15, 2025',
      location: 'Computer Lab 3',
      image: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fanexas.net%2Fcourse%2Fintroduction-to-ai-and-machine-learning%2F&psig=AOvVaw0N7fH87EZXIwvjyQLBXo2X&ust=1764581735190000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCNCV_73JmZEDFQAAAAAdAAAAABAK',
      description: 'Join us for an interactive workshop on the basics of machine learning. We will cover topics such as linear regression, classification, and clustering. No prior experience required! This workshop is perfect for beginners who want to get started with AI and machine learning.'
    },
    {
      id: 2,
      title: 'Hackathon 2025',
      date: 'April 5-6, 2025',
      location: 'Innovation Center',
      image: 'https://img.freepik.com/free-vector/hackathon-doodle-hand-drawing-team-programmers-web-developers-managers-graphic-designers-deve_88138-1348.jpg?semt=ais_hybrid&w=740&q=80',
      description: '48-hour hackathon where you can build anything you want. Work in teams or solo to create innovative projects. Prizes for the top three projects! Food and drinks will be provided throughout the event.'
    },
    {
      id: 3,
      title: 'Guest Speaker: Tech Industry Leader',
      date: 'February 20, 2025',
      location: 'Auditorium A',
      image: 'https://i0.wp.com/swisscognitive.ch/wp-content/uploads/2021/09/dalith_steiger_keynote_speaker_expert_in_artificial_intelligence_swisscognitive_portrait_2021_012.jpg?fit=1440%2C810&ssl=1',
      description: 'We have invited a renowned tech industry leader to share their insights and experiences. Learn about career opportunities, industry trends, and get valuable advice for your professional development. Open to all students.'
    }
  ],
  2: [
    {
      id: 4,
      title: 'Watercolor Painting Workshop',
      date: 'March 22, 2025',
      location: 'Arts Center, Studio A',
      image: 'https://cdn.shopify.com/s/files/1/0560/6477/0112/files/IMG_4128-S_480x480.jpg?v=1684139712',
      description: 'Learn the basics of watercolor painting in this hands-on workshop. All materials provided. No experience necessary!'
    },
    {
      id: 5,
      title: 'Digital Art Exhibition',
      date: 'April 12-15, 2025',
      location: 'University Gallery',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS-oYUutvji2GLpFhOVZjWH3C3iWYWmnjbYQ&s',
      description: 'Showcase of digital artwork created by our members. Open to the public.'
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
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Treasurer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 4,
      name: 'Emily Davis',
      role: 'Event Coordinator',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 5,
      name: 'David Wilson',
      role: 'Technical Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
  ],
  2: [
    {
      id: 6,
      name: 'Jessica Brown',
      role: 'President',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 7,
      name: 'Ryan Taylor',
      role: 'Vice President',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 8,
      name: 'Olivia Martinez',
      role: 'Events Director',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
  ]
};

const followStatus = {
  1: false,
  2: false
};

// Routes

// 渲染社团主页
app.get('/club/:id', (req, res) => {
  const clubId = req.params.id;
  const club = clubs[clubId];
  
  if (!club) {
    return res.status(404).send('Club not found');
  }
  
  res.render('index', { 
    club: club,
    activities: activities[clubId] || [],
    members: members[clubId] || [],
    isFollowing: followStatus[clubId] || false
  });
});

// Get club details API
app.get('/api/clubs/:id', (req, res) => {
  const clubId = req.params.id;
  const club = clubs[clubId];
  
  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  res.json(club);
});

// Get club activities API
app.get('/api/clubs/:id/activities', (req, res) => {
  const clubId = req.params.id;
  const clubActivities = activities[clubId] || [];
  
  res.json(clubActivities);
});

// Get club members API
app.get('/api/clubs/:id/members', (req, res) => {
  const clubId = req.params.id;
  const clubMembers = members[clubId] || [];
  
  res.json(clubMembers);
});

// Follow a club API
app.post('/api/clubs/:id/follow', (req, res) => {
  const clubId = req.params.id;
  
  if (!clubs[clubId]) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  followStatus[clubId] = true;
  clubs[clubId].followers += 1;
  
  res.json({ success: true, message: 'Successfully followed the club' });
});

// Unfollow a club API
app.delete('/api/clubs/:id/follow', (req, res) => {
  const clubId = req.params.id;
  
  if (!clubs[clubId]) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  followStatus[clubId] = false;
  clubs[clubId].followers = Math.max(0, clubs[clubId].followers - 1);
  
  res.json({ success: true, message: 'Successfully unfollowed the club' });
});

// Get follow status API
app.get('/api/clubs/:id/follow-status', (req, res) => {
  const clubId = req.params.id;
  
  if (!clubs[clubId]) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  res.json({ isFollowing: followStatus[clubId] || false });
});

// Get activity details API
app.get('/api/activities/:id', (req, res) => {
  const activityId = parseInt(req.params.id);
  let activity = null;
  
  // Search for activity in all clubs
  for (const clubId in activities) {
    activity = activities[clubId].find(a => a.id === activityId);
    if (activity) break;
  }
  
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  
  res.json(activity);
});

// 根路径重定向到默认社团
app.get('/', (req, res) => {
  res.redirect('/club/1');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});
