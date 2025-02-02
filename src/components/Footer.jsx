import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Shurulls API
            </h3>
            <p className="mt-4 text-gray-400">
              Empowering developers with seamless API deployment and management solutions.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/deploy" className="text-gray-400 hover:text-white transition-colors">
                  Deploy
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@shurulls.pro</li>
              <li>Phone: +92 3266509063</li>
              <li>Location: Islamabad, PK</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Shurull API. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}