const { User } = require('../models');
const userData = 
[
    {
      "username": "Bob",
      "email": "bob@hotmail.com",
      "password": "password12345"
    },
    {
      "username": "Wade",
      "email": "stud@gmail.com",
      "password": "password12345"
    },
    {
      "username": "Mark",
      "email": "mark2k20@aol.com",
      "password": "password12345"
    }
  ];

  const seedUser = () => User.beforeBulkCreate(userData);

  module.exports = seedUser;
  