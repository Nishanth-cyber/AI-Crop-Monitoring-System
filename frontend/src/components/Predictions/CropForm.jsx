import React, { useState, useEffect } from "react";
import img6 from "../../assets/Img_6.jpeg";

export default function CropForm() {
  const [loading, setLoading] = useState(false);
  const [climate, setClimate] = useState({ temperature: "", humidity: "" });

  // Auto-fetch climate data on page load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        const res = await fetch(`http://localhost:8000/get_climate?lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        setClimate({ temperature: data.temperature, humidity: data.humidity });
      } catch (err) {
        console.error("❌ Failed to fetch climate data", err);
      }
    });
  }, []);

  async function predictCrop(e) {
    e.preventDefault();
    setLoading(true);

    const crop = e.target.crop.value;
    const season = e.target.season.value;
    const ph = parseFloat(e.target.ph.value);
    const avg_water = parseFloat(e.target.avg_water.value);
    const sowing_date = e.target.sowing_date.value;

    const response = await fetch("http://localhost:8000/predict_crop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        crop,
        season,
        temperature: climate.temperature,
        humidity: climate.humidity,
        ph,
        avg_water,
        sowing_date
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      alert(`❌ Error: ${error.detail}`);
      setLoading(false);
      return;
    }

    const data = await response.json();
    alert(`✅ Water Needed: ${data.water_required} L/ha\n📅 Days until Harvest: ${data.days_until_harvest}`);
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
          
          {/* Auto-filled fields */}
          <input
            name="temperature"
            type="number"
            step="any"
            value={climate.temperature}
            placeholder=" Temperature (°C)"
            readOnly
          />
          <input
            name="humidity"
            type="number"
            step="any"
            value={climate.humidity}
            placeholder=" Humidity (%)"
            readOnly
          />

          <input name="ph" type="number" step="any" placeholder=" Soil pH" required />
          <input name="avg_water" type="number" step="any" placeholder=" Avg Water (L/ha)" required />

          <button type="submit" disabled={loading}>
            {loading ? " Predicting..." : "🔍 Predict Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
