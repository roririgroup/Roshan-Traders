const { Router } = require('express');

const { serializeBigInt } = require('../../shared/lib/json.js');
const { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, getEmployeeByPhone, getEmployeeByPhoneWithoutRole } = require('./employee.service.js');
const prisma = require('../../shared/lib/db.js');

const { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('./employee.service.js');



const router = Router();

// Helper to send serialized response
const sendSerializedResponse = (res, data) => {
  res.json(serializeBigInt(data));
};



// GET /api/employees - Get all employees (with optional filters)
router.get('/', async (req, res) => {
  try {

    const excludeLabours = req.query.excludeLabours === 'true';
    const onlyLabours = req.query.onlyLabours === 'true';
    
    const employees = await getAllEmployees({ excludeLabours, onlyLabours });
    sendSerializedResponse(res, employees);

    const employees = await getAllEmployees();
    res.json(employees);

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees' });
  }
});




// GET /api/employees/by-phone - Get employee by phone number
router.get('/by-phone', async (req, res) => {
  try {
    const { phone, role } = req.query;
    if (!phone || !role) {
      return res.status(400).json({ message: 'Phone and role are required' });
    }
    const employee = await getEmployeeByPhone(phone, role);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    sendSerializedResponse(res, employee);
  } catch (error) {
    console.error('Error fetching employee by phone:', error.stack || error);
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
});

// POST /api/employees/by-phone - Get employee by phone number (POST method for compatibility)
router.post('/by-phone', async (req, res) => {
  try {
    const { phone, role } = req.body;
    if (!phone || !role) {
      return res.status(400).json({ message: 'Phone and role are required' });
    }
    const employee = await getEmployeeByPhone(phone, role);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    sendSerializedResponse(res, employee);
  } catch (error) {
    console.error('Error fetching employee by phone:', error.stack || error);
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
});


// GET /api/employees/:id - Get employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employee' });
  }
});

// POST /api/employees - Create new employee
router.post('/', async (req, res) => {
  try {
    const employee = await createEmployee(req.body);
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Failed to create employee' });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', async (req, res) => {
  try {
    const employee = await updateEmployee(req.params.id, req.body);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee' });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    await deleteEmployee(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee' });
  }
});

module.exports = router;
