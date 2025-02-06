import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8">
          {/* Brand and Description */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Shurulls API
            </Link>
            <p className="mt-2 text-sm text-gray-400 font-light leading-relaxed">
              Helping developers deploy and manage APIs with ease.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row md:flex-col justify-between space-y-8 sm:space-y-0 md:space-y-8">
            <div>
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Product
              </h4>
              <div className="flex flex-col space-y-2">
                <Link to="/deploy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Deploy
                </Link>
                <Link to="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
              Contact
            </h4>
            <div className="flex flex-col space-y-2">
              <a href="mailto:support@shurulls.pro" className="text-sm text-gray-400 hover:text-white transition-colors group">
                <span className="group-hover:text-purple-400">support@shurulls.pro</span>
              </a>
              <span className="text-sm text-gray-400">Islamabad, PK</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-4 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Shurull API. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}