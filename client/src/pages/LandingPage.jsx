import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  FileText,
  Play,
  Cpu,
  Zap,
  TrendingUp,
  Layers,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage() {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const handleTryDemo = async () => {
    loginAsDemo();
    try {
      const demo = await api.getDemoSample();
      if (demo && demo.id) {
        navigate(`/documents/${demo.id}`);
        return;
      }
    } catch (e) {
      console.warn('Demo sample note:', e);
    }
    navigate('/dashboard');
  };

  const handleAnalyze = () => {
    if (user) {
      navigate('/upload');
    } else {
      loginAsDemo();
      navigate('/upload');
    }
  };

  const trustLabels = [
    'GST INVOICES',
    'INCOME TAX NOTICES',
    'BANK SANCTION LETTERS',
    'UTILITY BILLS',
    'LEASE AGREEMENTS',
    'CREDIT STATEMENTS',
    'CUSTOMS NOTICES',
    'AUDIT SUMMONS'
  ];

  const steps = [
    {
      num: '01',
      title: 'UPLOAD',
      short: 'In-memory multi-format ingestion',
      desc: 'Drop any PDF, scanned JPG, or PNG. Processed in-memory with zero permanent retention.'
    },
    {
      num: '02',
      title: 'UNDERSTAND',
      short: 'Multimodal semantic classification',
      desc: 'Gemini multimodal neural networks classify document type, jurisdiction, and governing body.'
    },
    {
      num: '03',
      title: 'EXTRACT',
      short: 'High-precision entity resolution',
      desc: 'Pulls PAN, GSTIN, monetary totals, dates, and reference codes into normalized structures.'
    },
    {
      num: '04',
      title: 'VALIDATE',
      short: 'Deterministic arithmetic audit',
      desc: 'Runs cross-math parity checks and line-item integrity audits to catch discrepancies.'
    },
    {
      num: '05',
      title: 'IDENTIFY',
      short: 'Statutory liability & risk assessment',
      desc: 'Flags escalating interest clauses, late fees, and non-compliance penalties instantly.'
    },
    {
      num: '06',
      title: 'ACT',
      short: 'Sequenced execution roadmap',
      desc: 'Translates legalese into numbered, prioritized actions you can complete right away.'
    }
  ];

  return (
    <div className="space-y-28 sm:space-y-36 pb-20 overflow-hidden">
      {/* ==================================================
          1. HERO SECTION
          ================================================== */}
      <section className="relative pt-6 sm:pt-12">
        {/* Soft radial background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#5B8CFF]/15 via-[#7C5CFF]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* LEFT COLUMN: Eyebrow, Heading, Copy, Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B8CFF]/10 border border-[#5B8CFF]/25 shadow-glow-blue/20">
              <span className="w-2 h-2 rounded-full bg-[#5B8CFF] animate-pulse" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#5B8CFF]">
                AI-POWERED DOCUMENT INTELLIGENCE
              </span>
            </div>

            {/* Large Heading */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.08]">
              Turn every document
              <br />
              into your{' '}
              <span className="text-gradient">
                next action.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="font-sans text-base sm:text-lg text-[#9BA6B5] max-w-xl leading-relaxed">
              Upload a bill, invoice, tax notice or important document. DocuSaathi understands it, checks it, finds what matters and tells you what to do next.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                className="bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-[#F5F7FA] font-sans font-semibold px-7 py-3.5 rounded-xl shadow-glow-blue/30 hover:shadow-glow-blue/50 flex items-center justify-center gap-2.5 transition-all text-sm tracking-wide"
              >
                <span>ANALYZE A DOCUMENT</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTryDemo}
                className="glass-panel text-[#F5F7FA] hover:text-white font-sans font-medium px-6 py-3.5 rounded-xl border border-white/10 hover:border-white/20 flex items-center justify-center gap-2 transition-all text-sm"
              >
                <Play className="w-4 h-4 text-[#5B8CFF] fill-[#5B8CFF]/20" />
                <span>TRY DEMO MODE</span>
              </motion.button>
            </div>

            {/* Trust specs */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 font-mono text-xs text-[#9BA6B5]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D9B5]" /> PDF, JPG, PNG
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D9B5]" /> INDIAN TAX & GST READY
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#25D9B5]" /> ZERO DATA RETENTION
              </span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Realistic Document Card + Floating Insight Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Central Realistic Document Card */}
              <div className="glass-panel-elevated p-6 sm:p-7 rounded-2xl border border-white/10 shadow-2xl shadow-black/80 space-y-5 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#5B8CFF]/15 border border-[#5B8CFF]/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#5B8CFF]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BA6B5] block">
                        AUTHENTICATED NOTICE
                      </span>
                      <h4 className="font-display font-bold text-base text-[#F5F7FA]">
                        GST TAX NOTICE DRC-01
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF5C6C]/15 text-[#FF5C6C] border border-[#FF5C6C]/30 font-semibold animate-pulse">
                    HIGH RISK
                  </span>
                </div>

                {/* Body Details */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between p-2.5 rounded-lg bg-[#070A0F]/60 border border-white/05">
                    <span className="text-[#9BA6B5]">ASSESSMENT NO.</span>
                    <span className="text-[#F5F7FA] font-semibold">GST-2026-1834</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-[#070A0F]/60 border border-white/05">
                    <span className="text-[#9BA6B5]">ISSUING AUTHORITY</span>
                    <span className="text-[#F5F7FA] font-semibold">CENTRAL BOARD OF TAXES</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-[#070A0F]/60 border border-white/05">
                    <span className="text-[#9BA6B5]">DISCREPANCY AMOUNT</span>
                    <span className="text-[#25D9B5] font-bold text-sm">₹12,450.00</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-lg bg-[#070A0F]/60 border border-white/05">
                    <span className="text-[#9BA6B5]">STATUTORY DEADLINE</span>
                    <span className="text-[#FF5C6C] font-bold">18 OCT 2026</span>
                  </div>
                </div>

                {/* Bottom Status pill */}
                <div className="p-3 rounded-xl bg-[#5B8CFF]/10 border border-[#5B8CFF]/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#9BA6B5]">AI Validation Audit</span>
                  <span className="text-[#5B8CFF] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 100% PARITY
                  </span>
                </div>
              </div>

              {/* FLOATING INSIGHT CARD 1: AI SUMMARY */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-6 -left-6 sm:-left-10 z-20 glass-panel p-3.5 rounded-xl border border-[#5B8CFF]/40 shadow-xl shadow-black/60 flex items-center gap-3 backdrop-blur-xl animate-float-slow"
              >
                <div className="w-8 h-8 rounded-lg bg-[#5B8CFF]/20 flex items-center justify-center text-[#5B8CFF]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#9BA6B5] block uppercase">AI SUMMARY</span>
                  <span className="font-display font-bold text-sm text-[#F5F7FA]">₹12,450 Due</span>
                </div>
              </motion.div>

              {/* FLOATING INSIGHT CARD 2: DEADLINE */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -top-4 -right-4 sm:-right-8 z-20 glass-panel p-3.5 rounded-xl border border-[#FF5C6C]/40 shadow-xl shadow-black/60 flex items-center gap-3 backdrop-blur-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF5C6C]/20 flex items-center justify-center text-[#FF5C6C]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#9BA6B5] block uppercase">DEADLINE</span>
                  <span className="font-display font-bold text-sm text-[#FF5C6C]">18 OCT</span>
                </div>
              </motion.div>

              {/* FLOATING INSIGHT CARD 3: RISK */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -bottom-6 -left-4 sm:-left-8 z-20 glass-panel p-3.5 rounded-xl border border-[#FF5C6C]/40 shadow-xl shadow-black/60 flex items-center gap-3 backdrop-blur-xl"
              >
                <div className="w-8 h-8 rounded-lg bg-[#FF5C6C]/20 flex items-center justify-center text-[#FF5C6C]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#9BA6B5] block uppercase">RISK</span>
                  <span className="font-display font-bold text-sm text-[#FF5C6C]">HIGH RISK</span>
                </div>
              </motion.div>

              {/* FLOATING INSIGHT CARD 4: ACTION */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="absolute -bottom-8 -right-4 sm:-right-8 z-20 glass-panel p-3.5 rounded-xl border border-[#25D9B5]/40 shadow-xl shadow-black/60 flex items-center gap-3 backdrop-blur-xl animate-float-medium"
              >
                <div className="w-8 h-8 rounded-lg bg-[#25D9B5]/20 flex items-center justify-center text-[#25D9B5]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#9BA6B5] block uppercase">ACTION</span>
                  <span className="font-display font-semibold text-xs text-[#25D9B5]">Respond before deadline</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================================================
          2. SOCIAL PROOF / TRUST STRIP
          ================================================== */}
      <section className="relative border-y border-white/05 py-6 bg-[#0D1117]/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
          <div className="shrink-0 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5B8CFF]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#9BA6B5] font-semibold">
              BUILT FOR EVERYDAY DOCUMENTS
            </span>
          </div>

          <div className="w-full overflow-hidden relative">
            <div className="flex items-center gap-3 animate-marquee whitespace-nowrap">
              {trustLabels.concat(trustLabels).map((label, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-lg bg-white/03 border border-white/05 text-[11px] font-mono text-[#F5F7FA] tracking-wider uppercase inline-block"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          3. HOW IT WORKS: "From document to decision."
          ================================================== */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-[#5B8CFF] block font-semibold">
            AUTONOMOUS PROCESSING PIPELINE
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F5F7FA]">
            From document
            <br />
            <span className="text-gradient">to decision.</span>
          </h2>
          <p className="font-sans text-sm text-[#9BA6B5]">
            Hover each stage of the multi-agent neural pipeline to inspect autonomous verification.
          </p>
        </div>

        {/* 6 Horizontal interactive steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {steps.map((st, i) => {
            const isSelected = activeStep === i;

            return (
              <motion.div
                key={i}
                onMouseEnter={() => setActiveStep(i)}
                whileHover={{ y: -4 }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#151C29] border-[#5B8CFF]/50 shadow-glow-blue/20'
                    : 'bg-[#111722] border-white/05 hover:border-white/20'
                }`}
              >
                {/* Step Top */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-black text-[#5B8CFF]">
                      {st.num}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isSelected ? 'bg-[#5B8CFF] shadow-glow-blue' : 'bg-white/10'
                      }`}
                    />
                  </div>
                  <h3 className="font-display font-bold text-sm tracking-wider uppercase text-[#F5F7FA]">
                    {st.title}
                  </h3>
                  <p className="font-sans text-xs text-[#9BA6B5] leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/05">
                  <span className="font-mono text-[10px] text-[#5B8CFF] uppercase tracking-wider block">
                    {st.short}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==================================================
          4. AI INTELLIGENCE SECTION: "Not OCR. Understanding."
          ================================================== */}
      <section className="relative rounded-3xl border border-white/10 bg-[#0D1117] p-8 sm:p-14 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C5CFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs uppercase tracking-widest text-[#7C5CFF] block font-semibold">
              COGNITIVE REASONING
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F5F7FA] leading-tight">
              Not OCR.
              <br />
              <span className="text-gradient">Understanding.</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#9BA6B5] leading-relaxed">
              Standard optical character recognition reads characters like dumb pixels. DocuSaathi combines Google’s Gemini multimodal reasoning with a deterministic math engine to comprehend liabilities, cross-verify calculations, and synthesize deadlines.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAnalyze}
                className="bg-white/05 hover:bg-white/10 text-[#F5F7FA] border border-white/10 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-semibold transition-all flex items-center gap-2"
              >
                <span>TEST WITH A REAL DOCUMENT</span>
                <ChevronRight className="w-4 h-4 text-[#5B8CFF]" />
              </button>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* TRADITIONAL OCR */}
            <div className="p-6 rounded-2xl bg-[#070A0F]/60 border border-white/05 space-y-4 opacity-75">
              <div className="font-mono text-xs uppercase text-[#9BA6B5] tracking-wider font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                TRADITIONAL OCR
              </div>
              <ul className="space-y-3 font-mono text-xs text-[#9BA6B5]">
                <li className="flex items-center gap-2">
                  <span className="text-white/30">→</span> extracts raw text
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span className="text-white/30">✕</span> no semantic meaning
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span className="text-white/30">✕</span> ignores arithmetic errors
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span className="text-white/30">✕</span> misses hidden penalties
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span className="text-white/30">✕</span> zero guidance on next steps
                </li>
              </ul>
            </div>

            {/* DOCUSAATHI */}
            <div className="p-6 rounded-2xl bg-[#111722] border border-[#5B8CFF]/40 space-y-4 shadow-glow-blue/20 relative">
              <div className="absolute -top-3 -right-2 px-2.5 py-0.5 rounded-full bg-[#5B8CFF] text-[10px] font-mono text-white font-bold uppercase tracking-wider">
                INTELLIGENT
              </div>
              <div className="font-mono text-xs uppercase text-[#5B8CFF] tracking-wider font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5B8CFF]" />
                DOCUSAATHI
              </div>
              <ul className="space-y-3 font-sans text-xs text-[#F5F7FA]">
                <li className="flex items-center gap-2 text-[#25D9B5] font-semibold">
                  <span>✓</span> understands context & intent
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#5B8CFF]">✓</span> validates mathematical values
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#5B8CFF]">✓</span> detects statutory risks
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#5B8CFF]">✓</span> finds critical deadlines
                </li>
                <li className="flex items-center gap-2 text-[#25D9B5] font-semibold">
                  <span>✓</span> creates structured action plans
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          5. DOCUMENT ANALYSIS SHOWCASE
          ================================================== */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#25D9B5] block font-semibold mb-1">
              INTERACTIVE DEMO BENCHMARK
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F5F7FA]">
              Document analysis showcase.
            </h2>
          </div>
          <button
            type="button"
            onClick={handleTryDemo}
            className="text-xs font-mono text-[#5B8CFF] hover:underline uppercase tracking-wider flex items-center gap-1.5"
          >
            <span>LOAD INTERACTIVE WORKBENCH</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Large mock document analysis panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Document preview */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/05 pb-3">
                <span className="font-mono text-xs text-[#9BA6B5] uppercase">DOCUMENT SOURCE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/05 text-[#9BA6B5]">PDF SCAN</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070A0F] border border-white/05 font-mono text-xs text-[#9BA6B5] space-y-2 leading-relaxed">
                <p className="text-white font-semibold">FORM DRC-01 [SECTION 73]</p>
                <p>Tax Period: 2024-25 | Demand Notice Reference: DRC01-DL-8832</p>
                <p className="text-[#9BA6B5]/70">"You are hereby required to file a formal explanation or remit the assessed difference of ₹12,450 along with applicable interest under Sec 50 within 30 days of this notice."</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/05 flex items-center justify-between text-xs font-mono text-[#9BA6B5]">
              <span>ISSUER: ABC TAX DEPARTMENT</span>
              <span className="text-[#25D9B5]">VERIFIED PARITY</span>
            </div>
          </div>

          {/* Right: AI Analysis Panel */}
          <div className="lg:col-span-7 glass-panel-elevated p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#070A0F] border border-white/05">
                <span className="font-mono text-[10px] text-[#9BA6B5] uppercase block mb-1">DOCUMENT TYPE</span>
                <span className="font-display font-bold text-sm text-[#F5F7FA]">GST TAX NOTICE</span>
              </div>
              <div className="p-4 rounded-xl bg-[#070A0F] border border-white/05">
                <span className="font-mono text-[10px] text-[#9BA6B5] uppercase block mb-1">RISK LEVEL</span>
                <span className="font-display font-bold text-sm text-[#FF5C6C] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5C6C] animate-ping" /> HIGH RISK
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#070A0F] border border-white/05">
                <span className="font-mono text-[10px] text-[#9BA6B5] uppercase block mb-1">CUTOFF DEADLINE</span>
                <span className="font-display font-bold text-sm text-[#5B8CFF]">18 OCT 2026</span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 p-4 rounded-xl bg-[#5B8CFF]/05 border border-[#5B8CFF]/20">
              <span className="font-mono text-[10px] text-[#5B8CFF] uppercase font-bold tracking-wider">AI SUMMARY</span>
              <p className="font-sans text-sm text-[#F5F7FA] leading-relaxed">
                A formal response or settlement is required before the statutory deadline to prevent interest compounding under Section 50.
              </p>
            </div>

            {/* Action plan */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#9BA6B5] uppercase font-bold tracking-wider block">
                SEQUENTIAL ACTION PLAN
              </span>
              <div className="space-y-2 font-sans text-xs">
                <div className="p-3 rounded-lg bg-[#070A0F] border border-white/05 flex items-center gap-3">
                  <span className="font-mono font-bold text-[#5B8CFF]">01</span>
                  <span className="text-[#F5F7FA]">Review notice reference and reconcile ITC mismatch</span>
                </div>
                <div className="p-3 rounded-lg bg-[#070A0F] border border-white/05 flex items-center gap-3">
                  <span className="font-mono font-bold text-[#5B8CFF]">02</span>
                  <span className="text-[#F5F7FA]">Verify outstanding liability against GSTR-3B filings</span>
                </div>
                <div className="p-3 rounded-lg bg-[#070A0F] border border-white/05 flex items-center gap-3">
                  <span className="font-mono font-bold text-[#5B8CFF]">03</span>
                  <span className="text-[#F5F7FA]">File formal electronic reply before 18 Oct 2026 cutoff</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          6. BOTTOM CALL TO ACTION
          ================================================== */}
      <section className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-[#111722] via-[#151C29] to-[#111722] p-8 sm:p-14 text-center space-y-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5B8CFF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-[#5B8CFF] font-semibold">
            READY FOR INTELLIGENT COMPLIANCE
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F5F7FA]">
            Take the anxiety out of paperwork.
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#9BA6B5]">
            Upload your first document in seconds. Zero installations, zero credit card requirements.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              className="w-full sm:w-auto bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-[#F5F7FA] font-sans font-semibold px-8 py-4 rounded-xl shadow-glow-blue/40 hover:shadow-glow-blue/60 transition-all text-sm tracking-wide"
            >
              ANALYZE A DOCUMENT NOW
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleTryDemo}
              className="w-full sm:w-auto glass-panel text-[#F5F7FA] font-sans font-medium px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 transition-all text-sm"
            >
              EXPLORE PRE-LOADED SAMPLES
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
}
