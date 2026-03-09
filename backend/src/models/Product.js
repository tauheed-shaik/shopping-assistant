const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    comparePrice: {
        type: Number
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    images: [String],
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        default: 0
    },
    vendor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    isTrending: {
        type: Boolean,
        default: false
    },
    tags: [String],
    aiDescription: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
