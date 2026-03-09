const express = require('express');
const { getRecommendations, getTrending, generateInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/recommendations', protect, getRecommendations);
router.get('/trending', getTrending);
router.post('/insights', protect, generateInsights);

module.exports = router;
