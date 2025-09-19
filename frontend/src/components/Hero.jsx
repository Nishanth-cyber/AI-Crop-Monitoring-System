import { useNavigate } from "react-router-dom";
import heroImage from "../assets/Img_1.jpeg";
import Feature from './Features';
import "../styles/hero.css"; // We'll create this CSS file

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            AI-Powered Crop Intelligence System
          </h1>
          <p className="hero-description">
            Predict Harvest Dates, Water Needs, Pest Type, and Suggested Pesticides with our advanced AI technology. Maximize your yield and minimize resources.
          </p>
          <div className="hero-cta">
            <button 
              onClick={() => navigate("/predict")}
              className="btn btn-primary hero-btn"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate("/learn-more")}
              className="btn btn-secondary hero-btn"
            >
              Learn More
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Accuracy</span>
            </div>
            <div className="stat">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Farmers</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <img 
            src={heroImage} 
            alt="Crop field with advanced farming technology" 
            className="hero-image"
          />
          <div className="image-overlay"></div>
        </div>
      </div>
      <Feature />
    </section>
  );
}