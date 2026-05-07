import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, ShieldAlert, FileText, Bell, Lock, Brain,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Facial Similarity Search',
    description:
      'Our neural engine compares your facial biometrics against 2.1B+ monitored images across public datasets, social platforms, and dark web repositories.',
    color: '#0ea5e9',
    gradient: 'from-[rgba(14,165,233,0.15)] to-[rgba(14,165,233,0.03)]',
    tag: 'Core Feature',
    stats: '99.7% accuracy',
    route: '/dashboard?tab=scan',
  },
  {
    icon: ShieldAlert,
    title: 'Deepfake Detection',
    description:
      'Multi-model AI pipeline detects GAN artifacts, face-swap inconsistencies, and diffusion model fingerprints across video, images, and live streams.',
    color: '#ef4444',
    gradient: 'from-[rgba(239,68,68,0.15)] to-[rgba(239,68,68,0.03)]',
    tag: 'AI-Powered',
    stats: '87+ detection models',
    route: '/dashboard?tab=scan',
  },
  {
    icon: FileText,
    title: 'Evidence Reports',
    description:
      'Generate court-admissible investigation reports with case IDs, timestamps, source links, and AI confidence metrics — downloadable as PDF.',
    color: '#8b5cf6',
    gradient: 'from-[rgba(139,92,246,0.15)] to-[rgba(139,92,246,0.03)]',
    tag: 'Documentation',
    stats: 'PDF + JSON export',
    route: '/report',
  },
  {
    icon: Bell,
    title: 'Real-Time Threat Monitoring',
    description:
      'Continuous 24/7 surveillance across emerging platforms and datasets. Instant alerts when new facial matches or suspicious identity misuse is detected.',
    color: '#f59e0b',
    gradient: 'from-[rgba(245,158,11,0.15)] to-[rgba(245,158,11,0.03)]',
    tag: 'Live Alerts',
    stats: 'Real-time monitoring',
    route: '/dashboard?tab=threats',
  },
  {
    icon: Lock,
    title: 'Privacy-First Encryption',
    description:
      'All facial embeddings are processed using zero-knowledge proofs. Your biometric data never leaves your device unencrypted — military-grade security.',
    color: '#10b981',
    gradient: 'from-[rgba(16,185,129,0.15)] to-[rgba(16,185,129,0.03)]',
    tag: 'Security',
    stats: 'AES-256 + ZKP',
    route: '/dashboard?tab=settings',
  },
  {
    icon: Brain,
    title: 'Neural Analytics',
    description:
      'Advanced visualization of facial embedding clusters, similarity heatmaps, detection confidence graphs, and threat intelligence dashboards.',
    color: '#06b6d4',
    gradient: 'from-[rgba(6,182,212,0.15)] to-[rgba(6,182,212,0.03)]',
    tag: 'Intelligence',
    stats: 'Interactive charts',
    route: '/dashboard?tab=analytics',
  },
];

const FeatureCard = ({ feature, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const Icon = feature.icon;
  const navigate = useNavigate();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={() => navigate(feature.route)}
      className="glass-card rounded-2xl p-6 group cursor-pointer relative overflow-hidden"
      id={`feature-card-${index}`}
    >
      {/* Hover background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10">
        {/* Tag */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{
              color: feature.color,
              background: `${feature.color}18`,
              border: `1px solid ${feature.color}30`,
            }}
          >
            {feature.tag}
          </span>
          <span className="text-[11px] text-slate-500">{feature.stats}</span>
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
          style={{
            background: `${feature.color}18`,
            border: `1px solid ${feature.color}30`,
          }}
        >
          <Icon size={22} style={{ color: feature.color }} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gradient-blue transition-all">
          {feature.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-5">
          {feature.description}
        </p>

        {/* CTA row */}
        <div
          className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 group-hover:gap-3"
          style={{ color: feature.color }}
        >
          <span>Explore feature</span>
          <ArrowRight size={13} />
        </div>
      </div>

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(circle at top right, ${feature.color}20, transparent 70%)`,
        }}
      />
    </motion.div>
  );
};

const FeaturesSection = () => {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="features" className="relative py-24 lg:py-32 bg-dark-navy overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-50" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(14,165,233,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 border border-[rgba(14,165,233,0.2)]"
          >
            <div className="glow-dot" style={{ width: 6, height: 6 }} />
            <span className="text-xs font-medium text-[#0ea5e9] tracking-widest uppercase">
              Platform Capabilities
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-5"
          >
            Everything You Need to{' '}
            <span className="text-gradient">Stay Protected</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Military-grade AI protection suite designed for individuals, enterprises,
            and law enforcement agencies combating digital identity fraud.
          </motion.p>
        </div>

        {/* Feature grid — each card is fully clickable */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 text-center"
        >
          <p className="text-slate-500 text-sm mb-5">
            Trusted by 50,000+ individuals and 300+ enterprise security teams
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['SOC 2 Certified', 'GDPR Compliant', 'ISO 27001', 'NIST Framework'].map((badge) => (
              <div
                key={badge}
                className="glass rounded-lg px-4 py-2 text-xs font-medium text-slate-400 border border-[rgba(14,165,233,0.1)]"
              >
                {badge}
              </div>
            ))}
          </div>
          <button
            id="features-start-scan-cta"
            onClick={() => navigate('/dashboard?tab=scan')}
            className="btn-primary px-8 py-3.5 text-sm"
          >
            Start Your Free Scan Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
