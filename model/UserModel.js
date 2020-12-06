const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const { text } = require("express");

const userSchema = mongoose.Schema({
    role: {
        type: String,
        enum: {
            values: ["user", "admin", "cashier"],
            message: ["please select between user, admin, cashier"]
        },
        default: "user"
    },
    name: {
        type: String,
        trim: true,
        required: [true, "name field is required"]
    },
    password: {
        type: String,
        maxLength: [20, 'maximum length of password is 20 charecter'],
        minLength: [6, 'minium length of password is 6'],
        required: [true, 'password field is required'],
        select: false
    },
    confirmPassword: {
        type: String,
        maxLength: [20, 'maximum length of cofirmPassword is 20 charecter'],
        minLength: [6, 'minimum length of confirmPassword is 6'],
        required: [true, 'confirmPassword is required'],
        validate: {
            validator: function(val){
              return  val === this.password;
            },
            message: 'password did not match'
        }
    },
    nid: {
        type: String,
        unique: [true, 'this nid already exist'],
        trim: true,
        required: [true, "nid field is required"]
    },
    user_photo: {
        type: String,
        trim: true
    },
    cell_phone_no: {
        type: String,
        trim: true,
        maxLength: [11, 'Invalid phone no, maximum length is 11'],
        unique: [true, "this phone no already exist"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: [true, 'this email already exist'],
        validate: [validator.isEmail, "please provide a valid email"]
    },
    father_name: String,
    mother_name: String,
    occupation: String,
    institution: String,
    blood_group: {
        type: String,
        enum: {
            values: ['A+', 'B+', 'AB+', 'O+', 'A-', "B-", "O-", "AB-"],
            message: ["invalid blood group"]
        }
    },
    present_address: {
        district: {
            type: String
        },
        subdistrict: String,
        post_office: String,
        village: String
    },
    parmanent_address: {
        district: {
            type: String
        },
        subdistrict: String,
        post_office: String,
        village: String
    }
})

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
})

userSchema.methods.checkPassword = async function(canditatePass, userPass) {
    return await bcrypt.compare(canditatePass, userPass);
  };

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;