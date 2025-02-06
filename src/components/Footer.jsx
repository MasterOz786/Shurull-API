import { memo } from 'react';
import { Link } from 'react-router-dom';

// Memoized components
const FooterLink = memo(({ to, children }) => (
  <Link to={to} className="text-sm text-gray-400 hover:text-white transition-colors">
    {children}
  </Link>
));

const ExternalLink = memo(({ href, children }) => (
  <a href={href} className="text-sm text-gray-400 hover:text-white transition-colors group">
    {children}
  </a>
));

const FooterSection = memo(({ title, children }) => (
  <div>
    <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
      {title}
    </h4>
    <div className="flex flex-col space-y-2">
      {children}
    </div>
  </div>
));

const FooterBrand = memo(() => (
  <div className="col-span-2 md:col-span-1">
    <Link to="/" className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
      Shurulls API
    </Link>
    <p className="mt-2 text-sm text-gray-400 font-light leading-relaxed">
      Helping developers deploy and manage APIs with ease.
    </p>
  </div>
));

export default function Footer() {
  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8">
          <FooterBrand />

          <div className="flex flex-col sm:flex-row md:flex-col justify-between space-y-8 sm:space-y-0 md:space-y-8">
            <FooterSection title="Product">
              <FooterLink to="/deploy">Deploy</FooterLink>
              <FooterLink to="/about">About</FooterLink>
            </FooterSection>
          </div>

          <FooterSection title="Contact">
            <ExternalLink href="mailto:support@shurulls.pro">
              <span className="group-hover:text-purple-400">support@shurulls.pro</span>
            </ExternalLink>
            <span className="text-sm text-gray-400">Islamabad, PK</span>
          </FooterSection>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Shurull API. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <ExternalLink href="#">Privacy</ExternalLink>
              <ExternalLink href="#">Terms</ExternalLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}