require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const seedProducts = [
    {
        name: "Classic Leather Chronograph",
        description: "A timeless timepiece featuring premium Italian leather and sapphire glass. Perfect for any formal occasion.",
        price: 199.99,
        comparePrice: 249.99,
        category: "Accessories",
        images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80"],
        stock: 50,
        isTrending: true,
        tags: ["watch", "luxury", "leather"],
        aiDescription: "This watch is trending among professionals who value classic aesthetics and durability."
    },
    {
        name: "Noise-Cancelling Wireless Headphones",
        description: "Experience pure sound with industry-leading noise cancellation and 30-hour battery life.",
        price: 349.00,
        comparePrice: 399.00,
        category: "Electronics",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
        stock: 25,
        isTrending: true,
        tags: ["audio", "wireless", "tech"],
        aiDescription: "The high demand for wireless productivity tools makes this a top trending item in the electronics category."
    },
    {
        name: "Minimalist Ceramic Desk Lamp",
        description: "Handcrafted ceramic base with a linen shade. Brings a warm, organic feel to your workspace.",
        price: 85.00,
        category: "Home Decor",
        images: ["https://images.unsplash.com/photo-1507473884658-cda317865261?w=800&q=80"],
        stock: 15,
        isTrending: false,
        tags: ["home", "office", "minimalist"],
        aiDescription: "Minimalist home office setups are on the rise, making this lamp a highly recommended choice for interior enthusiasts."
    },
    {
        name: "Performance Running Shoes",
        description: "Engineered for speed and comfort. Lightweight mesh upper with reactive cushioning.",
        price: 120.00,
        comparePrice: 150.00,
        category: "Footwear",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
        stock: 100,
        isTrending: true,
        tags: ["sports", "fitness", "shoes"],
        aiDescription: "With the surge in outdoor fitness activities, these shoes are currently a favorite among runners."
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        // Delete existing products if any
        await Product.deleteMany({});

        // Find or create an admin/vendor to assign products to
        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            admin = await User.create({
                name: "System Admin",
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin'
            });
        }

        const productsWithVendor = seedProducts.map(p => ({ ...p, vendor: admin._id }));
        await Product.insertMany(productsWithVendor);

        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
