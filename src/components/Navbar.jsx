import React from 'react';
import { NavLink } from 'react-router-dom';

// A simple SVG dumbbell icon component
const DumbbellIcon = () => (
  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4" />
  </svg>
);

const Navbar = () => {
  // Array of navigation links with paths for the router
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Daily Challenges', path: '/challenges' },
    { name: 'Generate Plan', path: '/generator' },
  ];

  return (
    <nav className="bg-slate-900/80 backdrop-blur-sm shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side: Logo and App Name */}
          <div className="flex items-center">
            <DumbbellIcon />
            <span className="font-bold text-xl text-blue-400 ml-2">Muscle & Hustle</span>
          </div>

          {/* Right side: Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white' // Active link style
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white' // Inactive link style
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;


