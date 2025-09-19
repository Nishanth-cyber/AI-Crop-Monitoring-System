import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          AICI
        </Link>

        <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/predict" className="nav-link">Predictions</Link>
          <Link to="/pest" className="nav-link">Pest Analysis</Link>
          <Link to="/disease" className="nav-link">Disease Detection</Link>
          <Link to="/crophea" className="nav-link">Crop Health</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          
          {username ? (
            <>
              <span className="username">Welcome, {username}</span>
              <button onClick={handleLogout} className="btn btn-primary">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>

        <button 
          className="mobile-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}