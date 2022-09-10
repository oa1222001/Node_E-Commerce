const Product = require('../models/Product')
const { validationResult } = require('express-validator');
const User = require('../models/User');

exports.getAll = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array().push(' Bad Input '))
        err.statusCode = 400
        return next(err)
    }
    const prodsPerPage = req.body.prodsPerPage;
    const page = req.body.page
    const prods = await Product.find().skip((page - 1) * prodsPerPage).limit(prodsPerPage).catch(err => next(err));
    if (!prods) {
        const err = new Error('No products found.')
        error.statusCode = 404;
        return next(err)
    }
    res.status(200).json({ prods })
}

exports.getProd = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array().push(' Bad Input '))
        err.statusCode = 400
        return next(err)
    }
    const prodId = req.params.prod

    const prod = await Product.findOne({ _id: prodId }).catch(err => {
        return next(err)
    });
    if (!prod) {
        const err = new Error('No products found.')
        err.statusCode = 404;
        return next(err)
    }

    res.status(200).json({ prod })


}
exports.addProd = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array())
        err.statusCode = 400
        return next(err)
    }
    const user = await User.findById(req.user.userId)
    if (!user.isAdmin) {
        const err = new Error('Not Authorized to add product')
        err.statusCode = 401;
        return next(err)
    }
    const prod = await Product.create({
        category: req.body.category,
        name: req.body.name,
        createdBy: req.user.userId,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        isAvailable: req.body.isAvailable,
        rate: req.body?.rate
    })
    if (!prod) {
        const err = new Error('something went wrong')
        err.statusCode = 500;
        return next(err)
    }
    res.status(201).json({ prod: prod })
}
exports.deleteProd = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array())
        err.statusCode = 400
        return next(err)
    }
    const user = await User.findById(req.user.userId).catch(err => next(err))
    if (!user.isAdmin) {
        const err = new Error('Not Authorized to delete product')
        err.statusCode = 401
        return next(err)
    }
    const result = await Product.findByIdAndDelete(req.params.prod).catch(err => next(err))
    if (!result) {
        const err = new Error('Product Not found')
        err.statusCode = 404
        return next(err)
    }
    res.status(204).json({ message: 'deleted' })
}
exports.editProd = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array())
        err.statusCode = 400
        return next(err)
    }
    const user = await User.findById(req.user.userId).catch(err => next(err))
    if (!user.isAdmin) {
        const err = new Error('Not Authorized to delete product')
        err.statusCode = 401
        return next(err)
    }
    const prodId = req.params.prod;
    let prod = await Product.findByIdAndUpdate(prodId, req.body).catch(err => next(err))

    res.status(201).json({ message: 'edited' })
}
