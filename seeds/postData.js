const { Post } = require('../models');
const postData =
[
    {
      "postTitle": "First post",
      "postContent": "Hi",
      "user_id": 1
    },
    {
      "postTitle": "Second post",
      "postContent": "Hello",
      "user_id": 2
    },
    {
     "postTitle": "Third post",
      "postContent": "Whats up",
      "user_id": 3
    }
  ];

  const seedPost = () => Post.beforeBulkCreate(postData);

  module.exports = seedPost;
  