import React, { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function ForecastCard({ forecastData }) {
  const { isDay } = useContext(ThemeContext);
  if (!forecastData || forecastData.length === 0) return null;
  return (
  <div className={`glass p-4 w-full max-w-2xl min-h-0 max-h-[420px] fade-in ${isDay ? "bg-white/80 text-gray-800" : "bg-gray-900/80 text-blue-100"}`} style={{ minWidth: 340 }}>
      <h3 className={`text-xl font-bold text-center mb-4 ${isDay ? "text-blue-700" : "text-blue-200"}`}>5-Day Forecast</h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {forecastData.map((day, index) => (
          <div key={index} className="text-center">
            <p className={`font-semibold mb-1 ${isDay ? "text-blue-800" : "text-blue-200"}`}>
              {new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}
            </p>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather.icon}.png`}
              alt={day.weather.description}
              className="weather-icon mx-auto"
            />
            <p className={`text-lg font-bold ${isDay ? "text-gray-800" : "text-blue-100"}`}>{day.avgTemp.toFixed(1)}°C</p>
            <p className={`capitalize text-xs ${isDay ? "text-gray-600" : "text-blue-200"}`}>{day.weather.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastCard;
