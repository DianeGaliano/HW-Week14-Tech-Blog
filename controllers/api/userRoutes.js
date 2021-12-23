const { User, Post, Comment } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
  User.findAll({
    attributes: {exclude:['password']},
  })
  .then((userData) => res.json(userData))
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: {exclude: ['password']},
    include: [
      {
        modle: Post,
        attributes: ['id', 'postTitle', 'postContent', 'date_created'],
      },
      {
        model: Comment,
        attributes: ['id', 'content', 'date_created'],
        include: {
          modle: Post,
          attributes: ['postTitle'],
        },
      },
      {
        module: Post,
        attributes: ['title'],
      },
    ],
  })
  .then((userData) => {
    if(!userData) {
      res.status(404).json({message: 'No user found with this id'});
      return;
    }
    res.json(userData);

  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });

});

router.post('/', (req, res) => {
  User.create({
      username: req.body.username,
      password: req.body.password,
  })
  .then((userData) => {
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.loggIn = true;
      res.json(userData);
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/login', async (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
  .then((userData) => {

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  })
   .catch ((err) => {
     console.log(err);
    res.status(400).json(err);
  });
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

router.put('/:id', withAuth, (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id,
    },
  })
  .then((userData) => {
    if(!userData[0]) {
      res.status(404).json({message: 'No user found with id'});
      return;
    }
    res.json(userData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.delete('/:id', withAuth, (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((userData) => {
    if(!userData) {
      res.status(404).json({message: 'No user found with this id.'});
      return;
    }
    res.json(userData);
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
