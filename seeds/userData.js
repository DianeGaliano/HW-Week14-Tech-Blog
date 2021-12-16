const { User } = require('../models');
const userData = 
[
    {
      "name": "Bob",
      "email": "bob@hotmail.com",
      "password": "password12345"
    },
    {
      "name": "Wade",
      "email": "stud@gmail.com",
      "password": "password12345"
    },
    {
      "name": "Mark",
      "email": "mark2k20@aol.com",
      "password": "password12345"
    }
  ];

  const seedUser = () => User.beforeBulkCreate(userData);

  module.exports = seedUser;
  