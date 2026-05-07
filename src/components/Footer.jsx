import { Link } from 'react-router-dom';
import { Shield, Globe, Share2, Code2, Mail } from 'lucide-react';

const Footer = () => {
  const links = {
    Product: ['Features', 'Dashboard', 'Reports', 'API Docs', 'Pricing'],
    Company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Compliance'],
    Support: ['Documentation', 'Help Center', 'Status', 'Contact', 'Community'],
  };

  return (
    <footer className="relative bg-dark-navy border-t border-[rgba(14,165,233,0.1)] overflow-hidden">
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top CTA banner */}
        <div className="glass-card rounded-2xl p-8 mb-14 text-center relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(139,92,246,0.05))' }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl lg:text-3xl font-black text-white mb-3">
              Start Protecting Your Identity{' '}
              <span className="text-gradient">Today</span>
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
              Join 50,000+ individuals who trust DeepShield AI to guard their 
              digital identity against AI manipulation.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/dashboard" id="footer-start-free" className="btn-primary px-6 py-3">
                Start Free Scan
              </Link>
              <Link to="/dashboard" id="footer-enterprise" className="btn-secondary px-6 py-3">
                Enterprise Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center shadow-glow-blue">
                <Shield size={18} className="text-white" />
              </div>
              <div>
                <span className="text-white font-bold">DeepShield</span>
                <span className="text-[#0ea5e9] font-bold"> AI</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-5 max-w-[200px]">
              AI-powered deepfake detection and facial similarity search platform protecting digital identities worldwide.
            </p>
            <div className="flex gap-3">
              {[Globe, Share2, Code2, Mail].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg glass border border-[rgba(14,165,233,0.15)] flex items-center justify-center hover:border-[rgba(14,165,233,0.4)] hover:bg-[rgba(14,165,233,0.1)] transition-all"
                >
                  <Icon size={14} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-xs text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[rgba(14,165,233,0.08)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-600">
            © 2025 DeepShield AI Inc. All rights reserved. Built with AI for the protection of human dignity.
          </p>
          <div className="flex flex-wrap gap-4 text-[11px] text-slate-600">
            {['SOC 2 Type II', 'ISO 27001', 'GDPR Compliant', 'CCPA Compliant'].map((badge) => (
              <span key={badge} className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#0ea5e9]" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
