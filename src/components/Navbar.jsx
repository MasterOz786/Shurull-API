import { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Memoized toggle handler
  const toggleMenu = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Close menu on route change
  if (isOpen && location.pathname) {
    setIsOpen(false);
  }

  return (
    <nav className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center"
            aria-label="Home"
          >
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Shurulls
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex items-center space-x-1 bg-gray-800/50 rounded-lg backdrop-blur-sm">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/deploy">Deploy</NavLink>
              <NavLink to="/about">About</NavLink>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Main menu"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-sm"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/">Home</MobileNavLink>
              <MobileNavLink to="/deploy">Deploy</MobileNavLink>
              <MobileNavLink to="/about">About</MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive
          ? 'text-white bg-gray-700'
          : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
      }`}
    >
      {children}
    </Link>
  );
}

const MobileNavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
        isActive 
          ? 'bg-gray-800 text-white' 
          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}