const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment} = require('../models');

router.get('/', (req, res) => {
  Post.findAll(
    {
      attributes: ['id', 'title', 'content', 'created_at'],
      include: [
        {
          model: Comment,
          attributes: [ 'id', 'comment_text', 'post_id', 'user_id', 'create_at'],
          include: {
            model: User,
            attributes: ['username'],
          },
        },
        {
          model: User,
          attributes: [ 'username'],
        },
      ]
    }
  )
  .then((postData) => {
    const posts = postData.map((Post) => Post.get({plain: true}));
    res.render('homepage', {posts, loggedIn: req.session.loggedIn});
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json;
  });
});

router.get('login', (req, res) => {
  if (res.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

router.get('/Post/:id', (req, res) => {
  Post.findOne( {
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'content', 'post_id', 'user_id', 'created_at'],
    include: [
      {
        model: Comment, 
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username'],
      },
    ],
  })
  .then((postData) => {
    if (!postData) {
      res.status(404).json ({
        message: 'Post with this id not found.'
      });
    }
    const posts = postData.get({ plain: true });
    res.render('singlePost', { posts, loggedIn: req.session.loggedIn });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get('signUp', (req, res) => {
  res.render('signUp');
});

router.get('/postComments', (req, res) => {
  Post.
})
