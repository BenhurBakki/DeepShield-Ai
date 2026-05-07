import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Shield, Download, AlertTriangle, CheckCircle, ExternalLink,
  Calendar, Hash, FileText, Clock, Globe, Eye, Lock, ChevronLeft,
  Cpu, Activity
} from 'lucide-react';

const threatMatches = [
  { id: 1, platform: 'Social Media Platform', url: 'socialmedia.com/profile/fake-xyz', score: 94.3, type: 'Profile Impersonation', risk: 'critical', date: '2025-05-06' },
  { id: 2, platform: 'Video Sharing Site', url: 'videoshare.com/watch?v=deepfake123', score: 87.1, type: 'Deepfake Video', risk: 'critical', date: '2025-05-05' },
  { id: 3, platform: 'Image Board', url: 'imageboard.net/thread/44892', score: 78.9, type: 'Manipulated Photo', risk: 'high', date: '2025-05-04' },
  { id: 4, platform: 'Dark Web Forum', url: 'forum.onion/post/99234', score: 72.4, type: 'Identity Dataset', risk: 'high', date: '2025-05-03' },
  { id: 5, platform: 'News Aggregator', url: 'newssite.com/article/fake-news-33', score: 65.2, type: 'Disinformation Media', risk: 'medium', date: '2025-05-01' },
  { id: 6, platform: 'Adult Content Site', url: 'adultsite.example/content/xxx', score: 61.8, type: 'NCII Content', risk: 'medium', date: '2025-04-28' },
  { id: 7, platform: 'Data Broker', url: 'databroker.com/records/user-88', score: 58.3, type: 'Data Exposure', risk: 'medium', date: '2025-04-25' },
];

const riskConfig = {
  critical: { label: 'CRITICAL', className: 'threat-critical', dot: '#ef4444' },
  high: { label: 'HIGH', className: 'threat-high', dot: '#f59e0b' },
  medium: { label: 'MEDIUM', className: 'threat-medium', dot: '#06b6d4' },
  low: { label: 'LOW', className: 'threat-low', dot: '#10b981' },
};

