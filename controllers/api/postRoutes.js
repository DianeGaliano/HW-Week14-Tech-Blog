const router = require('express').Router();
const {Post, User, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
  Post.findAll({
    attributes: ['id', 'postTitle', 'postContent', 'date_created'],
    include: [
      {
        modle: User,
        attributes: ['username'],
      },
      {
        modle: Comment,
        attributes: ['id', 'content', 'post_id', 'user_id', 'date_created'],
        include: {
          modle: User,
          attributes: ['username'],
        },
      },
    ],
  })
  .then((postData) => {
    res.json(postData.reverse()))
    .catch ((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  
});

router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id', 'postContent', 'postTitle', 'date_created'],
    include: [
      {
        model: User,
        attributes: ['username'],
      },
      {
        model: Comment,
        attributes: ['id', 'content', 'post_id', 'user_id', 'date_created'],
        include: {
          model: User,
          attributes: ['username'],
        },
      },
    ],
  })
  .then((postData) => {
    if(!postData) {
      res.status(404).json({message: 'No post found with this id.'});
      return;
    }
    res.json(postData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/', withAuth, (req, res) => {
  Post.create({
    postTitle: req.body.postTitle,
    postContent: req.body.content,
    user_id: req.session.user_id,
  })
  .then((postData) => 
    res.json(postData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);

    });
});

router.put('/:id', withAuth, (req, res) => {
  Post.update({
    where: {
      id: req.params.id,
    },
  })
  .then((postData) => {
    if(!postData) {
      res.status(404).json({message: 'No post found with this id.'});
      return;
    }
    res.json(postData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;