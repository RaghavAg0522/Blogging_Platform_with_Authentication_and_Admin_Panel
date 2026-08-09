import { useEffect, useState } from "react";
import API from "../services/api";

export default function PostList({ refreshKey = 0, user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", content: "", status: "draft" });

  useEffect(() => {
    if (!user) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    API.get(`/posts`)
      .then((res) => setPosts(res.data))
      .finally(() => setLoading(false));
  }, [refreshKey, user]);

  const startEdit = (post) => {
    setEditingId(post._id);
    setEditValues({
      title: post.title || "",
      content: post.content || "",
      status: post.status || "draft",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({ title: "", content: "", status: "draft" });
  };

  const savePost = async (id) => {
    try {
      const res = await API.put(`/posts/${id}`, editValues);
      setPosts((current) => current.map((post) => (post._id === id ? res.data : post)));
      setEditingId(null);
    } catch (err) {
      alert(err.response?.data?.msg || "Unable to update post.");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${id}`);
      setPosts((current) => current.filter((post) => post._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || "Unable to delete post.");
    }
  };

  if (loading) return <p>Loading posts...</p>;

  if (!user) {
    return <p>Please log in to see your posts.</p>;
  }

  if (!posts || posts.length === 0) {
    return <p>No posts available yet.</p>;
  }

  return (
    <div className="posts-grid">
      {posts.map((post) => (
        <article key={post._id} className="post-card">
          <p className="eyebrow">Article</p>
          {editingId === post._id ? (
            <>
              <input
                className="form-field"
                value={editValues.title}
                onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                placeholder="Title"
              />
              <textarea
                className="form-field"
                value={editValues.content}
                onChange={(e) => setEditValues({ ...editValues, content: e.target.value })}
                placeholder="Content"
                rows={4}
              />
              <select
                className="form-field"
                value={editValues.status}
                onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div className="admin-actions">
                <button onClick={() => savePost(post._id)}>Save</button>
                <button className="secondary" onClick={cancelEdit}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="admin-actions">
                <button onClick={() => startEdit(post)}>Edit</button>
                <button className="danger" onClick={() => deletePost(post._id)}>Delete</button>
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );
}
