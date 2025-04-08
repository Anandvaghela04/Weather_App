require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");
const express = require('express');
const app = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      `http://api.openweathermap.org/data/2.5/weather?q=Ahmedabad&units=metric&appid=${process.env.APPID}`
    )
    .on("data", (chunk) => {
      try {
        const objdata = JSON.parse(chunk);
        if (objdata.cod !== 200) {
          console.error("API Error:", objdata.message);
          res.end("Error fetching weather data");
          return;
        }
        const arrData = [objdata];
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
        res.write(realTimeData);
      } catch (error) {
        console.error("JSON Parsing Error:", error);
        res.end("Server Error");
      }
    })
    
      .on("end", (err) => {
        if (err) console.log("Connection closed due to errors", err);
        res.end();
      });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("File not found");
  }
});

server.listen(process.env.PORT || 8000, "127.0.0.1", () => {
  console.log(`Server is running on http://127.0.0.1:${process.env.PORT || 8000}`);
});
