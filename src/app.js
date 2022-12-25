require('dotenv').config();
const express = require("express");
const exp = express();
const path = require('path')
const hbs = require('hbs')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const port = process.env.PORT || 5000;

require('./db/conn');
const Register = require('./models/registration');
const { JsonWebTokenError } = require("jsonwebtoken");

const partialsPath = path.join(__dirname, '../partials');
hbs.registerPartials(partialsPath)
exp.set("view engine", "hbs");

//to get submitted data in form similar to exp.use(express.json()) in case of postman
exp.use(express.urlencoded({ extended: false }))

exp.get('/', (req, res) => {
    res.render("index")
})
exp.get('/register', (req, res) => {
    res.render("register")
})
exp.get('/login', (req, res) => {
    res.render("login")
})

//inserting
exp.post('/register', async (req, res) => {
    try {
        const pswd = req.body.password;
        const cpswd = req.body.confirmPassword;
        // console.log(pswd)
        // console.log(cpswd)
        if (pswd === cpswd) {
            const emp = new Register({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                age: req.body.age,
                gender: req.body.gender,
                password: req.body.password,
                hashPassword: req.body.password,
            })

            const token = await emp.generateAuthToken();
            console.log('token :>> ', token);

            //(encrypt password -> create hash)=> in registration.js ->  then save

            const result = await emp.save();
            res.send(result)
            // res.render("index")
        } else {
            res.send("password not matching")
        }
    } catch (err) {
        res.send("error in registration : ")
        console.log('err :>> ', err);
    }
})

exp.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Register.findOne({ email: email })

        const isMatch = await bcrypt.compare(password, user.hashPassword);
        // console.log('password', password)
        // console.log('user.password', user.password)

        const token = await user.generateAuthToken();
        console.log('token :>> ', token);

        if (isMatch) {
            res.render("index", { success: 1, name: user.name })
        } else {
            res.send("password not matched")
        }

    } catch (err) {
        res.send("user not found")
    }
})


// console.log('SECRET_KEY :>> ', process.env.SECRET_KEY);
exp.listen(port, () => {
    console.log(`running on port ${port}`)
});