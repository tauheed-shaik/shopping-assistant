const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const { getAIRecommendation, detectTrendingProducts } = require('../services/aiService');

// @desc    Get AI personalized recommendations
// @route   GET /api/ai/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const products = await Product.find({});

        const recommendationIds = await getAIRecommendation(user.activityLog, products);

        // Fallback or filter products by IDs returned from AI
        const recommendedProducts = await Product.find({ _id: { $in: recommendationIds } });

        res.json(recommendedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get AI trending products
// @route   GET /api/ai/trending
// @access  Public
exports.getTrending = async (req, res) => {
    try {
        const products = await Product.find({});
        const orders = await Order.find({}).limit(50); // Analyze recent 50 orders

        const trendingIds = await detectTrendingProducts(products, orders);
        const trendingProducts = await Product.find({ _id: { $in: trendingIds } });

        res.json(trendingProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate product insights
// @route   POST /api/ai/insights
// @access  Private/Vendor
exports.generateInsights = async (req, res) => {
    const { generateProductInsights } = require('../services/aiService');
    try {
        const { name, category, description } = req.body;
        if (!name || !category) {
            return res.status(400).json({ message: 'Name and category are required' });
        }
        const insights = await generateProductInsights(name, category, description);
        res.json(insights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
