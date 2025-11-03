const express = require('express');
const router = express.Router();
const manufacturerEmployeeService = require('./manufacturer_employee.service');

// Middleware to validate manufacturer access
const validateManufacturerAccess = async (req, res, next) => {
  try {
    const { manufacturerId } = req.params;
    // In a real app, you'd validate that the logged-in user has access to this manufacturer
    // For now, we'll just check if manufacturerId is provided
    if (!manufacturerId) {
      return res.status(400).json({ error: 'Manufacturer ID is required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Validation error' });
  }
};



// Get all employees for a manufacturer
router.get('/manufacturer/:manufacturerId/employees', validateManufacturerAccess, async (req, res) => {
  try {
    const { manufacturerId } = req.params;
    const { role } = req.query;

    let employees;
    if (role) {
      employees = await manufacturerEmployeeService.getEmployeesByRole(manufacturerId, role);
    } else {
      employees = await manufacturerEmployeeService.getAllEmployees(manufacturerId);
    }

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get employee by ID
router.get('/manufacturer/:manufacturerId/employees/:employeeId', validateManufacturerAccess, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await manufacturerEmployeeService.getEmployeeById(employeeId);

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    if (error.message === 'Employee not found') {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create new employee
router.post('/manufacturer/:manufacturerId/employees', validateManufacturerAccess, async (req, res) => {
  try {
    const { manufacturerId } = req.params;
    const employeeData = {
      manufacturerId,
      ...req.body
    };

    const employee = await manufacturerEmployeeService.createEmployee(employeeData);

    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update employee
router.put('/manufacturer/:manufacturerId/employees/:employeeId', validateManufacturerAccess, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = req.body;

    const employee = await manufacturerEmployeeService.updateEmployee(employeeId, updateData);

    res.json({
      success: true,
      data: employee,
      message: 'Employee updated successfully'
    });
  } catch (error) {
    if (error.message === 'Employee not found') {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete employee
router.delete('/manufacturer/:manufacturerId/employees/:employeeId', validateManufacturerAccess, async (req, res) => {
  try {
    const { employeeId } = req.params;

    const result = await manufacturerEmployeeService.deleteEmployee(employeeId);

    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message === 'Employee not found') {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get employee statistics
router.get('/manufacturer/:manufacturerId/employees/stats', validateManufacturerAccess, async (req, res) => {
  try {
    const { manufacturerId } = req.params;

    const stats = await manufacturerEmployeeService.getEmployeeStats(manufacturerId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
