const express = require('express');
const router = express.Router();
const { createPost, upload, updatePost } = require("../postController")

router.route('')
  .post(upload,createPost);

router.route('/:postId')
  .put(upload,updatePost);


  module.exports = router;
