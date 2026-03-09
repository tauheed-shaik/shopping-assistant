const axios = require('axios');

const getAIRecommendation = async (userActivity, products) => {
    try {
        // If no products available, return empty array
        if (!products || products.length === 0) {
            console.log('No products available for recommendations');
            return [];
        }

        // Fallback: if user has no activity, return random products
        if (!userActivity || userActivity.length === 0) {
            console.log('No user activity, returning random products');
            return products.slice(0, 5).map(p => p._id);
        }

        // Shuffle products to ensure variety and include new items
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        const selectedProducts = shuffled.slice(0, 20);

        const prompt = `Based on user activity and available products, suggest 5 product IDs.
User Activity: ${JSON.stringify(userActivity.slice(-10))}
Products: ${JSON.stringify(selectedProducts.map(p => ({ id: p._id.toString(), name: p.name, category: p.category, price: p.price })))}

Return ONLY a valid JSON object with this exact format:
{"recommendations": ["product_id_1", "product_id_2", "product_id_3", "product_id_4", "product_id_5"]}`;

        const response = await axios.post(
            process.env.GROK_ENDPOINT,
            {
                model: process.env.GROK_MODEL,
                messages: [
                    { role: 'system', content: 'You are a shopping assistant. Return only valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        const content = response.data.choices[0].message.content;
        console.log('AI Response:', content);

        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            return products.slice(0, 5).map(p => p._id);
        }

        const recommendations = parsed.recommendations || parsed.product_ids || [];

        const validRecommendations = recommendations.filter(id => {
            return products.some(p => p._id.toString() === id);
        });

        if (validRecommendations.length === 0) {
            return products.slice(0, 5).map(p => p._id);
        }

        return validRecommendations;
    } catch (error) {
        console.error('AI Recommendation Error:', error.response?.data || error.message);
        if (products && products.length > 0) {
            return products.slice(0, Math.min(5, products.length)).map(p => p._id);
        }
        return [];
    }
};

const detectTrendingProducts = async (allProducts, orders) => {
    try {
        if (!allProducts || allProducts.length === 0) {
            return [];
        }

        // Shuffle products to include new ones
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const selectedProducts = shuffled.slice(0, 20);

        const prompt = `Analyze products and identify 5 trending items.
Products: ${JSON.stringify(selectedProducts.map(p => ({ id: p._id.toString(), name: p.name, category: p.category })))}
Orders: ${orders ? orders.length : 0} recent orders

Return ONLY a valid JSON object with this exact format:
{"trending": ["product_id_1", "product_id_2", "product_id_3", "product_id_4", "product_id_5"]}`;

        const response = await axios.post(
            process.env.GROK_ENDPOINT,
            {
                model: process.env.GROK_MODEL,
                messages: [
                    { role: 'system', content: 'You are a trend analyst. Return only valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        const content = response.data.choices[0].message.content;
        console.log('AI Trending Response:', content);

        let parsed;
        try {
            parsed = JSON.parse(content);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            const trending = allProducts.filter(p => p.isTrending);
            if (trending.length > 0) return trending.slice(0, 5).map(p => p._id);
            return allProducts.slice(0, 5).map(p => p._id);
        }

        const trendingIds = parsed.trending || parsed.trending_products || [];
        const validIds = trendingIds.filter(id => allProducts.some(p => p._id.toString() === id));

        if (validIds.length === 0) {
            const trending = allProducts.filter(p => p.isTrending);
            if (trending.length > 0) return trending.slice(0, 5).map(p => p._id);
            return allProducts.slice(0, 5).map(p => p._id);
        }

        return validIds;
    } catch (error) {
        console.error('AI Trending Error:', error.response?.data || error.message);
        if (allProducts && allProducts.length > 0) {
            const trending = allProducts.filter(p => p.isTrending);
            if (trending.length > 0) return trending.slice(0, 5).map(p => p._id);
            return allProducts.slice(0, 5).map(p => p._id);
        }
        return [];
    }
};

const generateProductInsights = async (name, category, description) => {
    try {
        const prompt = `Generate insights for a new product:
Name: ${name}
Category: ${category}
Description: ${description || 'N/A'}

Provide:
1. Improved Description (persuasive, SEO-friendly)
2. Suggested Tags (comma separated)
3. Estimated Price Range (if applicable, or just "N/A")
4. Target Audience

Return ONLY valid JSON in this format:
{
    "improvedDescription": "...",
    "tags": ["tag1", "tag2"],
    "priceRange": "$X - $Y",
    "targetAudience": "..."
}`;

        const response = await axios.post(
            process.env.GROK_ENDPOINT,
            {
                model: process.env.GROK_MODEL,
                messages: [
                    { role: 'system', content: 'You are a product marketing expert. Return only valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        const content = response.data.choices[0].message.content;
        return JSON.parse(content);
    } catch (error) {
        console.error('AI Insights Error:', error);
        throw new Error('Failed to generate insights');
    }
};

module.exports = { getAIRecommendation, detectTrendingProducts, generateProductInsights };
