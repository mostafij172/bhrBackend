const express = require('express');
const Forum = require('./../controller/Forum');
const User = require('./../controller/User');

const router = express.Router();
const forum = new Forum();
const user = new User();

router.post('/new-post', user.protect, user.authorize("user", "admin", "cashier"), forum.createPost);
router.patch('/edit-post/:id',user.protect, forum.editPost);
router.delete('/delete-post/:id', user.protect, forum.deletePost);
router.get('/get-all-posts', forum.getAllPost);
router.get('/get-a-post/:id', forum.getAPost);

module.exports = router;