import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import Pipeline from './pages/Pipeline';
import About from './pages/About';
import Statistics from './pages/Statistics';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-[#07090e] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}