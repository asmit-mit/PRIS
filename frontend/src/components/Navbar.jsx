import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sparkles, LayoutGrid, BarChart2, GitFork, Info, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', shortName: 'Home', path: '/', icon: Sparkles },
    { name: 'Products & Reviews', shortName: 'Products', path: '/products', icon: LayoutGrid },
    { name: 'Statistics', shortName: 'Stats', path: '/statistics', icon: BarChart2 },
    { name: 'Pipeline', shortName: 'Pipeline', path: '/pipeline', icon: GitFork },
    { name: 'About', shortName: 'About', path: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl transition-all">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img
            src="/logo.png"
            alt="PRIS logo"
            className="w-8 h-8 object-contain shrink-0"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-zinc-950 flex items-center gap-2 whitespace-nowrap">
              <span className="hidden sm:inline">Aspect-based Sentiment Intelligence System</span>
              <span className="sm:hidden">PRIS</span>
            </span>
          </div>
        </div>

        {/* Desktop & Tablet Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                  }`
                }
              >
                <Icon size={15} className="shrink-0" />
                <span className="hidden xl:inline">{item.name}</span>
                <span className="xl:hidden">{item.shortName}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown View */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
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
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
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