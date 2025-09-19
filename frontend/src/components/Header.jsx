import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username"); 

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/login");   
  };

  return (
    <header>
      <h1>
        <img src={logo} alt="AICI Logo" />
        <span>AICI</span>
      </h1>
      <nav>
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#predict">Predictions</a>
        {username && (
          <span style={{ marginLeft: "1rem" }}>Welcome, {username}!</span>
        )}
        <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
          Logout
        </button>
      </nav>
    </header>
  );
}
