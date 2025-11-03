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


// GET /api/admins/stats - Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/admins/pending-users - Get all pending users for approval
router.get('/pending-users', async (req, res) => {
  try {
    const users = await getPendingUsers();
    res.json(serializeBigInt(users));
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ message: 'Failed to fetch pending users' });
  }
});

// GET /api/admins/approved-users - Get all approved users
router.get('/approved-users', async (req, res) => {
  try {
    const users = await getApprovedUsers();
    res.json(serializeBigInt(users));
  } catch (error) {
    console.error('Error fetching approved users:', error);
    res.status(500).json({ message: 'Failed to fetch approved users' });
  }
});

// GET /api/admins/rejected-users - Get all rejected users
router.get('/rejected-users', async (req, res) => {
  try {
    const users = await getRejectedUsers();
    res.json(serializeBigInt(users));
  } catch (error) {
    // Log full stack for debugging and return error message in response
    console.error('Error fetching rejected users:', error.stack || error);
    res.status(500).json({ message: 'Failed to fetch rejected users', error: error.message });
  }
});

// POST /api/admins/approve-user/:id - Approve a user
router.post('/approve-user/:id', async (req, res) => {
  try {
    const user = await approveUser(req.params.id, req.body.adminId);
    res.json(serializeBigInt({
      message: `User ${user.profile?.fullName} has been approved successfully`,
      user
    }));
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(400).json({ message: error.message || 'Failed to approve user' });
  }
});

// POST /api/admins/reject-user/:id - Reject a user
router.post('/reject-user/:id', async (req, res) => {
  try {
    const user = await rejectUser(req.params.id, req.body.adminId);
    res.json(serializeBigInt({
      message: `User ${user.profile?.fullName} has been rejected`,
      user
    }));
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(400).json({ message: error.message || 'Failed to reject user' });
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
