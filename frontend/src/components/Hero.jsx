import React from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/Img_1.jpeg";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero" id="home">
      <h2>AI-Powered Crop Intelligence System</h2>
      <p>Predict Harvest Dates, Water Needs, Pest Type, and Suggested Pesticides</p>
      <img src={img1} alt="Crop field" />
      <br />
      <button onClick={() => navigate("/predict")}>Get Started</button>
    </section>
  );
}