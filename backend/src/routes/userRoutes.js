const express = require('express');
const {
    getUsers,
    deleteUser,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, authorize('admin'), getUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.post('/cart', protect, addToCart);
router.delete('/cart/:id', protect, removeFromCart);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:id', protect, removeFromWishlist);

module.exports = router;
