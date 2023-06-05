const mongoose = require("mongoose")
const note = require("./note")

const registerSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
    },
    userName:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    cpassword:{
        type: String,
        required: true
    },
    item:[note.noteSchema]
})

const Register = new mongoose.model("Register",registerSchema)

module.exports = Register