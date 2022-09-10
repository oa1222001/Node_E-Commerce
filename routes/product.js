const router = require('express').Router();
const auth = require('../middleware/authentication')
const { param, body } = require('express-validator')
const { getAll, getProd, addProd, deleteProd, editProd } = require('../controllers/product')

//requires number of page and number of products per page
router.get('/',
    body('prodsPerPage').not().isEmpty().withMessage('Please provide number of products per page (prodsPerPage)'),
    body('page').not().isEmpty().withMessage('Please provide number of page (page)'),
    getAll);

router.get('/:prod',
    param('prod').notEmpty().withMessage('Provide product id please')
    , getProd);

router.post('/add', auth,
    body('name')


        .notEmpty().trim().withMessage('name'),
    body('description')


        .notEmpty().withMessage('descr').trim(),
    body('image')


        .notEmpty().withMessage('image').trim(),
    body('catagory')


        .isEmpty().withMessage('category').trim(),
    body('isAvailable').notEmpty().withMessage('isAvailable'),
    body('price').notEmpty().withMessage('price')
    ,

    addProd)

router.delete('/delete/:prod', auth,
    param('prod').
        notEmpty().
        withMessage('Provide product id please')
    , deleteProd)

router.post('/edit/:prod', auth, editProd)

module.exports = router