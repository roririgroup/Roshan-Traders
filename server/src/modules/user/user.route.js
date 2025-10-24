const { Router } = require('express');
const { getAllUsers, getUserById, getAllManufacturers } = require('./user.service.js');

const router = Router();

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

// GET /api/users/manufacturers - Get all manufacturers
router.get('/manufacturers', async (req, res) => {
  try {
    const manufacturers = await getAllManufacturers();
    res.json(manufacturers);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    res.status(500).json({ message: 'Failed to fetch manufacturers' });
  }
});

module.exports = router;
