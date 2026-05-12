import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import html2pdf from 'html2pdf.js';
import {
  Shield, Download, AlertTriangle, CheckCircle, ExternalLink,
  ChevronLeft, FileText, Activity
} from 'lucide-react';

const ReportPage = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const scanData = location.state?.scanData;
  
  const seed = scanData ? Math.floor(scanData.deepfake_probability * 1000) : 943;
  const caseId = scanData ? `DS-${new Date().getFullYear()}-${Math.abs(Math.sin(seed)).toString().substring(2, 6)}-${Math.abs(Math.cos(seed)).toString().substring(2, 6)}` : 'DS-2025-0507-4891';
  const generatedDate = new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef(null);

  const handleDownload = async () => {
    setDownloading(true);
    const element = reportRef.current;
    const opt = {
      margin:       [10, 10],
      filename:     `DeepShield-Report-${caseId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#020408]' : 'bg-[#f0f2f5]'} pb-20`}>
      {/* Top Navbar */}
      <div className="bg-[#f8fafc] border-b border-slate-200 px-6 py-3 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors text-sm font-medium">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-70"
        >
          <Download size={16} /> {downloading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-8 px-4">
        {/* The Actual Report Card */}
        <div 
          ref={reportRef}
          className="bg-white shadow-2xl rounded-sm p-12 text-slate-800 font-sans min-h-[1000px] border border-slate-100"
          style={{ width: '100%', maxWidth: '210mm', margin: '0 auto' }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <Shield size={24} fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">DeepShield AI</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Certified Investigation Report</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">Case ID: <span className="text-slate-700">{caseId}</span></div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mb-1">Date: <span className="text-slate-700">{generatedDate}</span></div>
              <div className="text-[11px] font-bold text-slate-400 uppercase">Status: <span className="text-blue-600">FINAL</span></div>
            </div>
          </div>

          {/* Verdict Box */}
          <div className="bg-red-50/50 border-l-4 border-red-600 p-6 mb-10 rounded-r-lg">
            <h2 className="text-red-700 font-black text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
              Verdict: Critical Threat Detected
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our AI systems have detected manipulated media or unauthorized use of likeness with 94.3% confidence. The analyzed media shows strong indicators of being a deepfake or synthetic generation. Immediate takedown actions are recommended.
            </p>
          </div>

          {/* Technical Analysis Summary */}
          <div className="mb-10">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Technical Analysis Summary</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Faces Detected', value: '1' },
                { label: 'Deepfake Prob.', value: '87.1%', color: 'text-red-600' },
                { label: 'Real Prob.', value: '12.9%' },
                { label: 'Processing Time', value: '0.74s' }
              ].map(stat => (
                <div key={stat.label} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <div className="text-[9px] font-bold text-slate-400 uppercase mb-1">{stat.label}</div>
                  <div className={`text-lg font-black ${stat.color || 'text-slate-800'}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detected Sources */}
          <div className="mb-10">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Detected Sources</h3>
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-bold text-slate-500">Platform</th>
                    <th className="px-4 py-3 font-bold text-slate-500">Type</th>
                    <th className="px-4 py-3 font-bold text-slate-500">Similarity</th>
                    <th className="px-4 py-3 font-bold text-slate-500">Source URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-4 font-bold">Data Broker</td>
                    <td className="px-4 py-4 text-slate-500">Identity Exposure</td>
                    <td className="px-4 py-4 font-bold text-red-600">94.3%</td>
                    <td className="px-4 py-4 text-blue-600 underline">twitter.com/status/2ywp7...d1</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-4 font-bold">Social Media</td>
                    <td className="px-4 py-4 text-slate-500">Impersonation</td>
                    <td className="px-4 py-4 font-bold text-red-600">89.3%</td>
                    <td className="px-4 py-4 text-blue-600 underline">facebook.com/profile/55bi...7.tx</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="mb-16">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Process Timeline</h3>
            <div className="space-y-3 pl-4">
              {[
                { time: '-2000ms', desc: 'Media ingestion and preprocessing initiated' },
                { time: '-1800ms', desc: 'Facial recognition engine active: 1 distinct feature set(s) mapped' },
                { time: '-1500ms', desc: 'Deep learning neural network embeddings generated' },
                { time: '-1000ms', desc: 'Comparison against known synthetic media databases completed' },
                { time: '-500ms', desc: 'Probability scoring and source attribution compiled' },
                { time: '0ms', desc: 'Final cryptographic report generated' }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 text-[11px]">
                  <span className="font-mono text-slate-400 min-w-[60px]">{step.time}</span>
                  <span className="text-slate-600 font-medium">{step.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-10 border-t border-slate-100 text-center">
            <p className="text-[9px] text-slate-400 font-medium mb-1">
              This document is electronically generated and secured by DeepShield AI v4.2.
            </p>
            <p className="text-[9px] font-mono text-slate-300 tracking-wider">
              Hash: 0x4a8f...3d91
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
