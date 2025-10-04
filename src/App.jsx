import './App.css';
import Weather from './Weather';
import Navbar from './Navbar';
import Footer from './Footer';
import { ThemeContext } from './ThemeContext';
import { useState } from 'react';

function App() {
  const [isDay, setIsDay] = useState(true);

  // Weather will call setIsDay when city is searched
  return (
    <ThemeContext.Provider value={{ isDay, setIsDay }}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-2 flex items-center justify-center">
          <Weather setIsDay={setIsDay} />
        </main>
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
