const User = require('../models/User')
const Product = require('../models/Product')
const Order = require('../models/Order')
const { validationResult } = require('express-validator')

exports.showMyOrders = async (req, res, next) => {
    const userId = req.user.userId
    await User.findById(userId).populate('orders').then(doc =>
        res.status(200).json({ orders: doc.orders })
    ).catch(err => next(err))
}

exports.createOrder = async (req, res, next) => {
    const userId = req.user.userId;
    let total = 0;
    await Promise.all(req.body.orderItems.map(
        async (item) => {
            await Product.findById(item).then(doc => { total += +doc.price }).catch(err => next(err))
        }
    ));
    const ord = await Order.create({
        user: userId,
        status: req.body?.status,
        orderItems: req.body.orderItems,
        total
    })
    const user = await User.findById(userId).then(doc => {
        doc.orders = [...doc.orders, ord._id]
        return doc
    }).catch(err => next(err))
    await user.save()

    res.status(201).json({ order: ord })
}

exports.editOrder = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array().push(' Bad Input '))
        err.statusCode = 400
        return next(err)
    }
    const order = await Order.findById(req.params.orderId);
    if (order.user.toString() !== req.user.userId.toString()) {
        const err = new Error('Not Authorized to add product')
        err.statusCode = 401;
        return next(err)
    }
    order.orderItems = req.body.orderItems;
    await order.save()
    res.status(201).json({ msg: "order has been edited" })
}

exports.getAll = async (req, res, next) => {
    const user = await User.findById(req.user.userId);
    if (!user.isAdmin) {
        const err = new Error('Not Authorized to add product')
        err.statusCode = 401;
        return next(err)
    }
    const orders = await Order.find().limit(1000);
    res.status(200).json({ orders })
}

exports.getOrder = async (req, res, next) => {
    const user = await User.findById(req.user.userId);
    if (!user.isAdmin) {
        const err = new Error('Not Authorized to add product')
        err.statusCode = 401;
        return next(err)
    }
    const order = await Order.findById(req.params.orderId);
    res.status(200).json({ order })
}