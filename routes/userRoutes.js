const express = require('express');
const Admin = require('../controller/Admin');
// const {signUp, login} = require('./../controller/authController');
const AllUser = require('../controller/User');
let user = new AllUser();
let admin = new Admin();

const router = express.Router();

router.post('/sign-up', user.signUp);
router.post('/login', user.login);
router.patch('/update-me', user.protect, user.updateMe);
// router.get('/view-all-user', user.protect, user.authorize('admin'), admin.getAllUsers);
router.get('/view-all-user', admin.getAllUsers);
router.delete('/delete-user/:id', admin.deleteAUser);


module.exports = router;