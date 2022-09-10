const User = require('../models/User')
const { validationResult } = require('express-validator')

exports.showMe = async (req, res, next) => {
    const { userId } = req.user;
    await User.findById(userId).then(
        user => res.status(200).json({ user })
    ).catch(
        err => next(err)
    )

}

exports.getUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err = new Error(errors.array().push(' Bad Input '))
        err.statusCode = 400
        return next(err)
    }
    const { userId } = req.params;
    await User.findById(userId).then(user => res.status(200).json({ user })).catch(
        err => next(err)
    )
}

exports.updateUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const err = new Error(errors.array().push(' Bad Input '))
        err.statusCode = 400
        return next(err)
    }
    const { userId } = req.user
    await User.findByIdAndUpdate(userId, { ...req.body }, { new: true }).then(
        user => res.status(201).json({ user })
    ).catch(err => next(err))

}

// exports.updatePassword = async (req, res, next) => { }

exports.getAll = async (req, res, next) => {
    const { userId } = req.user
    const user = await User.findById(userId)
    if (!user.isAdmin) {
        const err = new Error('Not Authorized to add product')
        err.statusCode = 401;
        return next(err)
    }
    await User.find().limit(1000).then(users =>
        res.status(200).json({ users })
    ).catch(err => next(err))
}