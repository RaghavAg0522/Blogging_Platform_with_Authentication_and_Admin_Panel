const mongoose2 = require('mongoose');

const PostSchema = new mongoose2.Schema({
  title: String,
  content: String,
  author: { type: mongoose2.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose2.model('Post', PostSchema);