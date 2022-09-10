const User = require('../models/User')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail')
const { validationResult } = require('express-validator');


sgMail.setApiKey(process.env.EMAIL_SENDGRID_KEY)




exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const err = new Error(errors.array().push(' Bad Input '))
    err.statusCode = 400
    return next(err)
  }
  const isExisted = await User.find({ email: req.body.email })
  if (isExisted[0]) {
    const err = new Error('Existed User')
    err.statusCode = 409
    return next(err);

  }
  const salt = await bcrypt.genSalt(12)
  req.body.password = await bcrypt.hash(req.body.password, salt)
  const verifyCode = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: '1d' })

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    image: req.body?.image,
    verified: false,
    verifyCode
  })
  sgMail.send({
    to: req.body.email,
    from: 'oa1222001@gmail.com',
    subject: 'Welcome to my E-Commerce! Confirm Your Email',
    html: `<!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <title></title>
        <!--[if mso]>
        <noscript>
          <xml>
            <o:OfficeDocumentSettings>
              <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
          </xml>
        </noscript>
        <![endif]-->
        <style>
          table, td, div, h1, p {font-family: Arial, sans-serif;}
        </style>
      </head>
      <body style="margin:0;padding:0;">
        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
          <tr>
            <td align="center" style="padding:0;">
              <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #cccccc;border-spacing:0;text-align:left;">
                <tr>
                  <td align="center" style="padding:40px 0 30px 0;background:#70bbd9;">
                    <img src="https://assets.codepen.io/210284/h1.png" alt="" width="300" style="height:auto;display:block;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:36px 30px 42px 30px;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                      <tr>
                        <td style="padding:0 0 36px 0;color:#153643;">
                          <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Confirm your email</h1>
                          <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
      You're on your way!
      Let's confirm your email address.
      By clicking on the following link, you are confirming your email address.
      
      Confirm Email Address</p>
                          <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="http://${process.env.DOMAIN + process.env.PORT + '/verification/' + verifyCode}" style="color:#ee4c50;text-decoration:underline;">Confirm now</a></p>
                        </td>
                      </tr>
                    
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:30px;background:#ee4c50;">
                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                      <tr>
                        <td style="padding:0;width:50%;" align="left">
                          <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                            &reg; Someone, Somewhere 2021<br/>
                          </p>
                        </td>
                        <td style="padding:0;width:50%;" align="right">
                        
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>`
  })


  const token = jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
  res.status(201).json({ user: { name: user.name }, token })
}

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(errors.array().push(' Bad Input '))
    err.statusCode = 400
    return next(err)
  }

  const { email, password } = req.body

  if (!email || !password) {
    const err = new Error('Please provide email and password')
    err.statusCode = 400
    return next(err)
  }

  const user = await User.findOne({ email }).catch(err => next(err))
  if (!user) {
    const err = new Error('Invalid Credentials')
    err.statusCode = 401
    return next(err)
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {

    const err = new Error('Invalid Credentials')
    err.statusCode = 401
    return next(err)
  }

  if (!user.verified) {
    const err = new Error('You Must Verify Your Email first')
    err.statusCode = 401
    return next(err)
  }

  const token = jwt.sign(
    { userId: user._id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
  res.status(200).json({ user: { name: user.name }, token })
}

