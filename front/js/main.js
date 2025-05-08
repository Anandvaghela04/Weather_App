const BASE_URL = "https://weather-app-edi3.onrender.com"; 

document.addEventListener("DOMContentLoaded", () => {
  const getWeatherBtn = document.getElementById("getWeatherBtn");
  const weatherResult = document.getElementById("weatherResult");

  // Hide weather section initially
  weatherResult.style.display = "none";

  getWeatherBtn.addEventListener("click", async () => {
    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
      weatherResult.style.display = "none";
      return alert("Please enter a city name");
    }

    getWeatherBtn.innerText = "Loading...";

    try {
      const res = await fetch(`${BASE_URL}/weather?city=${city}`);
      const data = await res.json();

      document.getElementById("temperature").innerText = data.temp;
      document.getElementById("condition").innerText = data.condition;
      document.getElementById("weatherIcon").src = `http://openweathermap.org/img/wn/${data.icon}@2x.png`;
      document.getElementById("feelsLike").innerText = data.feels_like;
      document.getElementById("windSpeed").innerText = data.wind_speed;
      document.getElementById("summaryCity").innerText = data.city;

      const toTime = (ts) =>
        new Date(ts * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      document.getElementById("sunrise").innerText = toTime(data.sunrise);
      document.getElementById("sunset").innerText = toTime(data.sunset);

      // ✅ Show result now that everything is loaded
      weatherResult.style.display = "block";
    } catch (err) {
      alert("Error fetching weather data");
      weatherResult.style.display = "none";
      console.error(err);
    } finally {
      getWeatherBtn.innerText = "Get Weather";
    }
  });

  // Optional: Hide weather if input is cleared manually
  document.getElementById("cityInput").addEventListener("input", () => {
    if (!document.getElementById("cityInput").value.trim()) {
      weatherResult.style.display = "none";
    }
  });
});
