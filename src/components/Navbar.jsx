import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-gray-900/95 backdrop-blur-lg fixed w-full z-50 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            aria-label="Home"
          >
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Shurulls
            </span>
          </Link>
          
          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/deploy">Deploy</NavLink>
            <NavLink to="/about">About</NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Main menu"
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
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
            className="md:hidden overflow-hidden bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50"
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

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className="relative group"
    >
      <span className={`text-sm font-medium transition-colors ${
        isActive ? 'text-white' : 'text-gray-300 hover:text-white'
      }`}>
        {children}
      </span>
      <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transform origin-left transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`} />
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
        isActive 
          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}