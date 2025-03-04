import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Instagram, Home } from 'lucide-react';
import logo from '../assets/pixelcut-export.png';

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 py-12 border-t border-gray-800">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <img src={logo} alt="BrickByBrick" className="h-8 w-8" />
              <span className="text-xl font-bold text-white">BrickByBrick</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Il vostro partner di fiducia nel settore immobiliare.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Vai a</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/properties" className="hover:text-lime-400 transition-colors">
                  Proprietà
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-lime-400 transition-colors">
                  Chi siamo
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-lime-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-lime-400" />
                <a className="hover:text-lime-400 transition-colors" href="tel:+393403524759">+39 340 352 4759</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-lime-400" />
                <a className="hover:text-lime-400 transition-colors" href="mailto:brickbybrickk2024@gmail.com">brickbybrickk2024@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Seguici su:</h4>
            <div className="flex space-x-4">
              <a target="_blank" href="https://www.facebook.com/profile.php?id=61572036686982" className="hover:text-lime-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a target="_blank" href="https://www.instagram.com/brick.by.brick_immobiliare?igsh=NWRlMm5lZnQ5NWJ1" className="hover:text-lime-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a target="_blank" href="https://www.immobiliare.it/agenzie-immobiliari/442331/brick-by-brick-san-carlo-canavese/" className="hover:text-lime-400 transition-colors">
                <Home className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 text-center border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} BrickByBrick. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}