const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', protect, getProductById); // protect to log activity
router.post('/', protect, authorize('admin', 'vendor'), createProduct);
router.put('/:id', protect, authorize('admin', 'vendor'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'vendor'), deleteProduct);

module.exports = router;
