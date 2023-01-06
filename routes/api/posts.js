const express = require('express');
const router = express.Router();
const { check , validationResult } = require('express-validator');
const User = require('../../models/User');
const Profile = require('../../models/profile');
const Post = require('../../models/post');
const auth = require('../../middleware/auth')


//@route      POST api/posts
//@desc       add post route
//@access     Private

router.post('/' , [auth,
    [
    check('title', 'Title is required').not().isEmpty()
    ]
],
async(req , res) => {
 const errors =validationResult(req);
 if(!errors.isEmpty()) {
    return res.status(400).json({
        errors: errors.array() });
 }

 console.log('dsCx');
 try {
    const user = await User.findById(req.user.id).select('-password');
   
    const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    });

    const post = await newPost.save();

    res.json(post);
    
 } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
 }
});


module.exports = router;    