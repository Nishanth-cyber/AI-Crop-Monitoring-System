import { useNavigate } from "react-router-dom";
import heroImage from "../assets/Img_1.jpeg";
import Feature from './Features';
export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      <div className="container">
        <h1 className="hero-title">
          AI-Powered Crop Intelligence System
        </h1>
        <p className="hero-description">
          Predict Harvest Dates, Water Needs, Pest Type, and Suggested Pesticides
        </p>
        <img 
          src={heroImage} 
          alt="Crop field" 
          className="hero-image"
        />
        <button 
          onClick={() => navigate("/predict")}
          className="btn btn-primary"
        >
          Get Started
        </button>
      </div>
      <Feature />
    </section>
    
  );
}