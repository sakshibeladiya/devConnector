const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');

const Post = require('../../models/post');
const auth = require('../../middleware/auth')


//@route      POST api/posts
//@desc       add post route
//@access     Private

router.post('/', [auth,
    [
        check('text', 'Text is required').not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
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

//@route      GET api/posts
//@desc       get all posts
//@access     Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });

        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

//@route      GET api/posts/:_id
//@desc       delete post
//@access     Private

router.get('/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Posts not found' });
        }

        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

//@route      DELETE api/posts/:_id
//@desc       delete post
//@access     Private

router.delete('/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Posts not found' });
        }

        //check user
        if (post.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'User not authorized' });
        }
        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

//@route      PUT api/posts/like/:id
//@desc       like post
//@access     Public

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    };
});


//@route      PUT api/posts/like/:id
//@desc       unlike post
//@access     Public

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check if the post has already been liked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }
        //get remove index
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    };
});

//@route      POST api/posts/comment/:id
//@desc       add comment
//@access     Private

router.post('/comment/:id', [auth,
    [
        check('text', 'Text is required').not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);


            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment)

            await post.save();

            res.json(post.comments);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Server Error');
        }
    });

//@route      DELETE api/posts/comment/:id/:comment_id
//@desc       delete comment
//@access     Private


router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {

        const post = await Post.findById(req.params.id);

        //pull out comment
        const comment = post.comments.find(
            comment => comment.id === req.params.comment_id
        );

        //make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'comment does not exists' });
        }

        //get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    };
}
);

module.exports = router;    