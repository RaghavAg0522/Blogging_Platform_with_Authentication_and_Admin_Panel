import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminPanel({ user }) {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", content: "", status: "draft" });

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersRes, postsRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/posts"),
      ]);
      setUsers(usersRes.data);
      setPosts(postsRes.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role });
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.msg || "Unable to update role.");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.msg || "Unable to delete user.");
    }
  };

  const startEdit = (post) => {
    setEditingPostId(post._id);
    setEditValues({
      title: post.title || "",
      content: post.content || "",
      status: post.status || "draft",
    });
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditValues({ title: "", content: "", status: "draft" });
  };

  const savePost = async (id) => {
    try {
      await API.put(`/admin/posts/${id}`, editValues);
      setEditingPostId(null);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.msg || "Unable to update post.");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/admin/posts/${id}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.msg || "Unable to delete post.");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="auth-page">
        <div className="form-panel">
          <h2>Admin access required</h2>
          <p>You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <p>Loading admin panel...</p>;
  }

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {error && <p className="error-message">{error}</p>}

      <section className="admin-section">
        <h3>Users</h3>
        <div className="admin-grid">
          {users.map((userItem) => (
            <div key={userItem._id} className="admin-card">
              <p className="eyebrow">{userItem.role}</p>
              <h3>{userItem.name}</h3>
              <p>{userItem.email}</p>
              <div className="admin-actions">
                {userItem.role === "admin" ? (
                  <button onClick={() => updateRole(userItem._id, "user")}>Revoke Admin</button>
                ) : (
                  <button onClick={() => updateRole(userItem._id, "admin")}>Make Admin</button>
                )}
                <button onClick={() => deleteUser(userItem._id)} disabled={userItem._id === user.id}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h3>Posts</h3>
        {posts.length === 0 ? (
          <p>No posts available yet.</p>
        ) : (
          <div className="admin-grid">
            {posts.map((post) => (
              <div key={post._id} className="admin-card">
                <div className="card-header">
                  <div>
                    <p className="eyebrow">{post.author?.name || "Unknown author"}</p>
                    <h3>{post.title}</h3>
                  </div>
                  <span className={`badge status-${post.status || "draft"}`}>
                    {post.status || "draft"}
                  </span>
                </div>

                {editingPostId === post._id ? (
                  <>
                    <input
                      className="form-field admin-input"
                      value={editValues.title}
                      onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
                      placeholder="Title"
                    />
                    <textarea
                      className="form-field admin-input"
                      value={editValues.content}
                      onChange={(e) => setEditValues({ ...editValues, content: e.target.value })}
                      placeholder="Content"
                      rows={5}
                    />
                    <select
                      className="form-field admin-input"
                      value={editValues.status}
                      onChange={(e) => setEditValues({ ...editValues, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <div className="admin-actions admin-actions-right">
                      <button onClick={() => savePost(post._id)}>Save Changes</button>
                      <button className="secondary" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{post.content}</p>
                    <div className="admin-actions admin-actions-right">
                      <button onClick={() => startEdit(post)}>Edit</button>
                      <button className="danger" onClick={() => deletePost(post._id)}>Delete post</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
