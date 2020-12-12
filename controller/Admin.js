const UserModel = require('./../model/UserModel');
const ForumModel = require('./../model/ForumModel');
const User = require('./User');

class Admin extends User {
    constructor() {
        super()
    }

    async getAllUsers(re, res, next) {
        const allusers = await UserModel.find();
        res.status(200).json({
        status: 'success',
        data: {
            allusers
        }
        })
    }

    async getAllPost(req, res, next) {
        const allPosts = await ForumModel.find();
        res.status(200).json({
            status: 'success',
            data: allPosts
        })
    }

    async deletePost(req, res, next) {

    }
}

module.exports = Admin;