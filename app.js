const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const mongoose = require('mongoose')
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')


dotenv.config()


const app = express()


const authRouter = require('./routes/auth')
const verificationRouter = require('./routes/verification')
const productRouter = require('./routes/product')
const userRouter = require('./routes/user')
const orderRouter = require('./routes/order')

app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 60 * 1000, //1 Min
    max: 100 // 100 requests
}))
app.use(express.json())

// Security Middlwares
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/', (req, res) => {
    res.send('<h1>E-commerce API by Omar Allam </h1><h1> For more Work <a href="https://www.linkedin.com/in/oa1222001/">LinkedIn</a> </h1>');
});

// API Routes
app.use('/auth', authRouter)
app.use('/verification', verificationRouter)
app.use('/product', productRouter)
app.use('/user', userRouter)
app.use('/order', orderRouter)

app.use(notFound)
app.use(errorHandlerMiddleware)

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log('Listening');
    })
}
)