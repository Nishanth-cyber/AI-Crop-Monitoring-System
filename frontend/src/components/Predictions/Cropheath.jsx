import React, { useState, useRef } from "react";
import img7 from "../../assets/Img_7.jpeg";

export default function CropHealth() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputVideo, setInputVideo] = useState(null);
  const [outputVideo, setOutputVideo] = useState(null);
  const videoRef = useRef(null);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInputVideo(URL.createObjectURL(file));
      setResult(null);
      setOutputVideo(null);
    }
  };

  async function analyzeHealth(e) {
    e.preventDefault();
    const file = e.target.crop_video.files[0];
    if (!file) return alert("Please upload a crop video.");

    setLoading(true);
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("http://localhost:8000/analyze_crop_health", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
      setOutputVideo(data.processed_video_url); // Assuming backend returns processed video URL
    } catch (error) {
      alert("Error analyzing crop health");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="crop-health-container">
      <div className="health-header card">
        <div className="header-content">
          <h2>Crop Health Video Analysis</h2>
          <p>Upload a video of your crop to analyze its health and nutrient status</p>
        </div>
        <div className="header-image">
          <img src={img7} alt="Crop Health Analysis" />
        </div>
      </div>

      <div className="analysis-section">
        <div className="upload-card card">
          <h3>Upload Crop Video</h3>
          <form onSubmit={analyzeHealth}>
            <div className="form-group">
              <label htmlFor="crop_video">Select Video</label>
              <input
                type="file"
                id="crop_video"
                name="crop_video"
                accept="video/*"
                onChange={handleVideoChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Health'}
            </button>
          </form>
        </div>

        {inputVideo && (
          <div className="preview-card card">
            <h3>Input Video</h3>
            <video 
              ref={videoRef}
              src={inputVideo}
              controls
              className="preview-video"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>

      {outputVideo && (
        <div className="output-section card">
          <h3>Processed Video</h3>
          <video 
            src={outputVideo}
            controls
            className="output-video"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {result && (
        <div className="results-card card">
          <h3>Analysis Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <h4>Overall Health Status</h4>
              <p>{result.health_status}</p>
            </div>
            <div className="result-item">
              <h4>Health Score</h4>
              <p>{result.health_score}%</p>
            </div>
            <div className="result-item">
              <h4>Issues Detected</h4>
              <ul>
                {result.issues?.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
            <div className="result-item">
              <h4>Recommendations</h4>
              <p>{result.recommendations}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}