import React, { useState, useEffect } from "react";
import img6 from "../../assets/Img_6.jpeg";

export default function CropForm() {
  const [loading, setLoading] = useState(false);
  const [climate, setClimate] = useState({
    temperature: "",
    humidity: "",
    season: "",
    date: "",
    time: "",
  });
  const [climateLoading, setClimateLoading] = useState(true);

  // Determine season from month
  const getSeason = (month) => {
    if ([12, 1, 2].includes(month)) return "winter";
    if ([3, 4, 5].includes(month)) return "spring";
    if ([6, 7, 8].includes(month)) return "summer";
    return "autumn";
  };

  // Auto-fetch climate + auto-fill season/date
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("❌ Geolocation not supported");
      setClimateLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("📍 Got location:", latitude, longitude);

        try {
          const res = await fetch(
            `http://localhost:5001/climate/get_climate?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          console.log("🌡 Climate API response:", data);

          // Get season + date/time
          const now = new Date();
          const season = getSeason(now.getMonth() + 1);
          const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
          const time = now.toLocaleTimeString();

          setClimate({
            temperature: data.temperature || "",
            humidity: data.humidity || "",
            season,
            date: today,
            time,
          });
        } catch (err) {
          console.error("❌ Fetch error:", err);
        } finally {
          setClimateLoading(false);
        }
      },
      (err) => {
        console.error("❌ Geolocation error:", err.message);
        setClimateLoading(false);
      }
    );
  }, []);

  // Submit form
  async function predictCrop(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const payload = {
      crop: formData.get("crop"),
      season: climate.season,
      sowing_date: climate.date,
      ph: parseFloat(formData.get("ph")),
      avg_water: parseFloat(formData.get("avg_water")),
      temperature: climate.temperature,
      humidity: climate.humidity,
    };

    try {
      const res = await fetch("http://localhost:8000/predict_crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(`❌ Error: ${error.detail}`);
      } else {
        const data = await res.json();
        alert(
          `✅ Water Needed: ${data.water_required} L/ha\n📅 Days until Harvest: ${data.days_until_harvest}`
        );
      }
    } catch (err) {
      console.error("❌ Prediction error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card split-form">
      <div className="form-image">
        <img src={img6} alt="Form Illustration" />
      </div>

      <div className="form-content">
        <h3>🌱 Harvest & Water Intelligence</h3>

        {climateLoading ? (
          <p>⏳ Waiting for location & climate data...</p>
        ) : (
          <form onSubmit={predictCrop}>
            <input name="crop" type="text" placeholder="Crop Name" required />

            {/* Auto-filled fields */}
            <input type="text" value={climate.season} readOnly />
            <input type="date" value={climate.date} readOnly />
            <input type="text" value={climate.time} readOnly />

            <input
              type="text"
              value={
                climate.temperature !== ""
                  ? `${climate.temperature} °C`
                  : "No data"
              }
              readOnly
            />
            <input
              type="text"
              value={
                climate.humidity !== ""
                  ? `${climate.humidity} %`
                  : "No data"
              }
              readOnly
            />

            <input
              name="ph"
              type="number"
              step="any"
              placeholder="Soil pH"
              required
            />
            <input
              name="avg_water"
              type="number"
              step="any"
              placeholder="Avg Water (L/ha)"
              required
            />

            <button type="submit" disabled={loading || climateLoading}>
              {loading ? "Predicting..." : "🔍 Predict Now"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
