const express = require("express");
const fetch = require("node-fetch"); // works with v2

const router = express.Router();

router.get("/get_climate", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing latitude or longitude" });
    }
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OpenWeather API key" });
    }

    console.log("🌍 Fetching weather for:", lat, lon);

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (!data.main) {
      console.error("⚠️ OpenWeather returned invalid data:", data);
      return res.status(500).json({ error: "Invalid API response", details: data });
    }

    res.json({
      temperature: data.main.temp,
      humidity: data.main.humidity,
      season: getSeason(new Date().getMonth() + 1),
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString(),
    });
  } catch (err) {
    console.error("❌ Climate API error:", err);
    res.status(500).json({ error: "Failed to fetch climate data" });
  }
});

function getSeason(month) {
  if ([12, 1, 2].includes(month)) return "winter";
  if ([3, 4, 5].includes(month)) return "spring";
  if ([6, 7, 8].includes(month)) return "summer";
  return "rainy";
}

module.exports = router;
