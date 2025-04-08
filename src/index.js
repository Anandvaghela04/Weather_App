require('dotenv').config();
const fs = require("fs");
const express = require("express");
const requests = require("requests");

const app = express();
const PORT = process.env.PORT || 8000;

// Load HTML file
const homeFile = fs.readFileSync("home.html", "utf-8");

// Replace placeholders with weather data
const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};

// Define root route
app.get("/", (req, res) => {
  requests(
    `http://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&units=metric&appid=${process.env.APPID}`
  )
    .on("data", (chunk) => {
      try {
        const objdata = JSON.parse(chunk);
        if (objdata.cod !== 200) {
          console.error("API Error:", objdata.message);
          res.status(500).send("Error fetching weather data");
          return;
        }
        const arrData = [objdata];
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.send(realTimeData);
      } catch (error) {
        console.error("JSON Parsing Error:", error);
        res.status(500).send("Server Error");
      }
    })
    .on("end", (err) => {
      if (err) console.error("Connection closed due to errors", err);
    });
});

// Start the server (no hardcoded IP!)
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
