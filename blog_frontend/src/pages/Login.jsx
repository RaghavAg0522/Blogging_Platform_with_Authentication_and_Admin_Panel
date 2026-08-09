import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("authChanged"));
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Login failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-panel">
        <h2>Log in to your account</h2>
        <form onSubmit={submit}>
          <input
            className="form-field"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="form-field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="form-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}