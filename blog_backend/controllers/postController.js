const Post = require('../models/post');

exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      author: req.user.id
    });
    await post.save();
    res.json(post);
  } catch {
    res.status(500).send('Error');
  }
};

exports.getPosts = async (req, res) => {
  const posts = await Post.find().populate('author', 'name');
  res.json(posts);
};

exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ msg: 'Not found' });

  if (post.author.toString() !== req.user.id)
    return res.status(403).json({ msg: 'Not allowed' });

  Object.assign(post, req.body);
  await post.save();

  res.json(post);
};

exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json({ msg: 'Not found' });

  if (post.author.toString() !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ msg: 'Not allowed' });

  await post.deleteOne();
  res.json({ msg: 'Deleted' });
};
