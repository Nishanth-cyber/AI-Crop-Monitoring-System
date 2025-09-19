import React, { useState } from "react";
import img6 from "../../assets/Img_6.jpeg";

export default function CropForm() {
  const [loading, setLoading] = useState(false);

  async function predictCrop(e) {
    e.preventDefault();
    setLoading(true);

    const crop = e.target.crop.value;
    const season = e.target.season.value;
    const temperature = parseFloat(e.target.temperature.value);
    const humidity = parseFloat(e.target.humidity.value);
    const ph = parseFloat(e.target.ph.value);
    const avg_water = parseFloat(e.target.avg_water.value);
    const sowing_date = e.target.sowing_date.value;

    const response = await fetch("http://localhost:8000/predict_crop", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ crop, season, temperature, humidity, ph, avg_water, sowing_date }),
});

if (!response.ok) {
  const error = await response.json();
  alert(`❌ Error: ${error.detail}`);
  setLoading(false);
  return;
}

const data = await response.json();
alert(`✅ Water Needed: ${data.water_required} L/ha\n📅 Harvest Date: ${data.harvest_date}`);

    setLoading(false);
  }

  return (
    <div className="card split-form">
      <div className="form-image">
        <img src={img6} alt="Form Illustration" />
      </div>
      <div className="form-content">
        <h3> Harvest & Water Intelligence</h3>
        <form onSubmit={predictCrop}>
          <input name="crop" type="text" placeholder=" Crop Name" required />
          <input name="sowing_date" type="date" required />
          <select name="season" required>
            <option value="winter">winter</option>
            <option value="spring">spring</option>
            <option value="summer">summer</option>
          </select>
          <input name="temperature" type="number" step="any" placeholder=" Temperature (°C)" required />
          <input name="humidity" type="number" step="any" placeholder=" Humidity (%)" required />
          <input name="ph" type="number" step="any" placeholder=" Soil pH" required />
          <input name="avg_water" type="number" step="any" placeholder=" Avg Water (L/ha)" required />
          <button type="submit" disabled={loading}>{loading ? " Predicting..." : "🔍 Predict Now"}</button>
        </form>
      </div>
    </div>
  );
}
