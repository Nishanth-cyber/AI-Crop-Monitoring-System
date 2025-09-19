import React from "react";
import "../styles/features.css";
import img2 from "../assets/Img_1.jpeg";
import img3 from "../assets/Img_3.jpeg";
import img4 from "../assets/Img_4.jpeg";
import img5 from "../assets/Img_6.jpeg";

export default function Features() {
  const features = [
    { title: "🌱 Harvest Date Prediction", desc: "Get the best time to harvest based on crop lifecycle & environmental data.", img: img2 },
    { title: "💧 Water Requirement", desc: "AI recommends irrigation amounts using soil, crop, and climate data.", img: img3 },
    { title: "🐛 Pest Detection", desc: "Upload pest images to identify threats using deep learning.", img: img4 },
    { title: "🧪 Pesticide Recommendation", desc: "Find effective pesticides tailored to the detected pest type.", img: img5 }
  ];

  return (
    <section className="features-section" id="features">
      <div className="features-container">
        <div className="features-header">
          <h2>Smart Farming Features</h2>
          <p>AI-powered tools to maximize your crop yield and efficiency</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="card-image">
                <img src={feature.img} alt={feature.title} />
                <div className="card-overlay"></div>
              </div>
              
              <div className="card-content">
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <button className="card-button">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
