import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Scan, ArrowRight, Zap, Eye, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

// Animated floating card
const FloatingCard = ({ children, className, delay = 0, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay }}
    style={style}
    className={`glass-card rounded-2xl p-4 absolute ${className}`}
  >
    {children}
  </motion.div>
);

// Animated particle canvas
const ParticleNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const alpha = (1 - dist / 150) * 0.15;
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        node.pulse += 0.03;
        const pulseR = node.r + Math.sin(node.pulse) * 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(14, 165, 233, 0.6)`;
        ctx.fill();

        // Glow
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        grad.addColorStop(0, 'rgba(14,165,233,0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-deep-black">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg" />
      <div className="absolute inset-0 bg-gradient-radial from-[rgba(14,165,233,0.06)] via-transparent to-transparent" style={{ top: '10%', left: '20%', width: '60%', height: '60%' }} />
      <div className="absolute inset-0 bg-gradient-radial from-[rgba(139,92,246,0.04)] via-transparent to-transparent" style={{ bottom: '0', right: '0', width: '50%', height: '50%' }} />

      {/* Particle network */}
      <ParticleNetwork />

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
          <div>
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
              <span className="text-white">Protect Your</span>
              <br />
              <span className="shimmer-text">Identity From</span>
              <br />
              <span className="text-white">AI Manipulation</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-lg text-slate-400 leading-relaxed mb-10 max-w-xl"
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
            {/* Central shield animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {/* Outer rings */}
              {[180, 230, 280].map((size, i) => (
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
                >
                  <div
                    className="absolute top-0 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                    style={{ background: '#0ea5e9', boxShadow: '0 0 8px rgba(14,165,233,0.8)' }}
                  />
                </div>
              ))}

              {/* Center shield */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
                style={{ width: 120, height: 120 }}
              >
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center shadow-glow-blue">
                  <Shield size={56} className="text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] blur-2xl opacity-30" />
              </motion.div>
            </motion.div>

            {/* Floating data cards */}
            <FloatingCard
              delay={0.8}
              className="top-12 left-0 w-52"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[rgba(14,165,233,0.15)] flex items-center justify-center">
                  <Eye size={14} className="text-[#0ea5e9]" />
                </div>
                <span className="text-xs font-semibold text-slate-300">Similarity Score</span>
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
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.15)] flex items-center justify-center">
                  <AlertTriangle size={14} className="text-red-400" />
                </div>
                <span className="text-xs font-semibold text-slate-300">Deepfake Probability</span>
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
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                  <CheckCircle size={14} className="text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-slate-300">AI Analysis</span>
              </div>
              <div className="space-y-1.5">
                {['Face Detection', 'Embedding Gen.', 'Dataset Scan'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                    <span className="text-[11px] text-slate-400">{step}</span>
                    <span className="ml-auto text-[10px] text-emerald-400">✓</span>
                  </div>
                ))}
              </div>
            </FloatingCard>

            <FloatingCard
              delay={1.4}
              className="bottom-16 right-2 w-52"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center">
                  <TrendingUp size={14} className="text-violet-400" />
                </div>
                <span className="text-xs font-semibold text-slate-300">Threat Activity</span>
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

            {/* Scanning face overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 pointer-events-none"
              style={{ zIndex: 2 }}
            >
              {/* Corner brackets */}
              {[
                { top: 0, left: 0, borderTop: '2px solid #0ea5e9', borderLeft: '2px solid #0ea5e9' },
                { top: 0, right: 0, borderTop: '2px solid #0ea5e9', borderRight: '2px solid #0ea5e9' },
                { bottom: 0, left: 0, borderBottom: '2px solid #0ea5e9', borderLeft: '2px solid #0ea5e9' },
                { bottom: 0, right: 0, borderBottom: '2px solid #0ea5e9', borderRight: '2px solid #0ea5e9' },
              ].map((style, i) => (
                <div
                  key={i}
                  className="absolute w-6 h-6 rounded-sm"
                  style={style}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020408] to-transparent" />

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
