const router = require('express').Router()
const auth = require('../middleware/authentication')
const { showMe, getUser, updateUser, updatePassword, getAll } = require('../controllers/user')
const { param } = require('express-validator')

router.get('/me', auth, showMe)

//for Admins
router.get('/getall', auth, getAll)

router.get('/:userId',
    param('userId').notEmpty().withMessage('please provide user id'),
    getUser)

router.post('/updateme',
    auth,
    updateUser)

// router.post('/updatepassword', auth, updatePassword)




module.exports = router