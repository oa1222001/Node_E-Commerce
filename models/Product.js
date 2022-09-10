const mongoose = require('mongoose')

const Product = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: [{ type: String }],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true
    },
    rate: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        required: [true, 'Please provide product category'],

    }
})

module.exports = mongoose.model('Product', Product)