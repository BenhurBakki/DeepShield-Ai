import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Shield, Scan, ArrowRight, Zap, Eye, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

// Animated floating card
const FloatingCard = ({ children, className, delay = 0, style, theme }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    style={style}
    className={`${theme === 'dark' ? 'glass-card' : 'bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100'} rounded-2xl p-4 absolute ${className}`}
  >
    {children}
  </motion.div>
);

// Animated floating card removed ParticleNetwork definition

const HeroSection = () => {
  const { theme } = useTheme();

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden transition-colors duration-500 ${theme === 'dark' ? 'bg-deep-black' : 'bg-[#f8fafc]'}`}>
      {/* Background */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-radial from-[rgba(14,165,233,0.08)] via-transparent to-transparent" style={{ top: '10%', left: '20%', width: '60%', height: '60%' }} />
        <div className="absolute inset-0 bg-gradient-radial from-[rgba(139,92,246,0.06)] via-transparent to-transparent" style={{ bottom: '0', right: '0', width: '50%', height: '50%' }} />
      </div>
      
      <div className={`absolute inset-0 transition-opacity duration-700 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[#f8fafc]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_70%)]" />
        {/* Large watermark shield */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
          <Shield size={600} />
        </div>
      </div>

      {/* Particle network removed as requested */}

      {/* Scanning line effect */}
      <div
        className="absolute left-0 right-0 h-px opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, #0ea5e9, #06b6d4, transparent)',
          boxShadow: '0 0 15px rgba(14,165,233,0.5)',
          animation: 'scanLine 4s linear infinite',
          zIndex: 2,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div className="text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 border border-[rgba(14,165,233,0.2)]"
            >
              <div className="glow-dot" style={{ width: 6, height: 6 }} />
              <span className="text-xs font-medium text-[#0ea5e9] tracking-widest uppercase">
                AI-Powered Identity Protection
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Protect Your</span>
              <br />
              <span className="text-[#0ea5e9]">Identity From</span>
              <br />
              <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>AI Manipulation</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className={`text-lg leading-relaxed mb-10 max-w-xl ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
            >
              DeepShield AI scans millions of datasets to detect deepfakes, facial misuse, 
              and AI-generated media — delivering real-time threat intelligence to guard 
              your digital identity.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link to="/dashboard" id="hero-start-scan" className="btn-primary text-base px-7 py-3.5">
                <Scan size={18} />
                Start Scan — Free
              </Link>
              <button
                onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}
                id="hero-explore-features"
                className="btn-secondary text-base px-7 py-3.5"
              >
                Explore Features
                <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-6"
            >
              {[
                { value: '99.7%', label: 'Detection Accuracy' },
                { value: '2.1B+', label: 'Images Scanned' },
                { value: '<0.8s', label: 'Analysis Time' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gradient-blue">{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Visual */}
          <div className="relative h-[520px] hidden lg:block">
            {/* Central shield animation - DYNAMIC AND FLOATING */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -15, 0] // Floating animation
              }}
              transition={{ 
                opacity: { duration: 1, delay: 0.4 },
                scale: { duration: 1, delay: 0.4 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" } // Infinite float
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              {/* Square outline (brackets) - Slightly smaller to avoid overlap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 pointer-events-none">
                {[
                  { top: 0, left: 0, borderTop: '2px solid rgba(14,165,233,0.4)', borderLeft: '2px solid rgba(14,165,233,0.4)' },
                  { top: 0, right: 0, borderTop: '2px solid rgba(14,165,233,0.4)', borderRight: '2px solid rgba(14,165,233,0.4)' },
                  { bottom: 0, left: 0, borderBottom: '2px solid rgba(14,165,233,0.4)', borderLeft: '2px solid rgba(14,165,233,0.4)' },
                  { bottom: 0, right: 0, borderBottom: '2px solid rgba(14,165,233,0.4)', borderRight: '2px solid rgba(14,165,233,0.4)' },
                ].map((style, i) => (
                  <div key={i} className="absolute w-7 h-7" style={style} />
                ))}
              </div>

              {/* Outer rings - NO DOTS */}
              {[170, 210, 250].map((size, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-[rgba(14,165,233,0.12)]"
                  style={{
                    width: size,
                    height: size,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: `spin ${8 + i * 4}s linear infinite ${i % 2 === 1 ? 'reverse' : ''}`,
                  }}
                />
              ))}

              {/* Center shield - Slightly smaller */}
              <div
                className="relative"
                style={{ width: 100, height: 100 }}
              >
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center shadow-glow-blue">
                  <Shield size={48} className="text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] blur-2xl opacity-30" />
              </div>
            </motion.div>

            {/* Floating data cards */}
            <FloatingCard
              delay={0.8}
              className="top-12 left-0 w-52"
              theme={theme}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[rgba(14,165,233,0.15)] flex items-center justify-center">
                  <Eye size={14} className="text-[#0ea5e9]" />
                </div>
                <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>Similarity Score</span>
              </div>
              <div className="text-2xl font-black text-[#0ea5e9] mb-1">94.3%</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '94.3%' }} />
              </div>
              <div className="text-[10px] text-slate-500 mt-1.5">High facial match detected</div>
            </FloatingCard>

            <FloatingCard
              delay={1.0}
              className="top-12 right-0 w-52"
              theme={theme}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
                  <AlertTriangle size={14} className="text-red-400" />
                </div>
                <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>Deepfake Probability</span>
              </div>
              <div className="text-2xl font-black text-red-400 mb-1">87.1%</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '87.1%', background: 'linear-gradient(90deg, #ef4444, #f97316)' }} />
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded threat-critical">CRITICAL</span>
              </div>
            </FloatingCard>

            <FloatingCard
              delay={1.2}
              className="bottom-20 left-4 w-48"
              theme={theme}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                  <CheckCircle size={14} className="text-emerald-400" />
                </div>
                <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>AI Analysis</span>
              </div>
              <div className="space-y-1.5">
                {['Face Detection', 'Embedding Gen.', 'Dataset Scan'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                    <span className={`text-[11px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{step}</span>
                    <span className="ml-auto text-[10px] text-emerald-400">✓</span>
                  </div>
                ))}
              </div>
            </FloatingCard>

            <FloatingCard
              delay={1.4}
              className="bottom-16 right-2 w-52"
              theme={theme}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
                  <TrendingUp size={14} className="text-violet-400" />
                </div>
                <span className={`text-xs font-semibold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-500'}`}>Threat Activity</span>
              </div>
              <div className="flex items-end gap-1 h-12">
                {[30, 50, 35, 70, 55, 85, 65, 90, 72, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, ${i > 7 ? '#ef4444' : '#0ea5e9'}, transparent)`,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
              <div className="text-[10px] text-slate-500 mt-1.5">+23% threats this week</div>
            </FloatingCard>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${theme === 'dark' ? 'from-[#020408]' : 'from-[#f8fafc]'} to-transparent`} />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[11px] text-slate-600 tracking-widest uppercase">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-[rgba(14,165,233,0.3)] flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-[#0ea5e9]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
// floating AI cards
// scanning bracket overlay
// hero stats row
