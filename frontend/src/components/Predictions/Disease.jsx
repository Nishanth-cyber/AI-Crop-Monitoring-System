import React, { useState } from "react";
import img7 from "../../assets/Img_7.jpeg";

export default function PestForm() {
  const [result, setResult] = useState(null);

  async function predictPest(e) {
    e.preventDefault();
    const file = e.target.pest_image.files[0];
    if (!file) return alert("Upload a pest image.");

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("http://localhost:8000/predict_pest", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setResult(data);
  }

  return (
    <div className="card split-form">
      <div className="form-image">
        <img src={img7} alt="Pest Detection" />
      </div>
      <div className="form-content">
        <h3> Pest Detection &  Pesticide Recommendation</h3>
        <form onSubmit={predictPest}>
          <input type="file" name="pest_image" accept="image/*" required />
          <button type="submit"> Detect Pest & Recommend</button>
        </form>
        {result && (
          <div className="pest-result">
            <p><strong>Pest:</strong> {result.pest}</p>
            <p><strong>Pesticide:</strong> {result.pesticide}</p>
          </div>
        )}
      </div>
    </div>
  );
}
