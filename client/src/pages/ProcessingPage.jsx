import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  ShieldCheck,
  Calendar,
  ListOrdered,
  Scan
} from 'lucide-react';

export default function ProcessingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');

  const processingNodes = [
    { id: 1, label: 'Document Uploaded', desc: 'In-memory buffer verification', icon: FileText },
    { id: 2, label: 'Classifying Document', desc: 'Determining legal jurisdiction & form', icon: Layers },
    { id: 3, label: 'Extracting Entities', desc: 'Amounts, dates, PAN & GSTIN parsing', icon: Cpu },
    { id: 4, label: 'Running Validation', desc: 'Deterministic math & line-item parity audit', icon: ShieldCheck },
    { id: 5, label: 'Analyzing Risks', desc: 'Statutory interest, late fees & non-compliance', icon: Sparkles },
    { id: 6, label: 'Finding Deadlines', desc: 'Timeline synthesis & countdown calculation', icon: Calendar },
    { id: 7, label: 'Building Action Plan', desc: 'Sequencing numbered procedural steps', icon: ListOrdered },
  ];

  useEffect(() => {
    let isMounted = true;

    async function process() {
      const state = location.state;
      if (!state) {
        navigate('/upload');
        return;
      }

      setCurrentStep(1);

      try {
        setTimeout(() => {
          if (isMounted) setCurrentStep(2);
        }, 400);

        let response;
        if (state.sampleKey) {
          response = await api.uploadDemoSample(state.sampleKey);
        } else {
          const selectedFile = state.file || (typeof window !== 'undefined' && window.__pendingUploadFile);
          if (!selectedFile) {
            throw new Error('No document file was detected. Please return to the upload screen.');
          }

          const formData = new FormData();
          formData.append('file', selectedFile);
          response = await api.uploadDocument(formData);
          if (typeof window !== 'undefined') {
            window.__pendingUploadFile = null;
          }
        }

        if (response && response.success === false) {
          throw new Error(response.error || response.message || 'AI document analysis failed');
        }

        if (isMounted) setCurrentStep(3);

        setTimeout(() => {
          if (isMounted) setCurrentStep(4);
        }, 600);

        setTimeout(() => {
          if (isMounted) setCurrentStep(5);
        }, 1100);

        setTimeout(() => {
          if (isMounted) setCurrentStep(6);
        }, 1600);

        setTimeout(() => {
          if (isMounted) setCurrentStep(7);
        }, 2100);

        setTimeout(() => {
          if (isMounted && response?.document?.id) {
            navigate(`/documents/${response.document.id}`);
          }
        }, 2800);

      } catch (err) {
        if (isMounted) {
          const errDetail =
            err.response?.data?.error ||
            err.response?.data?.message ||
            err.message ||
            'Document analysis failed';
          setError(errDetail);
        }
      }
    }

    process();

    return () => {
      isMounted = false;
    };
  }, [location.state, navigate]);

  const progressPercent = Math.min(100, Math.round((currentStep / 7) * 100));

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-16">
      {/* Header */}
      <section className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B8CFF]/10 border border-[#5B8CFF]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#5B8CFF] animate-spin" />
          <span className="font-mono text-[11px] font-semibold text-[#5B8CFF] uppercase tracking-wider">
            MULTIMODAL NEURAL AUDIT
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.1]">
          Reading between
          <br />
          <span className="text-gradient">the lines.</span>
        </h1>
        <p className="font-sans text-sm text-[#9BA6B5] max-w-md mx-auto">
          Extracting text, verifying arithmetic, detecting penalties, and synthesizing compliance deadlines.
        </p>
      </section>

      {error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl border border-[#FF5C6C]/40 bg-[#FF5C6C]/10 space-y-5 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FF5C6C]/20 border border-[#FF5C6C]/40 flex items-center justify-center mx-auto text-[#FF5C6C]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C6C] font-bold block">
              PROCESSING HALTED
            </span>
            <p className="font-sans text-sm text-[#F5F7FA]">
              {error}
            </p>
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="bg-white/10 hover:bg-white/20 text-[#F5F7FA] border border-white/20 px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors"
          >
            RETURN TO UPLOAD
          </button>
        </motion.div>
      ) : (
        <div className="space-y-10">
          {/* Central Animated Document Visualizer */}
          <div className="relative flex items-center justify-center py-6">
            <div className="absolute w-64 h-64 bg-gradient-to-tr from-[#5B8CFF]/20 to-[#7C5CFF]/20 rounded-full blur-2xl animate-pulse" />

            <div className="relative w-44 h-56 rounded-2xl glass-panel-elevated border border-[#5B8CFF]/40 shadow-glow-blue/40 flex flex-col justify-between p-4 overflow-hidden">
              {/* Animated Scan Beam */}
              <motion.div
                animate={{ y: [0, 190, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#5B8CFF] to-transparent shadow-[0_0_15px_#5B8CFF]"
              />

              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <FileText className="w-5 h-5 text-[#5B8CFF]" />
                <span className="font-mono text-[9px] text-[#25D9B5] uppercase">ANALYZING</span>
              </div>

              <div className="space-y-1.5 opacity-60">
                <div className="h-1.5 bg-white/20 rounded w-full" />
                <div className="h-1.5 bg-white/20 rounded w-3/4" />
                <div className="h-1.5 bg-white/20 rounded w-5/6" />
                <div className="h-1.5 bg-white/20 rounded w-1/2" />
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#9BA6B5]">
                <span>GEMINI 1.5</span>
                <span className="text-[#5B8CFF] font-bold">{progressPercent}%</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 max-w-md mx-auto">
            <div className="flex justify-between font-mono text-xs text-[#9BA6B5]">
              <span>PIPELINE PROGRESS</span>
              <span className="text-[#5B8CFF] font-semibold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-[#070A0F] rounded-full overflow-hidden border border-white/05">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] shadow-glow-blue"
              />
            </div>
          </div>

          {/* Sequential Nodes List */}
          <div className="glass-panel rounded-2xl border border-white/10 p-6 divide-y divide-white/05">
            {processingNodes.map((node) => {
              const isPast = currentStep > node.id;
              const isCurrent = currentStep === node.id;
              const isFuture = currentStep < node.id;
              const Icon = node.icon;

              return (
                <div
                  key={node.id}
                  className={`py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 transition-all ${
                    isCurrent
                      ? 'opacity-100 scale-[1.01]'
                      : isPast
                      ? 'opacity-75'
                      : 'opacity-30'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isPast
                          ? 'bg-[#25D9B5]/15 text-[#25D9B5] border border-[#25D9B5]/30'
                          : isCurrent
                          ? 'bg-[#5B8CFF]/20 text-[#5B8CFF] border border-[#5B8CFF]/50 shadow-glow-blue/40 animate-pulse'
                          : 'bg-white/05 text-[#9BA6B5] border border-white/05'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <h4
                        className={`font-sans text-sm font-semibold truncate ${
                          isCurrent
                            ? 'text-white'
                            : isPast
                            ? 'text-[#F5F7FA]'
                            : 'text-[#9BA6B5]'
                        }`}
                      >
                        {node.label}
                      </h4>
                      <p className="font-mono text-[11px] text-[#9BA6B5] truncate">
                        {node.desc}
                      </p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 font-mono text-xs">
                    {isPast ? (
                      <span className="text-[#25D9B5] flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> DONE
                      </span>
                    ) : isCurrent ? (
                      <span className="text-[#5B8CFF] flex items-center gap-1.5 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#5B8CFF] animate-ping" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-[#9BA6B5]/40">PENDING</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
