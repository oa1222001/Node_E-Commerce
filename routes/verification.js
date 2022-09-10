const { param, validationResult } = require('express-validator');
const User = require('../models/User');
const jwt = require('jsonwebtoken')

const router = require('express').Router();

router.get('/:verification',
    param('verification')
        .trim()
        .notEmpty().withMessage("Empty verification param")
    , async (req, res, next) => {
        const verificationToken = req.params.verification
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const err = new Error(errors.array().push(' Bad Input ').join(' , '))
            err.statusCode = 400
            return next(err)
        }
        let wrongInput = false
        const payload = jwt.verify(verificationToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                wrongInput = true
                return
            }
            return decoded
        })
        if (wrongInput) {
            const err = new Error("bad input")
            err.statusCode = 400
            return next(err)
        }

        const user = await User.findOneAndUpdate({ email: payload.email }, { verified: true })
        res.status(200).json({ message: 'Your Email has been Confirmed.' })
    })

module.exports = router