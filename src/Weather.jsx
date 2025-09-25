import { useState } from "react";

const apiKey = "8f680d00bf28c069a5e4b53f0017ac81";

function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);

  // Fetch weather + forecast
  async function getWeather() {
    if (!city) {
      alert("Please enter a city");
      return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl),
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const weatherJson = await weatherResponse.json();
      const forecastJson = await forecastResponse.json();

      setWeatherData(weatherJson);

      // Process forecast into daily averages
      const dailyForecasts = {};
      forecastJson.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toISOString().split("T")[0];
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            temps: [],
            weather: item.weather[0],
          };
        }
        dailyForecasts[date].temps.push(item.main.temp);
      });

      const forecastArr = Object.keys(dailyForecasts).map((date) => {
        const avgTemp =
          dailyForecasts[date].temps.reduce((a, b) => a + b, 0) /
          dailyForecasts[date].temps.length;
        return {
          date,
          avgTemp,
          weather: dailyForecasts[date].weather,
        };
      });

      setForecastData(forecastArr);
    } catch (err) {
      console.error(err);
      alert("Could not fetch weather data. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center min-w-screen min-h-screen bg-gradient-to-br from-blue-200 to-blue-400">
      <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-4xl w-full text-gray-800">
        {/* Search Bar */}
        <div className="flex justify-between mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md"
            onClick={getWeather}
          >
            Search
          </button>
        </div>

        {/* Current Weather */}
        {weatherData && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold">{weatherData.name}</h2>
              <p className="text-gray-600">
                {new Date(
                  (weatherData.dt + weatherData.timezone) * 1000
                ).toUTCString().slice(0, 16)}
              </p>
            </div>

            <div className="flex items-center justify-around my-6">
              <div className="text-center">
                <p className="text-lg">Temperature</p>
                <p className="text-3xl font-bold">
                  {weatherData.main.temp.toFixed(1)}°C
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg">Humidity</p>
                <p className="text-3xl font-bold">
                  {weatherData.main.humidity}%
                </p>
              </div>
            </div>
          </>
        )}

        {/* Forecast */}
        {forecastData.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-center mb-4">
              5-Day Forecast
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {forecastData.map((day, index) => (
                <div key={index} className="text-center">
                  <p className="font-semibold">
                    {new Date(day.date).toString().slice(0, 3)}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather.icon}.png`}
                    alt={day.weather.description}
                    className="mx-auto"
                  />
                  <p>{day.avgTemp.toFixed(1)}°C</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
