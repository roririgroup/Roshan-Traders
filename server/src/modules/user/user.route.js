const { Router } = require('express');
const { getAllUsers, getUserById } = require('./user.service.js');

const router = Router();


// POST /api/users/signup - User signup
router.post('/signup', async (req, res) => {
  try {
    const user = await signupUser(req.body);
    res.status(201).json({
      message: 'Registration submitted successfully. Waiting for admin approval.',
      user: {
        id: user.id.toString(),
        phoneNumber: user.phoneNumber,
        roles: user.roles,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(400).json({ message: error.message || 'Failed to register user' });
  }
});

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

module.exports = router;
