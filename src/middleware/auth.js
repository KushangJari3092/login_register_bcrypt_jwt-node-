const jwt = require('jsonwebtoken')

const Register = require('../models/registration')

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwtl;
        // console.log('cookie', token)
        const verify = jwt.verify(token, process.env.SECRET_KEY)
        // console.log('verify :>> ', verify);
        const user = await Register.findOne({ _id: verify._id })
        // console.log('authenticated user :>> ', user);

        req.token = token
        req.user = user
        next();
    } catch (err) {
        res.status(401).send(err)
    }
}
module.exports = auth;