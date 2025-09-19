import React, { useState } from "react";
import img14 from "../../assets/Img_14.jpeg";
import "./disease.css"; // We'll create this CSS file

export default function DiseaseDetection() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputImage, setInputImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputImage(file);
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  async function predictDisease(e) {
    e.preventDefault();
    if (!inputImage) return alert("Upload a crop disease image.");
    
    setLoading(true);

    const formData = new FormData();
    formData.append("image", inputImage);

    try {
      const response = await fetch("http://localhost:8000/disease-prediction", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert("Error detecting disease");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="disease-detection-container">
      <div className="disease-form-card">
        <div className="form-image-section">
          <img src={img14} alt="Disease Detection" className="form-image" />
          <div className="image-overlay">
            <h2>🌱 Crop Disease Detection</h2>
            <p>Identify diseases and get detailed explanations</p>
          </div>
        </div>
        
        <div className="form-content-section">
          <div className="form-header">
            <h3>Crop Disease Detection & Explanation</h3>
            <p>Upload an image of your crop to detect diseases and get detailed information</p>
          </div>
          
          <form onSubmit={predictDisease} className="disease-form">
            <div className="file-upload-area">
              <label htmlFor="disease_image" className="file-upload-label">
                <div className="upload-icon">🌿</div>
                <div className="upload-text">
                  {selectedImage ? "Image Selected" : "Choose a crop image"}
                </div>
                <input 
                  type="file" 
                  id="disease_image" 
                  name="disease_image" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  required 
                  className="file-input"
                />
              </label>
            </div>
            
            {selectedImage && (
              <div className="image-preview-card">
                <h4>Image Preview</h4>
                <div className="image-preview">
                  <img src={selectedImage} alt="Crop preview" />
                </div>
              </div>
            )}
            
            <button 
              type="submit" 
              className="detect-button"
              disabled={loading || !selectedImage}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Detecting...
                </>
              ) : (
                <>
                  <span className="button-icon">🔍</span>
                  Detect Disease & Explain
                </>
              )}
            </button>
          </form>
          
          {result && (
            <div className="disease-result">
              <h4>Detection Results</h4>
              <div className="result-content">
                <div className="disease-info">
                  <div className="info-icon">🌡️</div>
                  <h5>Disease Identified</h5>
                  <p className="disease-name">{result.disease}</p>
                </div>
                <div className="explanation-info">
                  <div className="info-icon">📝</div>
                  <h5>Explanation</h5>
                  <p className="disease-explanation">{result.explain}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

