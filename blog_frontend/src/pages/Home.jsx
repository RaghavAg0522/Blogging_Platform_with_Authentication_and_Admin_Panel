import { Link } from "react-router-dom";
import PostList from "../components/PostList";

export default function Home({ user }) {
  return (
    <div className="home-page">
      <section className="hero">
        <div>
          <p className="eyebrow">Featured</p>
          <h1>{user ? `Welcome back, ${user.name}.` : "Build your blog, share your stories, and inspire your readers."}</h1>
          <p className="hero-copy">
            {user
              ? "Continue publishing your best stories, engage with readers, and manage your content from a beautiful dashboard."
              : "Welcome to BlogginPlatform — the clean, modern place for writers and readers. Create posts, explore new ideas, and grow your audience with a beautiful publishing experience."}
          </p>
          <div className="hero-actions">
            <Link to="/create" className="button primary">
              Create Post
            </Link>
            {!user && (
              <Link to="/register" className="button secondary">
                Register
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link to="/admin" className="button secondary">
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        <div className="hero-card">
          <p className="eyebrow">Trending</p>
          <h2>Top stories from the community</h2>
          <p>
            Discover the latest posts and featured writing, all in one place. Keep your feed fresh, elegant,
            and easy to browse.
          </p>
        </div>
      </section>

      <section className="posts-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Latest posts</p>
            <h2>New stories from the community</h2>
          </div>
        </div>
        <PostList user={user} />
      </section>
    </div>
  );
}