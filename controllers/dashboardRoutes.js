const router = require('express').Router();
const sequilize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll(
        {
            where: {
                user_id: req.session.user_id,
            },
            attributes: ['id', 'postTitle', 'postContent', 'date_created'],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'content', 'post_id', 'user_id', 'date_created'],
                    include: {
                        model: User,
                        attributes: ['username'],
                    },

                },
            ],
        }
    )
    .then((dbPostData) => {
        const posts = dbPostData.map((post) => post.get({plain: true}));
        res.render('dashboard', {posts, loggedIn: true});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne(
        {
            where: {
                id: req.params.id,
              },
              attributes: ["id", "postTitle", "postContent", "date_created"],
              include: [
                {
                  model: User,
                  attributes: ["username"],
                },
                {
                  model: Comment,
                  attributes: ["id", "content", "post_id", "user_id", "date_created"],
                  include: {
                    model: User,
                    attributes: ["username"],
                  },
                },
              ],


        }
    )
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(400).json({message: 'No post found with this id.'});
            return;
        }
        const post = dbPostData.get({plain: true});
        res.render('edit-post', {post, loggedIn: true});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/new', (req, res) => {
    res.render('new-post');
});

module.exports = router;