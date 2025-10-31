const { Router } = require('express');
const { createManufacturer, getAllManufacturers, getManufacturerById, updateManufacturer, deleteManufacturer } = require('./manufacturer.service.js');

const router = Router();

// GET /api/manufacturers - Get all manufacturers
router.get('/', async (req, res) => {
  try {
    const manufacturers = await getAllManufacturers();
    res.json(manufacturers);
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
    res.json(manufacturer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch manufacturer' });
  }
});

// POST /api/manufacturers - Create new manufacturer
router.post('/', async (req, res) => {
  try {
    const manufacturer = await createManufacturer(req.body);
    res.status(201).json(manufacturer);
  } catch (error) {
    console.error('Error creating manufacturer:', error);
    res.status(500).json({ message: 'Failed to create manufacturer' });
  }
});

// PUT /api/manufacturers/:id - Update manufacturer
router.put('/:id', async (req, res) => {
  try {
    const manufacturer = await updateManufacturer(req.params.id, req.body);
    res.json(manufacturer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update manufacturer' });
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

module.exports = router;
