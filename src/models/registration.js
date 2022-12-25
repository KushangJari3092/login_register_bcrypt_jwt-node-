const { default: mongoose } = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    hashPassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    // confirmPassword: {
    //     type: String,
    //     required: true,
    // },
})

// convert password into hash
employeeSchema.pre("save", async function (next) {
    if (this.isModified("hashPassword")) {
        const hash = await bcrypt.hash(this.hashPassword, 10);
        // console.log('password : ', this.password)
        // console.log('hash :>> ', hash);
        this.hashPassword = hash;
        // console.log('hashed password : ', this.password)
    }
    next();
})


// const jwtKey = "jariwalakushangparimalkumar3092"

//generate jwt token
// to work with instance (employeeSchema) ...use 'methods' and to work with class(collection)..use statics
// to use 'this'...always use 'function' to define function instead of ()=> 
employeeSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        console.log('token', token)
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (err) {
        console.log('err :>> ', err);
    }
}

const Register = new mongoose.model('Register', employeeSchema)

module.exports = Register;