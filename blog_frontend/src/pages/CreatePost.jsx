import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PostList from "../components/PostList";

export default function CreatePost({ user }) {
  const [form, setForm] = useState({ title: "", content: "" });
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a post.");
      navigate("/login");
      return;
    }

    try {
      await API.post("/api/posts", form);
      setForm({ title: "", content: "" });
      setRefreshKey((prev) => prev + 1);
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        alert("You need to log in before creating a post.");
        navigate("/login");
      } else {
        alert(error.response?.data?.msg || "Could not create post.");
      }
    }
  };

  return (
    <div className="form-page">
      <div className="form-panel">
        <h2>Write a new post</h2>
        <form onSubmit={submit}>
          <input
            className="form-field"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="form-field"
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            style={{ minHeight: "160px" }}
          />
          <button type="submit" className="form-button">
            Publish Post
          </button>
        </form>
      </div>

      <div className="posts-preview">
        <h2>All Posts</h2>
        <PostList refreshKey={refreshKey} user={user} />
      </div>
    </div>
  );
}