const UserModel = require('./../model/UserModel');
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

    async deleteAUser(req, res, next) {
        const {id} = req.params;
        await UserModel.findByIdAndDelete(id);
        res.status(404).json({
            status: 'success',
        })
    }
}

module.exports = Admin;