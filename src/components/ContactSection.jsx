import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, MessageCircle, Phone, ChevronDown, Send, Bot, Shield } from 'lucide-react';

const faqs = [
  {
    q: 'How accurate is DeepShield AI in detecting deepfakes?',
    a: 'Our ensemble pipeline achieves 99.7% accuracy on benchmark datasets including FaceForensics++, DFDC, and Celeb-DF. We continuously retrain against emerging GAN architectures to maintain detection superiority.',
  },
  {
    q: 'Is my facial data stored or sold?',
    a: 'Never. All facial embeddings are computed client-side and transmitted over end-to-end encrypted channels. We operate on a zero-data-retention policy — your biometrics are deleted immediately after analysis.',
  },
  {
    q: 'Can DeepShield AI detect deepfakes in real-time video?',
    a: 'Yes. Our streaming analysis API supports real-time video deepfake detection at up to 60fps with < 200ms latency, suitable for live call verification and broadcast monitoring.',
  },
  {
    q: 'What types of AI manipulation can you detect?',
    a: 'We detect face swaps (DeepFaceLab, FaceSwap), face reenactment (First Order Motion), Stable Diffusion generations, Midjourney synthetics, GAN-generated portraits, and voice-cloned video.',
  },
  {
    q: 'Are the investigation reports legally admissible?',
    a: 'Our reports are designed to meet evidentiary standards and include cryptographic timestamps via blockchain anchoring. They have been accepted in legal proceedings in the US, EU, and UK jurisdictions.',
  },
  {
    q: 'How do I get access for enterprise or law enforcement?',
    a: 'Contact our enterprise team for custom API pricing, dedicated infrastructure, SLA guarantees, and on-premise deployment options. We have special pricing for NGOs and law enforcement agencies.',
  },
];

const FAQItem = ({ item, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left group"
        id={`faq-${index}`}
      >
        <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors pr-4">
          {item.q}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={16} className="text-[#0ea5e9]" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-[rgba(14,165,233,0.08)] pt-4">
          {item.a}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ContactSection = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: 'Hi! I\'m DeepShield AI Assistant. How can I help you today?' },
  ]);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => setSent(true), 500);
  };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatHistory(prev => [...prev,
      { role: 'user', text: chatMsg },
      { role: 'ai', text: 'Thanks for reaching out! Our team will get back to you within 24 hours. For urgent security concerns, use the contact form above.' },
    ]);
    setChatMsg('');
  };

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-deep-black overflow-hidden">
      <div className="absolute inset-0 cyber-grid-bg opacity-30" />

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
              Get In Touch
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-black text-white mb-5"
          >
            We're Here to{' '}
            <span className="text-gradient">Protect You</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto"
          >
            Contact our security team, explore enterprise solutions, or get 
            immediate AI-powered support.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-card rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-6">Send a Message</h3>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-4">
                  <Shield size={28} className="text-emerald-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-sm text-slate-400">Our security team will respond within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Full Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg text-sm transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="Enterprise inquiry / Security concern / Technical support"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Message</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    placeholder="Describe your request or concern..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg text-sm transition-all resize-none"
                  />
                </div>
                <button type="submit" id="contact-submit" className="btn-primary w-full justify-center">
                  <Send size={15} />
                  Send Secure Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Right side */}
          <div className="space-y-5">
            {/* Contact cards */}
            {[
              { icon: Mail, label: 'Email Us', value: 'security@deepshield.ai', color: '#0ea5e9' },
              { icon: Phone, label: 'Emergency Hotline', value: '+1 (888) DEEP-AI1', color: '#10b981' },
              { icon: MessageCircle, label: 'Enterprise Sales', value: 'enterprise@deepshield.ai', color: '#8b5cf6' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card rounded-xl p-5 flex items-center gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
                  >
                    <Icon size={20} style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                    <div className="text-sm font-semibold text-white">{item.value}</div>
                  </div>
                </motion.div>
              );
            })}

            {/* AI Chat Widget */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className="w-full flex items-center justify-between p-5 hover:bg-[rgba(14,165,233,0.05)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.3)] flex items-center justify-center">
                    <Bot size={18} className="text-violet-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-white">AI Support Chat</div>
                    <div className="text-xs text-slate-500">Online · Typically replies instantly</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                  <span className="text-xs text-emerald-400">Live</span>
                </div>
              </button>

              {chatOpen && (
                <div className="border-t border-[rgba(14,165,233,0.1)]">
                  <div className="h-40 p-4 space-y-3 overflow-y-auto">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`text-xs px-3 py-2 rounded-xl max-w-[80%] leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-[rgba(14,165,233,0.2)] text-slate-200'
                              : 'bg-[rgba(15,26,46,0.8)] text-slate-300 border border-[rgba(14,165,233,0.1)]'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 p-3 border-t border-[rgba(14,165,233,0.08)]">
                    <input
                      id="chat-input"
                      type="text"
                      placeholder="Type a message..."
                      value={chatMsg}
                      onChange={(e) => setChatMsg(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                      className="flex-1 px-3 py-2 rounded-lg text-xs"
                    />
                    <button onClick={sendChat} className="btn-primary text-xs px-3 py-2">
                      <Send size={12} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
// faq and chat
