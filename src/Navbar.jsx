import React from "react";

import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function Navbar() {
  const { isDay } = useContext(ThemeContext);
  return (
    <nav className={`w-full ${isDay ? "bg-blue-500 bg-opacity-90 text-white" : "bg-gray-900 bg-opacity-90 text-blue-100"} py-4 px-6 shadow-lg glass flex items-center justify-between mb-6`}>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight">Weatherly</span>
        <span className={`ml-2 text-xs px-2 py-1 rounded ${isDay ? "bg-white/20 text-blue-100" : "bg-blue-900/40 text-blue-200"}`}>by hitteshkharyal</span>
      </div>
      <div className="hidden sm:block text-sm opacity-80">Simple, fast, and beautiful weather app</div>
    </nav>
  );
}

export default Navbar;
