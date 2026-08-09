import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      alert("Registered! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.msg || "Registration failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="form-panel">
        <h2>Create your account</h2>
        <form onSubmit={submit}>
          <input
            className="form-field"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}