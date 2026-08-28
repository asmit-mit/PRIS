import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, LayoutGrid, BarChart2, GitFork, Info, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Home', shortName: 'Home', path: '/', icon: Sparkles },
    { name: 'Products & Reviews', shortName: 'Products', path: '/products', icon: LayoutGrid },
    { name: 'Statistics', shortName: 'Stats', path: '/statistics', icon: BarChart2 },
    { name: 'Pipeline', shortName: 'Pipeline', path: '/pipeline', icon: GitFork },
    { name: 'About', shortName: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-[#07090e]/80 backdrop-blur-xl transition-colors">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Responsive Wordmark */}
        <NavLink to="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <img
            src="/logo.png"
            alt="PRIS logo"
            className="w-8 h-8 object-contain shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2 whitespace-nowrap">
              {/* Full Title on Wide Desktops */}
              <span className="hidden xl:inline">Aspect-based Sentiment Intelligence System</span>
              {/* Intermediate Title on Half-Screen / Medium Windows */}
              <span className="hidden md:inline xl:hidden">ABSI System</span>
              {/* Compact Title on Mobile */}
              <span className="md:hidden">PRIS</span>
            </span>
          </div>
        </NavLink>

        {/* Right Section: Desktop Nav + Theme Toggle + Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop & Tablet Navigation */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-2.5 lg:px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-xs font-semibold'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60'
                    }`
                  }
                >
                  <Icon size={14} className="shrink-0" />
                  <span className="hidden lg:inline">{item.name}</span>
                  <span className="lg:hidden">{item.shortName}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/80 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-150 active:scale-95 shadow-2xs shrink-0"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
          </button>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#090d16] px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`
                }
              >
                <Icon size={17} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}