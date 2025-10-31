const { Router } = require('express');
const { createProduct, getProducts, getProductsByManufacturer, getProductById, updateProduct, deleteProduct, searchProducts } = require('./product.service.js');

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

// GET /api/products/manufacturer/:userId - Get products by manufacturer user ID
router.get('/manufacturer/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const products = await getProductsByManufacturer(userId);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by manufacturer:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET /api/products/:id - Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// GET /api/products/search - Search products by name or category
router.get('/search', async (req, res) => {
  try {
    const products = await searchProducts(req.query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search products' });
  }
});

module.exports = router;
