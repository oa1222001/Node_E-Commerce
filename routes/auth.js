const { signUp, login } = require('../controllers/auth');
const { body } = require('express-validator');

const router = require('express').Router();

router.post('/signup',
    body('password')
        .trim()
        .isAlphanumeric()
        .isLength({ min: 8, max: 100 })
        .withMessage('Password must be Alphanumeric between 8 and 100 characters.'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Provide a valid Email.')
        .normalizeEmail(),
    body('name')
        .trim()
        .not()
        .isEmpty()

    ,
    signUp)


router.post('/login', body('password')
    .trim()
    .isAlphanumeric()
    .isLength({ min: 8, max: 100 })
    .withMessage('Password must be Alphanumeric between 8 and 100 characters.'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Provide a valid Email.')
        .normalizeEmail()
    , login)

module.exports = router