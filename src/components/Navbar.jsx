import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Menu, X, Zap } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/report';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollTo = (href) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isDashboard
          ? 'glass border-b border-[rgba(14,165,233,0.15)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center shadow-glow-blue">
                <Shield size={18} className="text-white" />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight">DeepShield</span>
              <span className="text-[#0ea5e9] font-bold text-lg"> AI</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {!isDashboard && navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="nav-link"
              >
                {link.label}
              </button>
            ))}
            {isDashboard && (
              <Link to="/" className="nav-link">← Back to Home</Link>
            )}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!isDashboard ? (
              <>
                <Link to="/dashboard" className="btn-secondary text-sm px-4 py-2">
                  Sign In
                </Link>
                <Link to="/dashboard" className="btn-primary text-sm px-4 py-2">
                  <Zap size={14} />
                  Start Free Scan
                </Link>
              </>
            ) : (
              <Link to="/report" className="btn-primary text-sm px-4 py-2">
                <Zap size={14} />
                Generate Report
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors p-2"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-[rgba(14,165,233,0.1)] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {!isDashboard && navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="block w-full text-left nav-link py-3 border-b border-[rgba(14,165,233,0.08)]"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <Link to="/dashboard" className="btn-secondary text-sm text-center justify-center">
                  Sign In
                </Link>
                <Link to="/dashboard" className="btn-primary text-sm justify-center">
                  <Zap size={14} />
                  Start Free Scan
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
// mobile menu support
