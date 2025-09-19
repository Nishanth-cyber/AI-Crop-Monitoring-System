import React from "react";
import logo from "../assets/logo.png";

export default function Header() {
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
      </nav>
    </header>
  );
}
