import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import {
  UploadCloud,
  FileText,
  File,
  X,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  FileCheck2
} from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowed.includes(selectedFile.type.toLowerCase())) {
      setError('Unsupported file format. Please upload a PDF, PNG, or JPG file.');
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB upload limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a file to analyze.');
      return;
    }

    window.__pendingUploadFile = file;
    navigate('/processing', { state: { file, fileName: file.name } });
  };

  const handleSelectSample = (sampleKey, sampleName) => {
    navigate('/processing', { state: { sampleKey, sampleName } });
  };

  const scenarios = [
    {
      key: 'tax_notice',
      name: 'Income Tax Intimation u/s 143(1)',
      tag: 'HIGH RISK',
      color: 'text-[#FF5C6C] bg-[#FF5C6C]/10 border-[#FF5C6C]/30',
      desc: 'Assesses ₹24,850 tax discrepancy, 30-day response window, and statutory interest u/s 220(2).',
    },
    {
      key: 'gst_invoice',
      name: 'B2B GST Tax Invoice (Apex Tech)',
      tag: 'LOW RISK',
      color: 'text-[#25D9B5] bg-[#25D9B5]/10 border-[#25D9B5]/30',
      desc: '₹1,41,600 total with 18% IGST check, Net-15 terms, and TDS compliance u/s 194C.',
    },
    {
      key: 'bank_letter',
      name: 'SBI Home Loan Sanction Letter',
      tag: 'MEDIUM RISK',
      color: 'text-[#FFB84D] bg-[#FFB84D]/10 border-[#FFB84D]/30',
      desc: '₹65 Lakhs approval at 8.5% p.a., monthly EMI ₹56,432, 60-day acceptance window.',
    },
    {
      key: 'rent_agreement',
      name: '11-Month Residential Lease Agreement',
      tag: 'MEDIUM RISK',
      color: 'text-[#FFB84D] bg-[#FFB84D]/10 border-[#FFB84D]/30',
      desc: '₹32,000/mo rent, 6-month lock-in clause, and security deposit forfeiture terms.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-16">
      {/* Upload Header */}
      <section className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B8CFF]/10 border border-[#5B8CFF]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#5B8CFF]" />
          <span className="font-mono text-[11px] font-semibold text-[#5B8CFF] uppercase tracking-wider">
            INTELLIGENT UPLOAD
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.1]">
          Give DocuSaathi
          <br />
          <span className="text-gradient">something to understand.</span>
        </h1>
        <p className="font-sans text-sm sm:text-base text-[#9BA6B5] max-w-xl">
          Upload any legal, tax, or financial document. DocuSaathi runs multimodal extraction, checks calculations, flags risks, and extracts deadlines.
        </p>
      </section>

      {/* Demo Callout Pill */}
      <div className="p-5 rounded-2xl border border-[#7C5CFF]/30 bg-gradient-to-r from-[#7C5CFF]/10 via-[#111722] to-[#5B8CFF]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#25D9B5] animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#25D9B5] uppercase tracking-wider">
              HACKATHON DEMO MODE READY
            </span>
          </div>
          <p className="font-sans text-xs text-[#9BA6B5]">
            Want zero-lag live demonstration? Click below to immediately load our pre-verified GST notice.
          </p>
        </div>

        <button
          type="button"
          onClick={async () => {
            try {
              const demo = await api.getDemoSample();
              if (demo && demo.id) navigate(`/documents/${demo.id}`);
            } catch {
              handleSelectSample('tax_notice', 'Income Tax Intimation u/s 143(1)');
            }
          }}
          className="bg-white/05 hover:bg-white/10 text-[#F5F7FA] border border-white/15 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all shrink-0 hover:border-white/30"
        >
          [ INSTANT DEMO ]
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-[#FF5C6C]/30 bg-[#FF5C6C]/10 text-xs font-mono text-[#FF5C6C] flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Upload Zone */}
      <form onSubmit={handleAnalyze} className="space-y-6">
        <AnimatePresence mode="wait">
          {!file ? (
            /* Empty State */
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`rounded-3xl border-2 border-dashed p-12 sm:p-20 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                dragActive
                  ? 'bg-gradient-to-b from-[#5B8CFF]/15 to-[#7C5CFF]/10 border-[#5B8CFF] shadow-glow-blue/40'
                  : 'bg-[#111722]/80 border-white/15 hover:border-[#5B8CFF]/50 hover:bg-[#151C29] hover:shadow-glow-blue/15'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="space-y-6 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#5B8CFF]/20 to-[#7C5CFF]/20 border border-[#5B8CFF]/30 mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-10 h-10 text-[#5B8CFF] group-hover:text-white transition-colors" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F7FA]">
                    UPLOAD DOCUMENT
                  </h3>
                  <p className="font-sans text-sm text-[#9BA6B5]">
                    Drop your PDF or image here, or browse from computer
                  </p>
                </div>

                <div>
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-[#F5F7FA] px-6 py-3 rounded-xl font-sans text-xs uppercase font-semibold tracking-wider shadow-glow-blue/30 group-hover:shadow-glow-blue/60 transition-all">
                    CHOOSE FILE
                  </span>
                </div>

                <div className="pt-4 border-t border-white/05 font-mono text-[11px] text-[#9BA6B5]/60 uppercase tracking-wider">
                  SUPPORTED: PDF / JPG / PNG (UP TO 15MB)
                </div>
              </div>
            </motion.div>
          ) : (
            /* Selected File Preview */
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="glass-panel-elevated rounded-3xl p-8 sm:p-10 border border-[#5B8CFF]/40 space-y-8 shadow-glow-blue/20"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#5B8CFF]/15 border border-[#5B8CFF]/30 flex items-center justify-center">
                    <FileCheck2 className="w-7 h-7 text-[#5B8CFF]" />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#25D9B5] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> READY FOR PARSING
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F5F7FA] mt-1 break-all">
                      {file.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="p-2 rounded-xl bg-white/05 hover:bg-[#FF5C6C]/20 text-[#9BA6B5] hover:text-[#FF5C6C] border border-white/10 transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* File details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#070A0F]/60 border border-white/05">
                  <span className="text-[#9BA6B5] block mb-1">FILE SIZE</span>
                  <span className="text-[#F5F7FA] font-bold text-sm">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#070A0F]/60 border border-white/05">
                  <span className="text-[#9BA6B5] block mb-1">MIME TYPE</span>
                  <span className="text-[#F5F7FA] font-bold uppercase text-sm truncate block">
                    {file.type || 'DOCUMENT'}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#070A0F]/60 border border-white/05 col-span-2 sm:col-span-1">
                  <span className="text-[#9BA6B5] block mb-1">PIPELINE ENGINE</span>
                  <span className="text-[#5B8CFF] font-bold text-sm">
                    GEMINI FLASH + AUDIT
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="font-mono text-xs uppercase tracking-wider text-[#FF5C6C] hover:underline"
                >
                  Remove Document
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-[#F5F7FA] px-8 py-4 rounded-xl font-sans text-sm font-semibold tracking-wide shadow-glow-blue/40 hover:shadow-glow-blue/60 transition-all flex items-center justify-center gap-2"
                >
                  <span>ANALYZE DOCUMENT NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Pre-loaded evaluation scenarios */}
      <section className="space-y-6 pt-6 border-t border-white/10">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#5B8CFF] block font-semibold mb-1">
            PRE-LOADED EVALUATION SUITE
          </span>
          <h2 className="font-display text-2xl font-bold text-[#F5F7FA]">
            Instant Indian paperwork benchmarks.
          </h2>
          <p className="font-sans text-xs text-[#9BA6B5] mt-1">
            Click any scenario to test the autonomous multi-step pipeline without picking a local file:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((item) => (
            <motion.div
              key={item.key}
              whileHover={{ y: -3 }}
              onClick={() => handleSelectSample(item.key, item.name)}
              className="p-5 rounded-2xl glass-panel border border-white/05 hover:border-[#5B8CFF]/40 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${item.color}`}>
                  {item.tag}
                </span>
                <span className="font-mono text-[11px] text-[#5B8CFF] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  RUN AUDIT →
                </span>
              </div>

              <h3 className="font-display font-bold text-base text-[#F5F7FA] group-hover:text-white transition-colors">
                {item.name}
              </h3>

              <p className="font-sans text-xs text-[#9BA6B5] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
