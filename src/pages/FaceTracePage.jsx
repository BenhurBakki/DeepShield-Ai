import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Globe, Upload, X, CheckCircle, AlertTriangle, Cpu,
  ExternalLink, Copy, Search, Link2
} from 'lucide-react';

const STEPS = ['Uploading image...', 'Generating visual fingerprint...', 'Scanning web sources...', 'Compiling results...'];

const getDomain = (url) => {
  try { return new URL(url).hostname.replace('www.', ''); }
  catch { return url?.slice(0, 30) || 'Unknown'; }
};

// Trace results are now fetched from the Flask backend which securely handles image hosting and SerpApi integration.

// ── Match card ────────────────────────────────────────────────────────────────
const MatchCard = ({ match, index }) => {
  const [copied, setCopied] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const copyUrl = () => {
    navigator.clipboard.writeText(match.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-xl overflow-hidden flex flex-col group"
    >
      <div className="relative h-32 bg-[rgba(15,26,46,0.9)] flex-shrink-0 overflow-hidden">
        {match.thumbnail && !imgErr ? (
          <img src={match.thumbnail} alt={match.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgErr(true)} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Globe size={28} className="text-slate-700" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,4,8,0.85)] to-transparent" />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold"
          style={{ background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.4)', color: '#a78bfa' }}>
          #{match.position || index + 1}
        </div>
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${
          match.type === 'visual_match'
            ? 'bg-[rgba(14,165,233,0.2)] border border-[rgba(14,165,233,0.4)] text-[#38bdf8]'
            : 'bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.4)] text-emerald-400'
        }`}>
          {match.type === 'visual_match' ? 'Visual Match' : 'Page Match'}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          {match.source_icon
            ? <img src={match.source_icon} alt="" className="w-3.5 h-3.5 rounded-full" onError={e => e.target.style.display='none'} />
            : <Globe size={11} className="text-[#8b5cf6]" />
          }
          <span className="text-[10px] font-semibold text-[#8b5cf6] truncate">
            {match.source || getDomain(match.url)}
          </span>
        </div>
        <p className="text-xs font-semibold text-white line-clamp-2 mb-3 flex-1 leading-relaxed">{match.title}</p>
        <p className="text-[9px] text-slate-600 truncate mb-3 font-mono">{match.url}</p>
        <div className="flex gap-2 mt-auto">
          <a href={match.url} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-semibold text-white transition-all"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <ExternalLink size={10} /> Visit
          </a>
          <button onClick={copyUrl}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
            style={{
              background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(14,165,233,0.1)',
              border: copied ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(14,165,233,0.2)',
              color: copied ? '#34d399' : '#38bdf8',
            }}>
            {copied ? <><CheckCircle size={10} /> Copied!</> : <><Copy size={10} /> Copy URL</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main panel ────────────────────────────────────────────────────────────────
const FaceTracePanel = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const onDrop = useCallback((files) => {
    const f = files[0];
    if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setResults(null); setError(null); }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1,
  });

  const handleTrace = async () => {
    if (!file) return;
    setLoading(true); setError(null); setProgress(0); setResults(null);
    const tick = (p, msg) => { setProgress(p); setStatusMsg(msg); };

    try {
      tick(15, 'Sending image to scan engine...');
      const API_URL = "http://Deepshield-backend-env-1.eba-xrtbwy37.us-east-1.elasticbeanstalk.com";
      const formData = new FormData();
      formData.append('file', file);

      const backendResp = await fetch(`${API_URL}/api/face-trace/search`, {
        method: 'POST', body: formData,
      });

      tick(75, 'Processing results...');

      if (!backendResp.ok) {
        const err = await backendResp.json().catch(() => ({}));
        throw new Error(err.error || `Backend error ${backendResp.status}`);
      }

      const data = await backendResp.json();
      tick(100, 'Done ✓');
      setResults({ matches: data.matches || [], total: data.total || 0 });
    } catch (e) {
      setError(e.message || 'Search failed. Make sure the Flask backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setFile(null); setPreview(null); setResults(null); setError(null); setProgress(0); };

  const filteredMatches = results?.matches?.filter(m => filter === 'all' || m.type === filter) || [];
  const riskLevel = !results ? null
    : results.total > 20 ? { label: 'High', color: '#ef4444' }
    : results.total > 5  ? { label: 'Medium', color: '#f59e0b' }
    : { label: 'Low', color: '#10b981' };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Globe size={18} className="text-[#8b5cf6]" /> Face Trace
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Discover every website where your image is circulating</p>
        </div>
        {results && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
            <span className="text-xs font-semibold text-[#a78bfa]">{results.total} Sources Found</span>
          </motion.div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {/* Upload */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Upload size={14} className="text-[#8b5cf6]" /> Upload Face Image
            </h3>
            {!preview ? (
              <div {...getRootProps()} id="face-trace-dropzone"
                className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300"
                style={{ borderColor: isDragActive ? '#8b5cf6' : 'rgba(139,92,246,0.25)', background: isDragActive ? 'rgba(139,92,246,0.07)' : 'transparent' }}>
                <input {...getInputProps()} />
                <motion.div animate={{ y: isDragActive ? -6 : 0 }}>
                  <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <Upload size={20} className="text-[#8b5cf6]" />
                  </div>
                  <p className="text-xs font-semibold text-slate-300 mb-1">
                    {isDragActive ? 'Drop image here' : 'Drag & drop or click to browse'}
                  </p>
                  <p className="text-[10px] text-slate-500">JPEG, PNG, WebP • Max 10MB</p>
                </motion.div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,4,8,0.75)] to-transparent" />
                {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
                  <div key={i} className="absolute w-4 h-4" style={{
                    ...pos,
                    borderTop: [0,1].includes(i) ? '2px solid #8b5cf6' : 'none',
                    borderBottom: [2,3].includes(i) ? '2px solid #8b5cf6' : 'none',
                    borderLeft: [0,2].includes(i) ? '2px solid #8b5cf6' : 'none',
                    borderRight: [1,3].includes(i) ? '2px solid #8b5cf6' : 'none',
                  }} />
                ))}
                <button onClick={reset}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center hover:bg-[rgba(239,68,68,0.4)] transition-all">
                  <X size={11} className="text-white" />
                </button>
              </div>
            )}
            {preview && (
              <motion.button id="face-trace-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleTrace} disabled={loading}
                className="mt-4 w-full py-2.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2"
                style={{
                  background: loading ? 'rgba(139,92,246,0.25)' : 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
                  boxShadow: loading ? 'none' : '0 0 22px rgba(139,92,246,0.4)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading
                  ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Cpu size={14} /></motion.div> Tracing...</>
                  : <><Globe size={14} /> Start Face Trace</>}
              </motion.button>
            )}
          </div>

          {/* Progress */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="glass-card rounded-2xl p-5 overflow-hidden">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Cpu size={14} className="text-[#8b5cf6]" /> Scanning Web
                  <span className="ml-auto flex items-center gap-1 text-xs text-[#8b5cf6]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" /> Live
                  </span>
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                    <span className="text-[10px] text-slate-500 truncate pr-2">{statusMsg}</span>
                    <span className="text-[#8b5cf6] font-semibold flex-shrink-0">{Math.round(progress)}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
                      style={{ background: 'linear-gradient(90deg,#8b5cf6,#6d28d9)' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  {STEPS.map((step, i) => {
                    const threshold = (i + 1) * 22;
                    const done = progress > threshold;
                    const active = progress > i * 22 && !done;
                    return (
                      <div key={step} className={`flex items-center gap-2 p-2 rounded-lg text-xs transition-all ${active ? 'bg-[rgba(139,92,246,0.08)]' : ''}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          done ? 'bg-[rgba(16,185,129,0.2)]' : active ? 'bg-[rgba(139,92,246,0.2)]' : 'bg-[rgba(30,41,59,0.5)]'
                        }`}>
                          {done ? <CheckCircle size={10} className="text-emerald-400" />
                            : active ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Cpu size={9} className="text-[#8b5cf6]" /></motion.div>
                            : <span className="text-[8px] text-slate-600">{i + 1}</span>}
                        </div>
                        <span className={done ? 'text-emerald-400' : active ? 'text-white' : 'text-slate-600'}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* How it works */}
          {!results && !loading && (
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">How It Works</h3>
              <div className="space-y-3">
                {[
                  { icon: Upload, text: 'Upload any facial photo' },
                  { icon: Globe, text: 'AI scans the web via Google Lens' },
                  { icon: Search, text: 'All matching sources located' },
                  { icon: Link2, text: 'Get direct URLs to take action' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                      <Icon size={13} className="text-[#8b5cf6]" />
                    </div>
                    <span className="text-xs text-slate-400">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary after results */}
          {results && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-5">
              <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Trace Summary</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Total Sources', value: results.total, color: '#8b5cf6' },
                  { label: 'Risk Level', value: riskLevel?.label, color: riskLevel?.color },
                  { label: 'Exposure Score', value: `${Math.min(results.total * 5, 100)}%`, color: '#0ea5e9' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="text-xs font-bold" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
              <button onClick={reset} className="w-full mt-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                ← New Search
              </button>
            </motion.div>
          )}
        </div>

        {/* Right: results */}
        <div className="lg:col-span-2">
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="glass-card rounded-2xl p-5 mb-4" style={{ borderColor: 'rgba(239,68,68,0.2)' }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertTriangle size={18} className="text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white mb-0.5">Search Failed</div>
                    <div className="text-xs text-slate-400">{error}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!results && !loading && !error && (
            <div className="glass-card rounded-2xl flex flex-col items-center justify-center text-center min-h-[380px]">
              <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                <Globe size={34} className="text-[#8b5cf6]" />
              </motion.div>
              <p className="text-sm font-semibold text-slate-400 mb-1">No scan started</p>
              <p className="text-xs text-slate-600 max-w-[240px]">
                Upload a face image and click <span className="text-[#8b5cf6]">Start Face Trace</span>
              </p>
            </div>
          )}

          {loading && (
            <div className="glass-card rounded-2xl flex flex-col items-center justify-center text-center min-h-[380px]">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full mb-5"
                style={{ border: '2px solid rgba(139,92,246,0.2)', borderTopColor: '#8b5cf6' }} />
              <p className="text-sm font-semibold text-white mb-1">Scanning the internet...</p>
              <p className="text-xs text-slate-500">Powered by Google Lens visual search</p>
            </div>
          )}

          {results && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-xs text-slate-500 font-medium">Filter:</span>
                {[
                  { key: 'all', label: `All (${results.total})` },
                  { key: 'visual_match', label: 'Visual Matches' },
                  { key: 'page_match', label: 'Page Matches' },
                ].map(({ key, label }) => (
                  <button key={key} onClick={() => setFilter(key)}
                    className="px-3 py-1 rounded-full text-[10px] font-semibold transition-all"
                    style={{
                      background: filter === key ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                      border: filter === key ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.07)',
                      color: filter === key ? '#a78bfa' : '#64748b',
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              {filteredMatches.length === 0 ? (
                <div className="glass-card rounded-2xl flex flex-col items-center justify-center text-center min-h-[300px]">
                  <CheckCircle size={36} className="text-emerald-400 mb-4" />
                  <p className="text-sm font-bold text-white mb-1">No Sources Found</p>
                  <p className="text-xs text-slate-500">This image doesn't appear to be circulating online</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredMatches.map((match, i) => (
                    <MatchCard key={`${match.url}-${i}`} match={match} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FaceTracePanel;
