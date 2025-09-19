import React from "react";
import "../styles/features.css"; // We'll create this CSS file

// Note: You'll need to import your images as shown in your original code
// I'm using placeholder images for demonstration purposes
const img2 = "https://images.unsplash.com/photo-1592492159418-2fda4a47d2a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
const img3 = "https://images.unsplash.com/photo-1595248842562-e0f2980ed6d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
const img4 = "https://images.unsplash.com/photo-1573767291321-c9afc944a56a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
const img5 = "https://images.unsplash.com/photo-1624969861096-51f5d7c727c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

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
