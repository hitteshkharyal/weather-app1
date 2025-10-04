import { useState, useRef, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import ForecastCard from "./ForecastCard";

const apiKey = "8f680d00bf28c069a5e4b53f0017ac81";

function Weather({ setIsDay }) {
  const { isDay } = useContext(ThemeContext);

  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  // isDay is now managed by App and passed via context
  const debounceRef = useRef();

  // Fetch weather + forecast
  async function getWeather(queryCity = city) {
    if (!queryCity) {
      setError("Please enter a city");
      setShowPopup(true);
      setWeatherData(null);
      setForecastData([]);
      return;
    }
    setLoading(true);
  setError("");
  setShowPopup(false);
  setWeatherData(null);
  setForecastData([]);
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${queryCity}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${queryCity}&appid=${apiKey}&units=metric`;
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(currentWeatherUrl),
        fetch(forecastUrl),
      ]);
      if (!weatherResponse.ok || !forecastResponse.ok) {
        setError("City not found. Please check the spelling and try again.");
        setShowPopup(true);
        setWeatherData(null);
        setForecastData([]);
        setLoading(false);
        return;
      }
      const weatherJson = await weatherResponse.json();
      const forecastJson = await forecastResponse.json();
  setWeatherData(weatherJson);
  // Set isDay based on city local time
  const localTime = new Date((weatherJson.dt + weatherJson.timezone) * 1000);
  const hours = localTime.getUTCHours();
  setIsDay(hours >= 6 && hours < 18);
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
      setError("Could not fetch weather data. Please try again.");
      setShowPopup(true);
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  }

  // Debounced input handler
  function handleInputChange(e) {
    const value = e.target.value;
    setCity(value);
  setError("");
  setWeatherData(null);
  setForecastData([]);
  setShowPopup(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) getWeather(value.trim());
    }, 700);
  }

  // Dynamic background and text color
  const bgClass = isDay
    ? "bg-gradient-to-br from-blue-200 via-yellow-100 to-blue-400"
    : "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-700";
  const textClass = isDay ? "text-gray-800" : "text-blue-100";

  // Geolocation handler
  async function handleGeoLocation() {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setShowPopup(true);
      return;
    }
    setLoading(true);
    setError("");
    setShowPopup(false);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      try {
        const [weatherResponse, forecastResponse] = await Promise.all([
          fetch(currentWeatherUrl),
          fetch(forecastUrl),
        ]);
        if (!weatherResponse.ok || !forecastResponse.ok) {
          setError("Could not fetch weather for your location.");
          setShowPopup(true);
          setWeatherData(null);
          setForecastData([]);
          setLoading(false);
          return;
        }
        const weatherJson = await weatherResponse.json();
        const forecastJson = await forecastResponse.json();
        setWeatherData(weatherJson);
        // Set isDay based on city local time
        const localTime = new Date((weatherJson.dt + weatherJson.timezone) * 1000);
        const hours = localTime.getUTCHours();
        setIsDay(hours >= 6 && hours < 18);
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
        setCity(weatherJson.name);
      } catch (err) {
        setError("Could not fetch weather for your location.");
        setShowPopup(true);
        setWeatherData(null);
        setForecastData([]);
      } finally {
        setLoading(false);
      }
    }, () => {
      setError("Unable to retrieve your location.");
      setShowPopup(true);
      setLoading(false);
    });
  }

  return (
    <div className={`flex items-center justify-center min-w-screen min-h-screen ${bgClass}`}>
      <div className="flex flex-row justify-center items-center gap-8 w-full max-w-6xl">
        {/* Main Weather Card */}
  <div className={`glass p-6 shadow-2xl fade-in ${textClass} flex flex-col justify-between min-h-0 max-h-[420px]`} style={{ minWidth: 0, maxWidth: 420, margin: "0 auto" }}>
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={city}
              onChange={handleInputChange}
              placeholder="Enter city name..."
              className={`w-full px-4 py-2 border ${isDay ? "border-blue-200 bg-white/80 text-gray-700" : "border-blue-900 bg-gray-800 text-blue-100"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
              autoFocus
            />
            <button
              className={`font-bold py-2 px-6 rounded-md shadow-md transition-all ${isDay ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-900 hover:bg-blue-800 text-blue-100"}`}
              onClick={() => getWeather()}
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </button>
            <button
              className={`font-bold py-2 px-4 rounded-md shadow-md transition-all ${isDay ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900" : "bg-yellow-300 hover:bg-yellow-400 text-gray-900"}`}
              onClick={handleGeoLocation}
              disabled={loading}
              title="Get weather for your current location"
            >
              📍
            </button>
          </div>
          {/* Popup Modal for Error */}
          {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className={`rounded-lg shadow-lg p-6 max-w-xs w-full text-center fade-in ${isDay ? "bg-white text-gray-800" : "bg-gray-900 text-blue-100"}`}>
                <div className="text-red-600 font-bold mb-2">{error}</div>
                <button
                  className={`mt-2 px-4 py-2 rounded shadow ${isDay ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-900 hover:bg-blue-800 text-blue-100"}`}
                  onClick={() => setShowPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {/* Current Weather */}
          {weatherData && (
            <div className="fade-in">
              <div className="text-center mb-6">
                <h2 className="text-4xl font-extrabold tracking-tight mb-1">{weatherData.name}</h2>
                <p className={`text-sm ${isDay ? "text-gray-600" : "text-blue-200"}`}>
                  {new Date((weatherData.dt + weatherData.timezone) * 1000).toUTCString().slice(0, 16)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-around my-6 gap-4">
                <div className="text-center">
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="weather-icon mx-auto"
                  />
                  <p className={`capitalize text-lg mt-1 ${isDay ? "text-gray-800" : "text-blue-100"}`}>{weatherData.weather[0].description}</p>
                </div>
                <div className="text-center">
                  <p className="text-lg">Temperature</p>
                  <p className="text-3xl font-bold">
                    {weatherData.main.temp.toFixed(1)}°C
                  </p>
                  <p className={`text-sm ${isDay ? "text-gray-500" : "text-blue-200"}`}>Feels like {weatherData.main.feels_like.toFixed(1)}°C</p>
                </div>
                <div className="text-center">
                  <p className="text-lg">Humidity</p>
                  <p className="text-3xl font-bold">
                    {weatherData.main.humidity}%
                  </p>
                  <p className={`text-sm ${isDay ? "text-gray-500" : "text-blue-200"}`}>Wind {weatherData.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Forecast Card on the right */}
        <div className="flex-shrink-0 flex justify-center items-center">
          <ForecastCard forecastData={forecastData} />
        </div>

      </div>
    </div>
  );
}

export default Weather;
