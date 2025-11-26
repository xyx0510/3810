const express = require('express');
const path = require('path');
const app = express();
const PORT = 8099;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock data
const clubs = {
  1: {
    id: 1,
    name: 'Tech Innovators Club',
    description: 'A community of technology enthusiasts exploring the latest innovations.',
    logo: 'https://via.placeholder.com/120',
    followers: 245,
    activities: 12,
    members: 48,
    detailedDescription: 'The Tech Innovators Club is a vibrant community of students passionate about technology and innovation. We organize workshops, hackathons, and guest speaker events to explore cutting-edge technologies and develop practical skills.',
    established: 'January 2020',
    meetingTime: 'Every Wednesday, 6:00 PM',
    location: 'Engineering Building, Room 302'
  }
};

const activities = {
  1: [
    {
      id: 1,
      title: 'AI Workshop: Introduction to Machine Learning',
      date: 'October 15, 2023',
      location: 'Computer Lab 3',
      image: 'https://via.placeholder.com/300x160'
    },
    {
      id: 2,
      title: 'Hackathon 2023',
      date: 'November 5-6, 2023',
      location: 'Innovation Center',
      image: 'https://via.placeholder.com/300x160'
    },
    {
      id: 3,
      title: 'Guest Speaker: Tech Industry Leader',
      date: 'September 20, 2023',
      location: 'Auditorium A',
      image: 'https://via.placeholder.com/300x160'
    }
  ]
};

const members = {
  1: [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'President',
      avatar: 'https://via.placeholder.com/80'
    },
    {
      id: 2,
      name: 'Sarah Miller',
      role: 'Vice President',
      avatar: 'https://via.placeholder.com/80'
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Treasurer',
      avatar: 'https://via.placeholder.com/80'
    },
    {
      id: 4,
      name: 'Emily Davis',
      role: 'Event Coordinator',
      avatar: 'https://via.placeholder.com/80'
    }
  ]
};

const followStatus = {
  1: false
};

// Routes

// Get club details
app.get('/api/clubs/:id', (req, res) => {
  const clubId = req.params.id;
  const club = clubs[clubId];
  
  if (!club) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  res.json(club);
});

// Get club activities
app.get('/api/clubs/:id/activities', (req, res) => {
  const clubId = req.params.id;
  const clubActivities = activities[clubId] || [];
  
  res.json(clubActivities);
});

// Get club members
app.get('/api/clubs/:id/members', (req, res) => {
  const clubId = req.params.id;
  const clubMembers = members[clubId] || [];
  
  res.json(clubMembers);
});

// Follow a club
app.post('/api/clubs/:id/follow', (req, res) => {
  const clubId = req.params.id;
  
  if (!clubs[clubId]) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  followStatus[clubId] = true;
  clubs[clubId].followers += 1;
  
  res.json({ success: true, message: 'Successfully followed the club' });
});

// Unfollow a club
app.delete('/api/clubs/:id/follow', (req, res) => {
  const clubId = req.params.id;
  
  if (!clubs[clubId]) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  followStatus[clubId] = false;
  clubs[clubId].followers = Math.max(0, clubs[clubId].followers - 1);
  
  res.json({ success: true, message: 'Successfully unfollowed the club' });
});

// Get follow status
app.get('/api/clubs/:id/follow-status', (req, res) => {
  const clubId = req.params.id;
  
  if (!clubs[clubId]) {
    return res.status(404).json({ error: 'Club not found' });
  }
  
  res.json({ isFollowing: followStatus[clubId] || false });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});