const { Router } = require('express');
const { createAdmin, getAllAdmins, getAdminById, updateAdmin, deleteAdmin } = require('./admin.service.js');

const router = Router();

// GET /api/admins - Get all admins
router.get('/', async (req, res) => {
  try {
    const admins = await getAllAdmins();
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Failed to fetch admins' });
  }
});

// GET /api/admins/:id - Get admin by ID
router.get('/:id', async (req, res) => {
  try {
    const admin = await getAdminById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({ message: 'Failed to fetch admin' });
  }
});

// POST /api/admins - Create new admin
router.post('/', async (req, res) => {
  try {
    const admin = await createAdmin(req.body);
    res.status(201).json(admin);
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Failed to create admin' });
  }
});

// PUT /api/admins/:id - Update admin
router.put('/:id', async (req, res) => {
  try {
    const admin = await updateAdmin(req.params.id, req.body);
    res.json(admin);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Failed to update admin' });
  }
});

// DELETE /api/admins/:id - Delete admin
router.delete('/:id', async (req, res) => {
  try {
    await deleteAdmin(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Failed to delete admin' });
  }
});

module.exports = router;
