const { Router } = require('express');
const {
  createManufacturerProduct,
  getManufacturerProducts,
  getManufacturerProductById,
  updateManufacturerProduct,
  deleteManufacturerProduct,
  searchManufacturerProducts,
} = require('./manufacturer-product.service.js');

const router = Router();

// ✅ Add manufacturer product to DB
router.post('/', async (req, res) => {
  try {
    const newProduct = await createManufacturerProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating manufacturer product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// ✅ Get all manufacturer products
router.get('/user/:userId', async (req, res) => {
  try {
    const products = await getManufacturerProducts(req.params.userId);
    res.json(products);
  } catch (error) {
    console.error('Error fetching manufacturer products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// ✅ Get manufacturer product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await getManufacturerProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Error fetching manufacturer product:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// ✅ Update manufacturer product
router.put('/:id', async (req, res) => {
  try {
    const updated = await updateManufacturerProduct(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating manufacturer product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// ✅ Delete manufacturer product
router.delete('/:id', async (req, res) => {
  try {
    await deleteManufacturerProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting manufacturer product:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// ✅ Search manufacturer products
router.get('/search/:manufacturerId', async (req, res) => {
  try {
    const products = await searchManufacturerProducts(req.params.manufacturerId, req.query);
    res.json(products);
  } catch (error) {
    console.error('Error searching manufacturer products:', error);
    res.status(500).json({ message: 'Failed to search products' });
  }
});

module.exports = router;