const { Comment } = require('../models');
const commentData =
[
    {
      "content": "I was here 1st!",
      "user_id": 1,
      "post_id": 1
    },
    {
      "content": "I was here 2nd!",
      "user_id": 2,
      "post_id": 2
    },
    {
      "content": "I was here 3rd!",
      "user_id": 3,
      "post_id": 3
    }
  ];

  const seedComment = () => Comment.beforeBulkCreate(commentData);

  module.exports = seedComment;
  