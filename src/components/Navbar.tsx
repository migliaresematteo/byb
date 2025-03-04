import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Phone, Menu, X, Users, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/pixelcut-export.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: 'home', path: '/', icon: Home, label: 'Home' },
    { id: 'properties', path: '/properties', icon: Building, label: 'Proprietà' },
    { id: 'about', path: '/about', icon: Users, label: 'Chi siamo' },
    { id: 'contact', path: '/#contact', icon: Phone, label: 'Contatti' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const footer = document.getElementById('contact');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg fixed w-full z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="BrickByBrick" className="h-8 w-8" />
            <span className="text-xl font-bold">BrickByBrick</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={item.id === 'contact' ? handleContactClick : undefined}
                className={`flex items-center space-x-1 transition-colors ${
                  isActive(item.path)
                    ? 'text-lime-500 font-semibold'
                    : 'text-gray-600 hover:text-lime-500'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-lime-500 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-4 py-2 transition-colors ${
                      isActive(item.path)
                        ? 'text-lime-500 font-semibold bg-gray-50'
                        : 'text-gray-600 hover:text-lime-500 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}