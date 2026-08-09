const express2 = require('express');
const router2 = express2.Router();
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/postController');
const { authMiddleware } = require('../middleware/authMiddleware');

router2.get('/', getPosts);
router2.post('/', authMiddleware, createPost);
router2.put('/:id', authMiddleware, updatePost);
router2.delete('/:id', authMiddleware, deletePost);

module.exports = router2;