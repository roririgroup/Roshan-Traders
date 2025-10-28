const { Router } = require('express');
const { serializeBigInt } = require('../../shared/lib/json.js');
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

  } catch (error) {
    console.error('Error fetching employees:', error.stack || error);
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
});


// GET /api/employees/:id - Get employee by ID
router.get('/:id', async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(serializeBigInt(employee));
  } catch (error) {
    console.error('Error fetching employee:', error.stack || error);
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
});

// POST /api/employees - Create new employee
router.post('/', async (req, res) => {
  try {
    const employee = await createEmployee(req.body);
    sendSerializedResponse(res.status(201), employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    const message = error instanceof Error ? error.message : 'Failed to create employee';
    res.status(400).json({ message });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  try {
    const employee = await updateEmployee(req.params.id, req.body);
    sendSerializedResponse(res, employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    const message = error instanceof Error ? error.message : 'Failed to update employee';
    res.status(400).json({ message });
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
