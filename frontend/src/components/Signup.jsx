import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/auth.css';

const Signup = () => {
  const [form, setForm] = useState({
    username: "", 
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/user/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Signup successful! Please login.");
        setMessage("Login successful!");
        navigate("/");
      } else {
        setMessage(data.message || "Signup failed.");
      }
    } catch (err) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="auth-page">
          <div className="auth-container">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                  <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                </div>
                
                <div className="form-group">
                   <button type="submit">Sign Up</button>
                </div>
          </form>
          {message && <p>{message}</p>}
        </div>
    </div>
  );
};

export default Signup;