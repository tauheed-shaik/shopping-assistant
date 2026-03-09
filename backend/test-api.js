const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';
let userToken = '';
let testProductId = '';

const testResults = [];

const logTest = (name, status, details = '') => {
    testResults.push({ name, status, details });
    console.log(`[${status}] ${name} ${details ? '- ' + details : ''}`);
};

const runTests = async () => {
    console.log('🚀 Starting API Endpoint Verification...\n');

    // 1. Health Check
    try {
        const res = await axios.get('http://localhost:5000/');
        logTest('Public Health Check', 'PASS', res.data);
    } catch (err) {
        logTest('Public Health Check', 'FAIL', err.message);
    }

    // 2. Auth - Admin Login
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD
        });
        adminToken = res.data.token;
        logTest('Admin Login', 'PASS', `User: ${res.data.name}`);
    } catch (err) {
        logTest('Admin Login', 'FAIL', err.response?.data?.message || err.message);
    }

    // 3. Auth - User Register & Login
    const testUser = {
        name: 'Test Tester',
        email: `test_${Date.now()}@example.com`,
        password: 'password123'
    };

    try {
        const regRes = await axios.post(`${BASE_URL}/auth/register`, testUser);
        userToken = regRes.data.token;
        logTest('User Registration', 'PASS', `User: ${regRes.data.name}`);
    } catch (err) {
        logTest('User Registration', 'FAIL', err.response?.data?.message || err.message);
    }

    // 4. Auth - Profile Verification
    try {
        const res = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        logTest('Get User Profile', 'PASS', `Wishlist size: ${res.data.wishlist?.length}`);
    } catch (err) {
        logTest('Get User Profile', 'FAIL', err.message);
    }

    // 5. Products - Get All
    try {
        const res = await axios.get(`${BASE_URL}/products`);
        logTest('Get All Products (Public)', 'PASS', `Count: ${res.data.length}`);
        if (res.data.length > 0) testProductId = res.data[0]._id;
    } catch (err) {
        logTest('Get All Products (Public)', 'FAIL', err.message);
    }

    // 6. Products - Get By ID
    try {
        const res = await axios.get(`${BASE_URL}/products/${testProductId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        logTest('Get Product By ID', 'PASS', `Name: ${res.data.name}`);
    } catch (err) {
        logTest('Get Product By ID', 'FAIL', err.message);
    }

    // 7. AI - Recommendations
    try {
        const res = await axios.get(`${BASE_URL}/ai/recommendations`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        logTest('AI Recommendations', 'PASS', `Suggested: ${res.data.recommendedProducts?.length || 0}`);
    } catch (err) {
        logTest('AI Recommendations', 'FAIL', err.message);
    }

    // 8. AI - Trending
    try {
        const res = await axios.get(`${BASE_URL}/ai/trending`);
        logTest('AI Trending Analysis', 'PASS', `Trending items: ${res.data.trendingItems?.length || 0}`);
    } catch (err) {
        logTest('AI Trending Analysis', 'FAIL', err.message);
    }

    // 9. AI - Insights Generation
    try {
        const res = await axios.post(`${BASE_URL}/ai/insights`, {
            name: 'Luxury Smart Watch',
            category: 'Electronics',
            description: 'A watch that does everything.'
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        logTest('AI Insights Generation', 'PASS', 'Description generated');
    } catch (err) {
        logTest('AI Insights Generation', 'FAIL', err.response?.data?.message || err.message);
    }

    // 10. User - Wishlist Operations
    try {
        await axios.post(`${BASE_URL}/user/wishlist`, { productId: testProductId }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        logTest('Add to Wishlist', 'PASS');

        const profRes = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const inWishlist = profRes.data.wishlist.some(p => (p._id || p) === testProductId);
        logTest('Verify Wishlist Persistence', inWishlist ? 'PASS' : 'FAIL');

        await axios.delete(`${BASE_URL}/user/wishlist/${testProductId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        logTest('Remove from Wishlist', 'PASS');
    } catch (err) {
        logTest('Wishlist Operations', 'FAIL', err.message);
    }

    // 11. User - Cart Operations
    try {
        await axios.post(`${BASE_URL}/user/cart`, { productId: testProductId, quantity: 2 }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        logTest('Add to Cart', 'PASS');

        await axios.delete(`${BASE_URL}/user/cart/${testProductId}`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        logTest('Remove from Cart', 'PASS');
    } catch (err) {
        logTest('Cart Operations', 'FAIL', err.message);
    }

    // Summary
    console.log('\n📊 Final Test Summary:');
    const passed = testResults.filter(t => t.status === 'PASS').length;
    console.log(`✅ Passed: ${passed}/${testResults.length}`);
    console.log(`❌ Failed: ${testResults.length - passed}/${testResults.length}`);

    if (testResults.some(t => t.status === 'FAIL')) {
        console.log('\nItems to address:');
        testResults.filter(t => t.status === 'FAIL').forEach(t => console.log(`- ${t.name}: ${t.details}`));
    }
};

runTests();
