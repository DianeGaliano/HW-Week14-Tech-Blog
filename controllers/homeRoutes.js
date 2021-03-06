const router = require('express').Router();
const req = require('express/lib/request');
const sequelize = require('../config/connection');
const { Post, User, Comment} = require('../models');

router.get('/', (req, res) => {
  Post.findAll(
    {
      attributes: ['id', 'postTitle', 'user_id', 'date_created'],
      include: [
        {
          model: Comment,
          attributes: [ 'id', 'content', 'post_id', 'user_id', 'date_created'],
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
    attributes: ['id', 'postTitle', 'user_id', 'date_created'],
    include: [
      {
        model: Comment, 
        attributes: ['id', 'content', 'post_id', 'user_id', 'date_created'],
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
      res.status(404).json ({message: 'Post with this id not found.'});
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
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'postTitle', 'user_id', 'date_created'],
    include: [
      {
        model: Comment,
        attributes: [ 'id', 'content', 'post_id', 'user_id', 'date_created'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
      {
        model: User,
        attributes: ['username'],
      }
    ]
  })
  .then((postData) => {
    if (!postData) {
      res.status(404).json({message: 'No post found with this id.'});
      return;
    }
    const posts = postData.get({plain: true});
    res.render('postComments', { posts, loggedIn: req.session.loggedIn});
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
