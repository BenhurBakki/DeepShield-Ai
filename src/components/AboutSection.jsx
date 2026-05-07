import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Shield, Users, Globe, Award, Target, Zap } from 'lucide-react';

const AnimatedCounter = ({ end, duration = 2, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = 0;
    const step = end / (duration * 60);
    let current = start;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

const stats = [
  { icon: Users, value: 50000, suffix: '+', label: 'Protected Users', color: '#0ea5e9' },
  { icon: Globe, value: 147, suffix: '', label: 'Countries Served', color: '#06b6d4' },
  { icon: Shield, value: 99.7, suffix: '%', label: 'Detection Accuracy', color: '#8b5cf6', isFloat: true },
  { icon: Target, value: 2100000000, suffix: '+', label: 'Faces Indexed', color: '#f59e0b', prefix: '' },
  { icon: Zap, value: 800, suffix: 'ms', label: 'Avg. Analysis Time', color: '#10b981' },
  { icon: Award, value: 30, suffix: '+', label: 'Industry Awards', color: '#ec4899' },
];

const AboutSection = () => {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="about" className="relative py-24 lg:py-32 bg-dark-navy overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-40" />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6 border border-[rgba(14,165,233,0.2)]"
          >
            <div className="glow-dot" style={{ width: 6, height: 6 }} />
            <span className="text-xs font-medium text-[#0ea5e9] tracking-widest uppercase">
              Our Mission
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-5"
          >
            Fighting the{' '}
            <span className="text-gradient">Deepfake Epidemic</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-3xl mx-auto"
          >
            By 2025, over 90% of online media will be AI-generated. DeepShield AI was born 
            from the urgent need to protect individuals from the escalating crisis of 
            non-consensual deepfakes, identity theft, and digital manipulation.
          </motion.p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="stat-card text-center group"
              >
                <div
                  className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
                >
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <div
                  className="text-3xl font-black mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.isFloat ? (
                    <span>{stat.value}{stat.suffix}</span>
                  ) : stat.value > 1000000 ? (
                    <span>2.1B{stat.suffix}</span>
                  ) : (
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  )}
                </div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Mission content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="w-10 h-10 rounded-xl bg-[rgba(14,165,233,0.15)] border border-[rgba(14,165,233,0.2)] flex items-center justify-center mb-5">
              <Shield size={20} className="text-[#0ea5e9]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Why This Matters</h3>
            <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
              <p>
                Deepfake technology has democratized digital manipulation to the point where 
                anyone with a consumer GPU can fabricate convincing videos of public figures, 
                private individuals, and sensitive scenarios.
              </p>
              <p>
                The consequences are devastating: destroyed reputations, non-consensual intimate 
                imagery, financial fraud, political disinformation, and psychological trauma for victims.
              </p>
              <p>
                DeepShield AI puts the power of forensic-grade AI investigation into every person's 
                hands — making digital identity protection accessible, affordable, and instant.
              </p>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-4"
          >
            {[
              {
                title: 'AI Ethics First',
                desc: 'We operate under strict ethical AI principles. No facial data is retained. No biometrics are sold. Zero surveillance capitalism.',
                color: '#0ea5e9',
              },
              {
                title: 'Cybersecurity Foundation',
                desc: 'Built on NIST AI Risk Management Framework. Every model is adversarially tested against evasion attacks and bias audited quarterly.',
                color: '#8b5cf6',
              },
              {
                title: 'Social Impact',
                desc: 'Partnering with NGOs to provide free protection for journalists, activists, and at-risk individuals in authoritarian regimes.',
                color: '#10b981',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card rounded-xl p-5"
              >
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: item.color }}
                >
                  {item.title}
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
// animated counters
