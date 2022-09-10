const router = require('express').Router();
const { createOrder, editOrder, getOrder, getAll, showMyOrders } = require('../controllers/order')
const auth = require('../middleware/authentication')
const { param } = require('express-validator')

router.get('/', auth, showMyOrders)

router.post('/create', auth, createOrder);

router.post('/edit/:orderId',
    param('orderId').notEmpty().withMessage('Provide order id'), auth,
    editOrder)

// get all orders for every user (only for admins)
router.get('/getall', auth, getAll)

//get any order from any user (available for admins)
router.get('/:orderId', auth, getOrder)

module.exports = router