import React from "react";

import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function Footer() {
  const { isDay } = useContext(ThemeContext);
  return (
    <footer className={`w-full ${isDay ? "bg-blue-700 bg-opacity-90 text-white" : "bg-gray-900 bg-opacity-90 text-blue-100"} py-4 px-6 mt-10 glass text-center text-sm`}>
      <div>
        Weatherly &copy; {new Date().getFullYear()} &mdash; Powered by OpenWeatherMap API.<br/>
        Built with React, Vite, and Tailwind CSS.
      </div>
      <div className="mt-2 opacity-80">
        <a href="https://github.com/hitteshkharyal/weather-app1" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200">Source Code</a>
      </div>
    </footer>
  );
}

export default Footer;
