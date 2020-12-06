const {promisify} = require('util')
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");

class AllUser {
    constructor() {
        
    }

    async signUp(req, res, next) {
        const newUser = await UserModel.create(req.body);
        // this.sendResponse(res, 200, newUser)

        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
      
        res.cookie('jwt', token, {
          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600000), 
          httpOnly: true 
         })

        res.status(200).json({
          status: 'successfull',
          token,
          data: newUser
        });
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(401).json({
                status: 'fail',
            })
        }

        const user = await UserModel.findOne({ email }).select('+password');

        if (!user || !(await user.checkPassword(password, user.password))) {
            return res.status(401).json({
                status: 'fail'
            })
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
        res.cookie('jwt', token, {
          domain: '127.0.0.1:3000',
          path: '/',
           expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600000), 
           httpOnly: true 
          })
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json({
            status: 'success',
            token,
            data: user
        })
    }

    async protect (req, res, next) {
        let token;
        if (
          req.headers.authorization &&
          req.headers.authorization.startsWith('Bearer')
        ) {
          token = req.headers.authorization.split(' ')[1];
        }
      
        if (!token) {
          return res.status(400).json({
              status: 'fail',
              message: 'you are not logged in'
          })
        }
      
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
      
        const currentUser = await UserModel.findById(decode.id);
        if (!currentUser) {
          return res.status(401).json({
              status: 'fail',
              message: 'The user belonging to this token is no longer exist'
          })
        }
      
        req.user = currentUser;
        next();
      }

      authorize(...role) {
        return function(req, res, next) {
          if (!role.includes(req.user.role)) {
            res.status(403).json({
                status: 'fail',
                message: 'access denied'
            })
          }
          next();
        };
      };

      async updateMe(req, res, next) {
        let deleteField = ["role", "email", "nid"]
        const newObj = {};
        Object.keys(req.body).forEach(el => {
          if (!deleteField.includes(el)) newObj[el] = req.body[el];
        });

        const updatedUser = await UserModel.findByIdAndUpdate(
          req.user.id,
          newObj,
          {
            new: true,
            runValidators: true
          }
        );

        res.status(201).json({
          status: 'success',
          data: updatedUser
        })
      
      }

}

module.exports = AllUser