const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8099;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Mock data
let clubs = [
  {
    id: 1,
    name: 'Computer Association',
    logo: 'https://via.placeholder.com/100x100/4A90E2/FFFFFF?text=CA',
    description: 'A club dedicated to computer technology learning and exchange, regularly hosting programming competitions and technical sharing sessions.',
    fansCount: 156,
    activityCount: 23,
    establishedDate: '2020-09-01',
    contact: 'computer@university.edu',
    introduction: 'The Computer Association was established in September 2020 with the mission of promoting computer science education and technical exchange among students. We organize weekly study groups, monthly technical workshops, and annual programming competitions.'
  },
  {
    id: 2,
    name: 'Photography Club',
    logo: 'https://via.placeholder.com/100x100/50E3C2/FFFFFF?text=PC',
    description: 'For photography enthusiasts to share techniques and organize outdoor shooting activities.',
    fansCount: 89,
    activityCount: 15,
    establishedDate: '2019-03-15',
    contact: 'photo@university.edu',
    introduction: 'The Photography Club brings together students passionate about capturing moments. We organize regular photo walks, technique workshops, and annual photography exhibitions.'
  }
];

let activities = [
  {
    id: 1,
    clubId: 1,
    title: 'Annual Programming Competition',
    description: 'Open programming competition for all students',
    date: '2023-11-15',
    time: '14:00',
    location: 'Computer Science Building Room 101',
    image: 'https://via.placeholder.com/300x150/4A90E2/FFFFFF?text=Programming+Comp',
    status: 'completed'
  },
  {
    id: 2,
    clubId: 1,
    title: 'Web Development Workshop',
    description: 'Learn modern web development with React and Node.js',
    date: '2023-12-05',
    time: '16:00',
    location: 'Library Multimedia Room',
    image: 'https://via.placeholder.com/300x150/4A90E2/FFFFFF?text=Web+Dev+Workshop',
    status: 'upcoming'
  },
  {
    id: 3,
    clubId: 1,
    title: 'AI and Machine Learning Seminar',
    description: 'Introduction to AI and ML concepts and applications',
    date: '2023-10-20',
    time: '15:30',
    location: 'Engineering Building Auditorium',
    image: 'https://via.placeholder.com/300x150/4A90E2/FFFFFF?text=AI+Seminar',
    status: 'completed'
  },
  {
    id: 4,
    clubId: 2,
    title: 'Autumn Photography Walk',
    description: 'Capture the beautiful autumn scenery around campus',
    date: '2023-11-10',
    time: '09:00',
    location: 'Main Campus Square',
    image: 'https://via.placeholder.com/300x150/50E3C2/FFFFFF?text=Autumn+Photo+Walk',
    status: 'completed'
  }
];

let members = [
  {
    id: 1,
    clubId: 1,
    name: 'John Smith',
    avatar: 'https://via.placeholder.com/60x60/4A90E2/FFFFFF?text=JS',
    role: 'President',
    joinDate: '2022-09-01'
  },
  {
    id: 2,
    clubId: 1,
    name: 'Emily Johnson',
    avatar: 'https://via.placeholder.com/60x60/4A90E2/FFFFFF?text=EJ',
    role: 'Vice President',
    joinDate: '2022-10-15'
  },
  {
    id: 3,
    clubId: 1,
    name: 'Michael Chen',
    avatar: 'https://via.placeholder.com/60x60/4A90E2/FFFFFF?text=MC',
    role: 'Technical Lead',
    joinDate: '2023-01-20'
  },
  {
    id: 4,
    clubId: 2,
    name: 'Sarah Wilson',
    avatar: 'https://via.placeholder.com/60x60/50E3C2/FFFFFF?text=SW',
    role: 'President',
    joinDate: '2022-08-10'
  }
];

// Store user follow status (in a real app, this would be in a database)
let userFollows = {};

// API Routes

// Get club details
app.get('/api/clubs/:id', (req, res) => {
  const clubId = parseInt(req.params.id);
  const club = clubs.find(c => c.id === clubId);
  
  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  res.json(club);
});

// Get club activities
app.get('/api/clubs/:id/activities', (req, res) => {
  const clubId = parseInt(req.params.id);
  const clubActivities = activities.filter(a => a.clubId === clubId);
  
  res.json(clubActivities);
});

// Get club members
app.get('/api/clubs/:id/members', (req, res) => {
  const clubId = parseInt(req.params.id);
  const clubMembers = members.filter(m => m.clubId === clubId);
  
  res.json(clubMembers);
});

// Follow a club
app.post('/api/clubs/:id/follow', (req, res) => {
  const clubId = parseInt(req.params.id);
  const userId = req.body.userId || 'defaultUser'; // In a real app, this would come from authentication
  
  if (!userFollows[userId]) {
    userFollows[userId] = [];
  }
  
  if (!userFollows[userId].includes(clubId)) {
    userFollows[userId].push(clubId);
    
    // Update fans count
    const club = clubs.find(c => c.id === clubId);
    if (club) {
      club.fansCount += 1;
    }
  }
  
  res.json({ success: true, message: 'Successfully followed the club' });
});

// Unfollow a club
app.delete('/api/clubs/:id/follow', (req, res) => {
  const clubId = parseInt(req.params.id);
  const userId = req.body.userId || 'defaultUser';
  
  if (userFollows[userId] && userFollows[userId].includes(clubId)) {
    userFollows[userId] = userFollows[userId].filter(id => id !== clubId);
    
    // Update fans count
    const club = clubs.find(c => c.id === clubId);
    if (club && club.fansCount > 0) {
      club.fansCount -= 1;
    }
  }
  
  res.json({ success: true, message: 'Successfully unfollowed the club' });
});

// Get follow status
app.get('/api/clubs/:id/follow-status', (req, res) => {
  const clubId = parseInt(req.params.id);
  const userId = req.query.userId || 'defaultUser';
  
  const isFollowing = userFollows[userId] && userFollows[userId].includes(clubId);
  
  res.json({ isFollowing });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