const ReportPage = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-deep-black">
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="glass border-b border-[rgba(14,165,233,0.12)] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
              <ChevronLeft size={16} /> Back to Dashboard
            </Link>
            <div className="w-px h-5 bg-[rgba(14,165,233,0.2)]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center">
                <Shield size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-white">DeepShield AI</span>
            </div>
          </div>
          <button
            id="download-report-btn"
            onClick={handleDownload}
            className="btn-primary text-sm px-5 py-2.5"
            disabled={downloading}
          >
            {downloading ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Cpu size={14} />
                </motion.div>
                Generating...
              </>
            ) : (
              <><Download size={14} /> Download Report</>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 mb-3 border border-[rgba(14,165,233,0.2)]">
                <FileText size={12} className="text-[#0ea5e9]" />
                <span className="text-xs text-[#0ea5e9] font-medium">AI INVESTIGATION REPORT</span>
              </div>
              <h1 className="text-3xl font-black text-white mb-2">
                Digital Identity <span className="text-gradient">Threat Analysis</span>
              </h1>
              <p className="text-slate-400 text-sm">Comprehensive deepfake detection and facial similarity investigation</p>
            </div>
            <div className="glass-card rounded-xl p-4 text-right min-w-[200px]">
              <div className="text-xs text-slate-500 mb-1">Case ID</div>
              <div className="font-mono text-sm font-bold text-[#0ea5e9]">DS-2025-0507-4891</div>
              <div className="text-xs text-slate-500 mt-2 mb-1">Generated</div>
              <div className="text-xs text-white">May 07, 2025 • 10:49 AM</div>
            </div>
          </div>

          {/* Meta cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { icon: AlertTriangle, label: 'Threat Severity', value: 'CRITICAL', color: '#ef4444' },
              { icon: Eye, label: 'Matches Found', value: '7 Sources', color: '#f59e0b' },
              { icon: Clock, label: 'Analysis Time', value: '0.74 seconds', color: '#0ea5e9' },
              { icon: Lock, label: 'Encryption', value: 'AES-256 + ZKP', color: '#10b981' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="glass-card rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={13} style={{ color: item.color }} />
                    <span className="text-[10px] text-slate-500">{item.label}</span>
                  </div>
                  <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}</div>
                </div>
              );
            })}
          </div>

          {/* Severity banner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 p-4 rounded-xl border"
            style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.25)' }}
          >
            <div className="w-10 h-10 rounded-xl bg-[rgba(239,68,68,0.15)] flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-red-400 mb-0.5">Critical Threat Detected — Immediate Action Required</div>
              <div className="text-xs text-slate-400">
                Our AI has identified 7 unauthorized uses of your likeness across multiple platforms, 
                including 2 deepfake videos and 1 non-consensual intimate image. Legal takedown 
                procedures have been initiated.
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Detection scores */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mb-5"
        >
          <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <Cpu size={16} className="text-[#8b5cf6]" /> AI Analysis Summary
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { label: 'Facial Similarity', score: 94.3, color: '#ef4444', desc: 'Extremely high match probability' },
              { label: 'Deepfake Probability', score: 87.1, color: '#f59e0b', desc: 'Strong GAN artifact signatures' },
              { label: 'Model Confidence', score: 96.8, color: '#0ea5e9', desc: 'High certainty detection' },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(30,41,59,0.5)" strokeWidth="2" />
                    <motion.circle
                      cx="18" cy="18" r="15.9"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - item.score }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                      style={{ filter: `drop-shadow(0 0 4px ${item.color}60)` }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black" style={{ color: item.color }}>{item.score}%</span>
                  </div>
                </div>
                <div className="text-sm font-semibold text-white mb-1">{item.label}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Match table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card rounded-2xl p-6 mb-5"
        >
          <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <Globe size={16} className="text-[#0ea5e9]" /> Detected Sources ({threatMatches.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(14,165,233,0.1)]">
                  {['#', 'Platform', 'Type', 'Similarity', 'Risk', 'Detected', 'Action'].map((h) => (
                    <th key={h} className="text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {threatMatches.map((match, i) => {
                  const risk = riskConfig[match.risk];
                  return (
                    <motion.tr
                      key={match.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.06 }}
                      className="border-b border-[rgba(14,165,233,0.06)] hover:bg-[rgba(14,165,233,0.03)] transition-colors"
                    >
                      <td className="py-3 pr-4 text-slate-500 text-xs">{String(i + 1).padStart(2, '0')}</td>
                      <td className="py-3 pr-4">
                        <div className="text-xs font-medium text-slate-200">{match.platform}</div>
                        <div className="text-[10px] text-slate-600 font-mono truncate max-w-[160px]">{match.url}</div>
                      </td>
                      <td className="py-3 pr-4 text-xs text-slate-400">{match.type}</td>
                      <td className="py-3 pr-4">
                        <span className="text-sm font-bold" style={{ color: risk.dot }}>{match.score}%</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${risk.className}`}>{risk.label}</span>
                      </td>
                      <td className="py-3 pr-4 text-xs text-slate-500">{match.date}</td>
                      <td className="py-3 pr-4">
                        <button className="text-[11px] text-[#0ea5e9] hover:text-[#06b6d4] flex items-center gap-1 transition-colors">
                          View <ExternalLink size={10} />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-2xl p-6 mb-5"
        >
          <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <Activity size={16} className="text-[#10b981]" /> Detection Timeline
          </h2>
          <div className="relative pl-5">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#0ea5e9] via-[rgba(14,165,233,0.3)] to-transparent" />
            {[
              { time: '10:49:23', event: 'Image uploaded and encrypted', status: 'success' },
              { time: '10:49:24', event: 'Face detected — 1 subject identified', status: 'success' },
              { time: '10:49:24', event: 'ArcFace embedding generated (512-dim)', status: 'success' },
              { time: '10:49:24', event: 'FAISS search completed — 7 matches in 2.1B index', status: 'warning' },
              { time: '10:49:25', event: 'Deepfake analysis ensemble completed — HIGH probability', status: 'danger' },
              { time: '10:49:25', event: 'Source attribution and risk scoring complete', status: 'warning' },
              { time: '10:49:25', event: 'Evidence report compiled and blockchain timestamped', status: 'success' },
            ].map((event, i) => {
              const color = event.status === 'success' ? '#10b981' : event.status === 'warning' ? '#f59e0b' : '#ef4444';
              return (
                <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5 -ml-[5px]" style={{ background: color, boxShadow: `0 0 6px ${color}60` }} />
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 mr-2">{event.time}</span>
                    <span className="text-xs text-slate-300">{event.event}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(14,165,233,0.2)]" />
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-[#0ea5e9]" />
              <span className="text-xs text-slate-500">DeepShield AI — Certified Investigation Report</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(14,165,233,0.2)]" />
          </div>
          <p className="text-[11px] text-slate-600 max-w-2xl mx-auto">
            This report was generated by DeepShield AI v4.2 and is cryptographically signed. 
            Case ID: DS-2025-0507-4891 • Blockchain hash: 0x4a8f...3d91 • Valid for legal proceedings in US, EU, UK jurisdictions.
          </p>
          <div className="flex justify-center gap-3 mt-5">
            <button id="report-download-bottom" onClick={handleDownload} className="btn-primary text-sm px-6 py-2.5">
              <Download size={14} /> Download PDF Report
            </button>
            <Link to="/dashboard" className="btn-secondary text-sm px-6 py-2.5">New Scan</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportPage;
