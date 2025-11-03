const { Router } = require('express');
const { serializeBigInt } = require('../../shared/lib/json.js');
const { createManufacturer, getAllManufacturers, getManufacturerById, updateManufacturer, deleteManufacturer, getManufacturerEmployees, createManufacturerEmployee, updateManufacturerEmployee, deleteManufacturerEmployee } = require('./manufacturer.service.js');

const router = Router();

// GET /api/manufacturers - Get all manufacturers
router.get('/', async (req, res) => {
  try {
    const manufacturers = await getAllManufacturers();
    res.json(serializeBigInt(manufacturers));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manufacturers' });
  }
});


// GET /api/manufacturers/:id - Get manufacturer by ID
router.get('/:id', async (req, res) => {
  try {
    const manufacturer = await getManufacturerById(req.params.id);
    if (!manufacturer) {
      return res.status(404).json({ message: 'Manufacturer not found' });
    }
    res.json(serializeBigInt(manufacturer));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manufacturer' });
  }
});

// POST /api/manufacturers - Create new manufacturer
router.post('/', async (req, res) => {
  try {
    const manufacturer = await createManufacturer(req.body);
    res.status(201).json(serializeBigInt(manufacturer));
  } catch (error) {
    console.error('Error creating manufacturer:', error);
    res.status(500).json({ message: 'Failed to create manufacturer' });
  }
});

// PUT /api/manufacturers/:id - Update manufacturer
router.put('/:id', async (req, res) => {
  try {
    const manufacturer = await updateManufacturer(req.params.id, req.body);
    res.json(serializeBigInt(manufacturer));
  } catch (error) {
    console.error('Error updating manufacturer:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      message: 'Failed to update manufacturer',
      error: errorMessage
    });
  }
});

// DELETE /api/manufacturers/:id - Delete manufacturer
router.delete('/:id', async (req, res) => {
  try {
    await deleteManufacturer(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete manufacturer' });
  }
});

// GET /api/manufacturers/:id/employees - Get employees for a manufacturer
router.get('/:id/employees', async (req, res) => {
  try {
    const { role } = req.query;
    const employees = await getManufacturerEmployees(req.params.id, role);
    res.json(serializeBigInt({ success: true, data: employees }));
  } catch (error) {
    console.error('Error fetching manufacturer employees:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employees' });
  }
});

// POST /api/manufacturers/:id/employees - Create new manufacturer employee
router.post('/:id/employees', async (req, res) => {
  try {
    const employee = await createManufacturerEmployee(req.params.id, req.body);
    res.status(201).json(serializeBigInt({ success: true, data: employee }));
  } catch (error) {
    console.error('Error creating manufacturer employee:', error);
    res.status(500).json({ success: false, message: 'Failed to create employee' });
  }
});

// PUT /api/manufacturers/:id/employees/:employeeId - Update manufacturer employee
router.put('/:id/employees/:employeeId', async (req, res) => {
  try {
    const employee = await updateManufacturerEmployee(req.params.id, req.params.employeeId, req.body);
    res.json(serializeBigInt({ success: true, data: employee }));
  } catch (error) {
    console.error('Error updating manufacturer employee:', error);
    res.status(500).json({ success: false, message: 'Failed to update employee' });
  }
});

// DELETE /api/manufacturers/:id/employees/:employeeId - Delete manufacturer employee
router.delete('/:id/employees/:employeeId', async (req, res) => {
  try {
    await deleteManufacturerEmployee(req.params.id, req.params.employeeId);
    res.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting manufacturer employee:', error);
    res.status(500).json({ success: false, message: 'Failed to delete employee' });
  }
});

module.exports = router;
