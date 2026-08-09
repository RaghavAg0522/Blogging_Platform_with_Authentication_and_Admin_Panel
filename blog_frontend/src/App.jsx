import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  useEffect(() => {
    const handleAuthChanged = () => {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    };

    window.addEventListener("authChanged", handleAuthChanged);
    return () => window.removeEventListener("authChanged", handleAuthChanged);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <div className="brand">
            <Link to="/">BlogginPlatform</Link>
          </div>
          <nav className="site-nav">
            <Link to="/">Home</Link>
            <Link to="/create">Create Post</Link>
            {user && user.role === "admin" && <Link to="/admin">Admin Panel</Link>}
            {user ? (
              <>
                <span className="nav-welcome">Welcome, {user.name}</span>
                <button className="nav-button" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </nav>
        </header>

        <main className="page-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/create" element={<CreatePost user={user} />} />
            <Route path="/admin" element={<AdminPanel user={user} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}