const { Router } = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
} = require('./product.service.js');

const router = Router();


// GET /api/products - Get all products
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;
