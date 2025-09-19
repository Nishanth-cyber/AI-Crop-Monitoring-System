import React from "react";
import img1 from "../assets/Img_1.jpeg";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <h2>AI-Powered Crop Intelligence System</h2>
      <p>Predict Harvest Dates, Water Needs, Pest Type, and Suggested Pesticides</p>
      <img src={img1} alt="Crop field" />
      <br />
      <button onClick={() => (window.location.href = "#predict")}>Get Started</button>
    </section>
  );
}
