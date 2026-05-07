import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
  LayoutDashboard, ScanLine, FileText, Bell, BarChart3, Settings,
  User, Shield, Upload, X, CheckCircle, AlertTriangle, Cpu,
  Eye, TrendingUp, ChevronRight, Zap, Database, Activity, Lock
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

// Sidebar
const Sidebar = ({ active, setActive, collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'scan', icon: ScanLine, label: 'New Scan' },
    { id: 'reports', icon: FileText, label: 'Reports', route: '/report' },
    { id: 'threats', icon: Bell, label: 'Threat Alerts', badge: 3 },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleNav = (item) => {
    if (item.route) { navigate(item.route); return; }
    setActive(item.id);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass border-r border-[rgba(14,165,233,0.12)] h-screen flex flex-col flex-shrink-0 relative z-20"
      style={{ minWidth: collapsed ? 64 : 240 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-[rgba(14,165,233,0.1)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center flex-shrink-0 shadow-glow-blue">
          <Shield size={16} className="text-white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="text-sm font-bold text-white">DeepShield <span className="text-[#0ea5e9]">AI</span></div>
            <div className="text-[10px] text-slate-500">Security Dashboard</div>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`sidebar-${item.id}`}
              onClick={() => handleNav(item)}
              className={`sidebar-item w-full ${active === item.id ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <Icon size={17} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className={`p-3 border-t border-[rgba(14,165,233,0.1)] flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0ea5e9] to-[#8b5cf6] flex items-center justify-center flex-shrink-0">
          <User size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Alex Morgan</div>
            <div className="text-[10px] text-slate-500">Pro Plan</div>
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full glass border border-[rgba(14,165,233,0.2)] flex items-center justify-center hover:border-[rgba(14,165,233,0.5)] transition-all z-30"
      >
        <ChevronRight size={12} className={`text-[#0ea5e9] transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </motion.aside>
  );
};

// Upload panel
const ScanUploadPanel = ({ onScanStart }) => {
  const [preview, setPreview] = useState(null);
  const onDrop = useCallback((files) => {
    const file = files[0];
    if (file) setPreview(URL.createObjectURL(file));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, maxFiles: 1
  });

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
        <Upload size={16} className="text-[#0ea5e9]" /> Upload Facial Image
      </h3>
      {!preview ? (
        <div
          {...getRootProps()}
          id="scan-dropzone"
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-[#0ea5e9] bg-[rgba(14,165,233,0.08)]'
              : 'border-[rgba(14,165,233,0.2)] hover:border-[rgba(14,165,233,0.5)] hover:bg-[rgba(14,165,233,0.04)]'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{ y: isDragActive ? -8 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-14 h-14 rounded-xl bg-[rgba(14,165,233,0.1)] border border-[rgba(14,165,233,0.2)] flex items-center justify-center mx-auto mb-4">
              <Upload size={24} className="text-[#0ea5e9]" />
            </div>
            <p className="text-sm font-semibold text-slate-300 mb-1">
              {isDragActive ? 'Drop your image here' : 'Drag & drop your image'}
            </p>
            <p className="text-xs text-slate-500">or click to browse • JPEG, PNG, WebP • Max 10MB</p>
          </motion.div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(2,4,8,0.7)] to-transparent" />
          {/* Scanning corners */}
          {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
            <div key={i} className="absolute w-5 h-5" style={{
              ...pos,
              borderTop: [0, 1].includes(i) ? '2px solid #0ea5e9' : 'none',
              borderBottom: [2, 3].includes(i) ? '2px solid #0ea5e9' : 'none',
              borderLeft: [0, 2].includes(i) ? '2px solid #0ea5e9' : 'none',
              borderRight: [1, 3].includes(i) ? '2px solid #0ea5e9' : 'none',
            }} />
          ))}
          <div className="absolute inset-0 pointer-events-none scanning-line opacity-60" />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center hover:bg-[rgba(239,68,68,0.4)] transition-all"
          >
            <X size={13} className="text-white" />
          </button>
        </div>
      )}
      <div className="mt-4 flex gap-3">
        <button
          id="start-scan-btn"
          onClick={() => preview && onScanStart()}
          className={`btn-primary flex-1 justify-center ${!preview ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!preview}
        >
          <Zap size={15} /> Start AI Scan
        </button>
      </div>
    </div>
  );
};

// Live processing
const LiveProcessing = ({ scanning, progress, currentStep }) => {
  const steps = ['Detecting Face', 'Generating Embeddings', 'Searching Dataset', 'Deepfake Analysis', 'Compiling Results'];
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
        <Cpu size={16} className="text-[#8b5cf6]" /> Neural Processing
        {scanning && <span className="ml-auto flex items-center gap-1.5 text-xs text-[#0ea5e9]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] animate-pulse" />Live
        </span>}
      </h3>
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Analysis Progress</span>
          <span className="text-[#0ea5e9] font-semibold">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <div className="space-y-2.5">
        {steps.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep && scanning;
          return (
            <div key={step} className={`flex items-center gap-3 p-2.5 rounded-lg transition-all ${active ? 'bg-[rgba(14,165,233,0.08)] border border-[rgba(14,165,233,0.15)]' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                done ? 'bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)]'
                  : active ? 'bg-[rgba(14,165,233,0.15)] border border-[rgba(14,165,233,0.3)]'
                  : 'bg-[rgba(30,41,59,0.5)] border border-[rgba(51,65,85,0.5)]'
              }`}>
                {done ? <CheckCircle size={12} className="text-emerald-400" />
                  : active ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Cpu size={11} className="text-[#0ea5e9]" /></motion.div>
                  : <span className="text-[9px] text-slate-600">{i + 1}</span>}
              </div>
              <span className={`text-xs ${done ? 'text-emerald-400' : active ? 'text-white' : 'text-slate-600'}`}>{step}</span>
              {active && <span className="ml-auto text-[10px] text-[#0ea5e9] animate-pulse">Running...</span>}
              {done && <span className="ml-auto text-[10px] text-emerald-400">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Results panel
const ResultsPanel = ({ show }) => {
  const results = [
    { label: 'Similarity Score', value: '94.3%', color: '#ef4444', level: 94.3 },
    { label: 'Deepfake Probability', value: '87.1%', color: '#f59e0b', level: 87.1 },
    { label: 'Confidence Score', value: '96.8%', color: '#0ea5e9', level: 96.8 },
  ];

  if (!show) return (
    <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
      <Eye size={28} className="text-slate-700 mb-3" />
      <p className="text-sm text-slate-600">Upload an image and run a scan to see results</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Eye size={16} className="text-[#0ea5e9]" /> Detection Results
        </h3>
        <span className="threat-critical text-[10px] font-bold px-2 py-1 rounded-full">THREAT DETECTED</span>
      </div>

      <div className="space-y-4 mb-5">
        {results.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">{r.label}</span>
              <span className="font-bold" style={{ color: r.color }}>{r.value}</span>
            </div>
            <div className="progress-bar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${r.level}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="progress-fill"
                style={{ background: `linear-gradient(90deg, ${r.color}80, ${r.color})` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Matches Found', value: '7', icon: Database, color: '#ef4444' },
          { label: 'Threat Level', value: 'Critical', icon: AlertTriangle, color: '#f59e0b' },
          { label: 'Sources', value: '4 sites', icon: Activity, color: '#8b5cf6' },
          { label: 'Encrypted', value: 'AES-256', icon: Lock, color: '#10b981' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl p-3 text-center" style={{ background: `${item.color}0d`, border: `1px solid ${item.color}25` }}>
              <Icon size={14} className="mx-auto mb-1.5" style={{ color: item.color }} />
              <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}</div>
              <div className="text-[10px] text-slate-500">{item.label}</div>
            </div>
          );
        })}
      </div>

      <Link to="/report" id="view-report-btn" className="btn-primary w-full justify-center text-sm">
        <FileText size={14} /> View Full Evidence Report
      </Link>
    </motion.div>
  );
};

// Threat activity chart data
const chartData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  threats: Math.floor(Math.random() * 80) + 20,
  scans: Math.floor(Math.random() * 200) + 100,
}));

const DashboardPage = () => {
  const location = useLocation();
  const initialTab = new URLSearchParams(location.search).get('tab') || 'dashboard';
  const [active, setActive] = useState(initialTab);
  const [collapsed, setCollapsed] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const intervalRef = useRef(null);

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setCurrentStep(0);
    setShowResults(false);
    setActive('scan');

    let p = 0;
    let step = 0;
    intervalRef.current = setInterval(() => {
      p += 1.5;
      setProgress(Math.min(p, 100));
      const newStep = Math.floor((p / 100) * 5);
      if (newStep !== step) { step = newStep; setCurrentStep(step); }
      if (p >= 100) {
        clearInterval(intervalRef.current);
        setScanning(false);
        setCurrentStep(5);
        setShowResults(true);
      }
    }, 60);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <div className="flex h-screen bg-deep-black overflow-hidden">
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="glass border-b border-[rgba(14,165,233,0.12)] px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-lg font-bold text-white">
              {{ dashboard: 'Overview', scan: 'New Scan', threats: 'Threat Alerts', analytics: 'Analytics', settings: 'Settings' }[active] || 'Dashboard'}
            </h1>
            <p className="text-xs text-slate-500">DeepShield AI — Identity Protection Platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 border border-[rgba(14,165,233,0.15)]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span className="text-xs text-slate-300 font-medium">Systems Online</span>
            </div>
            <Link to="/" className="btn-secondary text-xs px-3 py-2">← Home</Link>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── THREATS VIEW ── */}
          {active === 'threats' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white">Active Threat Alerts</h2>
                <span className="threat-critical text-[10px] font-bold px-3 py-1 rounded-full">3 CRITICAL</span>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'DS-4891', title: 'Deepfake video detected — Social Media', platform: 'Social Media Platform', score: 94.3, risk: 'critical', time: '2 hours ago' },
                  { id: 'DS-4890', title: 'Face-swap image found on image board', platform: 'Image Board', score: 78.9, risk: 'high', time: '6 hours ago' },
                  { id: 'DS-4889', title: 'Identity exposure on data broker site', platform: 'Data Broker', score: 65.2, risk: 'medium', time: '1 day ago' },
                ].map((alert) => (
                  <div key={alert.id} className="glass-card rounded-xl p-5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${ alert.risk === 'critical' ? 'bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)]' : alert.risk === 'high' ? 'bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)]' : 'bg-[rgba(6,182,212,0.15)] border border-[rgba(6,182,212,0.3)]' }`}>
                      <AlertTriangle size={16} className={alert.risk === 'critical' ? 'text-red-400' : alert.risk === 'high' ? 'text-amber-400' : 'text-cyan-400'} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white mb-0.5">{alert.title}</div>
                      <div className="text-xs text-slate-500">{alert.platform} · {alert.time}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-bold px-2 py-0.5 rounded-full mb-1 ${ alert.risk === 'critical' ? 'threat-critical' : alert.risk === 'high' ? 'threat-high' : 'threat-medium' }`}>{alert.risk.toUpperCase()}</div>
                      <div className="text-xs text-slate-500">{alert.score}% match</div>
                    </div>
                    <Link to="/report" className="btn-primary text-xs px-3 py-2 ml-2">View</Link>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── ANALYTICS VIEW ── */}
          {active === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-base font-bold text-white mb-5">Threat & Scan Analytics</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Scans', value: '1,247', color: '#0ea5e9' },
                  { label: 'Threats Found', value: '89', color: '#ef4444' },
                  { label: 'Avg. Similarity', value: '72.4%', color: '#8b5cf6' },
                  { label: 'Reports Generated', value: '34', color: '#10b981' },
                ].map(s => (
                  <div key={s.label} className="glass-card rounded-xl p-4 text-center">
                    <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><BarChart3 size={15} className="text-[#0ea5e9]" /> 12-Month Activity</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                      <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#94a3b8' }} />
                    <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} fill="url(#gt)" dot={false} />
                    <Area type="monotone" dataKey="scans" stroke="#0ea5e9" strokeWidth={2} fill="url(#gs)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* ── SETTINGS VIEW ── */}
          {active === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-base font-bold text-white mb-5">Account Settings</h2>
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4">Profile</h3>
                  <div className="space-y-3">
                    {[{ label: 'Full Name', val: 'Alex Morgan' }, { label: 'Email', val: 'alex@example.com' }, { label: 'Plan', val: 'Pro — $29/mo' }].map(f => (
                      <div key={f.label}>
                        <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                        <input defaultValue={f.val} className="w-full px-3 py-2.5 rounded-lg text-sm" />
                      </div>
                    ))}
                    <button className="btn-primary w-full justify-center mt-2">Save Changes</button>
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-white mb-4">Notifications</h3>
                  <div className="space-y-3">
                    {['Email alerts for new threats', 'Weekly scan summary', 'Critical match SMS alerts', 'Product updates'].map(opt => (
                      <label key={opt} className="flex items-center justify-between cursor-pointer">
                        <span className="text-xs text-slate-300">{opt}</span>
                        <div className="w-9 h-5 rounded-full bg-[rgba(14,165,233,0.3)] border border-[rgba(14,165,233,0.4)] relative">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#0ea5e9] absolute top-0.5 right-0.5 shadow-glow-blue" />
                        </div>
                      </label>
                    ))}
                  </div>
                  <button className="btn-secondary w-full justify-center mt-4 text-xs">Manage Billing</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── DASHBOARD OVERVIEW ── */}
          {active === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Scans', value: '1,247', icon: ScanLine, color: '#0ea5e9', delta: '+12%' },
                  { label: 'Threats Found', value: '89', icon: AlertTriangle, color: '#ef4444', delta: '+3' },
                  { label: 'Protected IDs', value: '352', icon: Shield, color: '#10b981', delta: '+5%' },
                  { label: 'Avg. Score', value: '94.1%', icon: TrendingUp, color: '#8b5cf6', delta: '▲ 2.3%' },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                          <Icon size={15} style={{ color: s.color }} />
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: s.color }}>{s.delta}</span>
                      </div>
                      <div className="text-2xl font-black text-white mb-0.5">{s.value}</div>
                      <div className="text-xs text-slate-500">{s.label}</div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button onClick={() => setActive('scan')} className="btn-primary justify-center py-3"><ScanLine size={15} /> New Scan</button>
                <Link to="/report" className="btn-secondary justify-center py-3"><FileText size={15} /> View Reports</Link>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><BarChart3 size={15} className="text-[#0ea5e9]" /> Threat Activity (12 months)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="threats" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                      <linearGradient id="scans" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} /><stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} /></linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ background: '#0f1a2e', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 8, fontSize: 11 }} labelStyle={{ color: '#94a3b8' }} />
                    <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} fill="url(#threats)" dot={false} />
                    <Area type="monotone" dataKey="scans" stroke="#0ea5e9" strokeWidth={2} fill="url(#scans)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* ── SCAN VIEW ── */}
          {active === 'scan' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid lg:grid-cols-3 gap-5 mb-5">
                <div><ScanUploadPanel onScanStart={startScan} /></div>
                <div><LiveProcessing scanning={scanning} progress={progress} currentStep={currentStep} /></div>
                <div><ResultsPanel show={showResults} /></div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
// drag-drop scan upload
// live processing animation
// threat alerts analytics tabs
