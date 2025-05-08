// back/index.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    const weather = response.data;
    const result = {
      city: weather.name,
      temp: weather.main.temp,
      feels_like:weather.main.feels_like,
      condition: weather.weather[0].main,
      icon: weather.weather[0].icon,
      wind_speed: weather.wind.speed,
      sunrise: weather.sys.sunrise,
      sunset: weather.sys.sunset,
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
