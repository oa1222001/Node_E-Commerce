const mongoose = require('mongoose');

const Order = mongoose.Schema(
    {

        total: {
            type: Number,
            required: true,
        },
        orderItems: {
            type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Product' }],
            required: true,

        },
        status: {
            type: String,
            enum: ['pending', 'failed', 'paid', 'delivered', 'canceled'],
            default: 'pending',
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', Order);