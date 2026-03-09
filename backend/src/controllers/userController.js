const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get all users (Admin only)
// @route   GET /api/user
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/user/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add to cart
// @route   POST /api/user/cart
// @access  Private
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        console.log(`[AddToCart] User: ${req.user._id}, Product: ${productId}, Qty: ${quantity}`);

        // Find user by ID (ensure we get fresh data)
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize cart if needed
        if (!user.cart) {
            user.cart = [];
        }

        // Check if product exists in cart
        const existItemIndex = user.cart.findIndex(item =>
            item.product && item.product.toString() === productId
        );

        if (existItemIndex !== -1) {
            // Update quantity
            user.cart[existItemIndex].quantity += (Number(quantity) || 1);
        } else {
            // Add new item
            user.cart.push({ product: productId, quantity: Number(quantity) || 1 });
        }

        await user.save();

        // Return populated cart
        const populatedUser = await User.findById(req.user._id).populate('cart.product');
        res.json(populatedUser.cart);
    } catch (error) {
        console.error('[AddToCart] Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove from cart
// @route   DELETE /api/user/cart/:id
// @access  Private
exports.removeFromCart = async (req, res) => {
    try {
        console.log(`[RemoveFromCart] User: ${req.user._id}, Product: ${req.params.id}`);
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter out the item
        user.cart = user.cart.filter(item =>
            item.product && item.product.toString() !== req.params.id
        );

        await user.save();

        const populatedUser = await User.findById(req.user._id).populate('cart.product');
        res.json(populatedUser.cart);
    } catch (error) {
        console.error('[RemoveFromCart] Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add to wishlist
// @route   POST /api/user/wishlist
// @access  Private
exports.addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log(`[AddToWishlist] User: ${req.user._id}, Product: ${productId}`);

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.wishlist) {
            user.wishlist = [];
        }

        // Check if already in wishlist (compare strings)
        const exists = user.wishlist.some(id => id.toString() === productId);

        if (!exists) {
            user.wishlist.push(productId);
            await user.save();
        }

        // Return populated wishlist
        const populatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(populatedUser.wishlist);
    } catch (error) {
        console.error('[AddToWishlist] Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove from wishlist
// @route   DELETE /api/user/wishlist/:id
// @access  Private
exports.removeFromWishlist = async (req, res) => {
    try {
        console.log(`[RemoveFromWishlist] User: ${req.user._id}, Product: ${req.params.id}`);
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.wishlist) {
            const populatedUser = await User.findById(req.user._id).populate('wishlist');
            return res.json(populatedUser.wishlist || []);
        }

        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
        await user.save();

        const populatedUser = await User.findById(req.user._id).populate('wishlist');
        res.json(populatedUser.wishlist);
    } catch (error) {
        console.error('[RemoveFromWishlist] Error:', error);
        res.status(500).json({ message: error.message });
    }
};
