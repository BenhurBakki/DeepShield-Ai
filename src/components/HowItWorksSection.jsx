import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Upload, Scan, Cpu, Database, AlertTriangle, FileSearch, FileBadge,
  ChevronRight,
} from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Upload,
    title: 'Upload Image',
    description: 'Securely upload your facial photo. All data is encrypted client-side using AES-256 before transmission.',
    color: '#0ea5e9',
    detail: 'Supports JPEG, PNG, WebP • Max 10MB',
  },
  {
    id: 2,
    icon: Scan,
    title: 'Face Detection',
    description: 'Multi-scale CNN detects facial landmarks, pose estimation, and validates liveness with anti-spoofing checks.',
    color: '#06b6d4',
    detail: 'RetinaFace + MTCNN dual detection',
  },
  {
    id: 3,
    icon: Cpu,
    title: 'Neural Embedding',
    description: 'ArcFace neural network generates a 512-dimensional facial embedding vector that uniquely represents your face.',
    color: '#8b5cf6',
    detail: 'ArcFace R100 • 512-dim vector',
  },
  {
    id: 4,
    icon: Database,
    title: 'Similarity Search',
    description: 'FAISS vector search scans 2.1B+ indexed face embeddings across monitored datasets at millisecond speed.',
    color: '#ec4899',
    detail: 'FAISS HNSW index • <800ms latency',
  },
  {
    id: 5,
    icon: AlertTriangle,
    title: 'Deepfake Analysis',
    description: 'Ensemble of 87 specialized detection models analyze GAN artifacts, temporal inconsistencies, and blending seams.',
    color: '#ef4444',
    detail: 'XceptionNet + ViT + EfficientNet',
  },
  {
    id: 6,
    icon: FileSearch,
    title: 'Match Discovery',
    description: 'AI cross-references all flagged matches, ranks by threat severity, and maps source origins across the web.',
    color: '#f59e0b',
    detail: 'Graph-based source attribution',
  },
  {
    id: 7,
    icon: FileBadge,
    title: 'Evidence Report',
    description: 'Generate comprehensive investigation report with case ID, matches, heatmaps, and legal documentation package.',
    color: '#10b981',
    detail: 'PDF + JSON • Blockchain timestamped',
  },
];

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-deep-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />

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
              Detection Pipeline
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-5"
          >
            How DeepShield{' '}
            <span className="text-gradient">Works</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Seven-stage AI pipeline built on state-of-the-art computer vision 
            and vector search technology.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line for desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(14,165,233,0.3), rgba(14,165,233,0.3), transparent)' }}
          />

          <div className="space-y-6 lg:space-y-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLeft = index % 2 === 0;
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: '-80px' });

              return (
                <motion.div
                  ref={ref}
                  key={step.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-8 items-center mb-8 ${isLeft ? '' : 'lg:[&>div:first-child]:order-last'}`}
                  onMouseEnter={() => setActiveStep(step.id)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  {/* Content card */}
                  <div className={`${isLeft ? 'lg:text-right lg:pr-12' : 'lg:pl-12'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="glass-card rounded-2xl p-6 cursor-pointer group"
                      style={{
                        borderColor: activeStep === step.id ? `${step.color}40` : undefined,
                        boxShadow: activeStep === step.id ? `0 0 30px ${step.color}15` : undefined,
                      }}
                    >
                      <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'lg:flex-row-reverse' : ''}`}>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${step.color}18`,
                            border: `1px solid ${step.color}30`,
                          }}
                        >
                          <Icon size={18} style={{ color: step.color }} />
                        </div>
                        <h3 className="text-base font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed mb-3">
                        {step.description}
                      </p>
                      <span
                        className="text-[10px] font-mono px-2 py-1 rounded"
                        style={{
                          color: step.color,
                          background: `${step.color}12`,
                          border: `1px solid ${step.color}25`,
                        }}
                      >
                        {step.detail}
                      </span>
                    </motion.div>
                  </div>

                  {/* Center node */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center z-10">
                    <motion.div
                      animate={activeStep === step.id ? { scale: 1.3 } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-12 h-12 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                        border: `2px solid ${step.color}50`,
                        boxShadow: activeStep === step.id ? `0 0 20px ${step.color}50` : 'none',
                      }}
                    >
                      <span className="text-sm font-black" style={{ color: step.color }}>
                        {step.id.toString().padStart(2, '0')}
                      </span>

                      {activeStep === step.id && (
                        <motion.div
                          className="absolute inset-0 rounded-full"
                          style={{ border: `2px solid ${step.color}40` }}
                          animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <ChevronRight
                        size={14}
                        className="text-slate-600 mt-2 rotate-90"
                      />
                    )}
                  </div>

                  {/* Mobile step number */}
                  <div className="lg:hidden flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}
                    >
                      {step.id}
                    </div>
                    <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${step.color}40, transparent)` }} />
                  </div>

                  {/* Empty div for grid alignment */}
                  <div className="hidden lg:block" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom timing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 glass-card rounded-2xl p-6 flex flex-wrap justify-around gap-6 text-center"
        >
          {[
            { label: 'Total Analysis Time', value: '< 0.8s', sub: 'average end-to-end' },
            { label: 'Datasets Searched', value: '2.1B+', sub: 'indexed face embeddings' },
            { label: 'Detection Models', value: '87', sub: 'in ensemble pipeline' },
            { label: 'Report Generation', value: '< 3s', sub: 'including PDF render' },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-3xl font-black text-gradient-blue mb-1">{item.value}</div>
              <div className="text-sm font-semibold text-white mb-0.5">{item.label}</div>
              <div className="text-xs text-slate-500">{item.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
// timeline connector
