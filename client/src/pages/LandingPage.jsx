import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function LandingPage() {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="space-y-24 sm:space-y-36">
      {/* Hero Section */}
      <section className="pt-4 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-3">
                01 — DOCUSAATHI
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#101B2D] leading-[1.08]">
                Understand your
                <br />
                documents. Know what
                <br />
                <span className="italic font-normal text-[#3158A8]">to do next.</span>
              </h1>
            </div>

            <p className="font-mono text-xs sm:text-sm text-[#70716D] max-w-xl leading-relaxed">
              DocuSaathi transforms complex documents into clear explanations, structured information, risks, deadlines and actionable next steps.
            </p>

            {/* Editorial Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleAnalyze}
                className="bg-[#101B2D] hover:bg-[#1B2C47] text-[#F1EBDD] px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-widest text-center transition-all hover:translate-y-[-1px]"
              >
                [ ANALYZE A DOCUMENT ]
              </button>

              <button
                type="button"
                onClick={handleTryDemo}
                className="bg-transparent hover:bg-[#E8E0D2] text-[#101B2D] border border-[#101B2D] px-7 py-3.5 rounded-sm font-mono text-xs uppercase tracking-widest text-center transition-all hover:translate-y-[-1px]"
              >
                [ TRY DEMO ]
              </button>
            </div>

            <div className="pt-4 border-t border-[#D5CEC1] flex items-center gap-6 font-mono text-[11px] text-[#70716D]">
              <span>PDF / PNG / JPG</span>
              <span>•</span>
              <span>INCOME TAX & GST READY</span>
              <span>•</span>
              <span>ZERO DATA RETENTION</span>
            </div>
          </div>

          {/* Right Column: Carefully Typeset Document Preview */}
          <div className="lg:col-span-5">
            <div className="border border-[#D5CEC1] bg-[#FAF8F2] p-6 sm:p-8 space-y-6 shadow-[2px_2px_0px_0px_#D5CEC1]">
              {/* Document Header */}
              <div className="border-b border-[#D5CEC1] pb-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#70716D] block">
                    DOCUMENT PREVIEW
                  </span>
                  <span className="font-serif text-lg font-bold text-[#101B2D]">
                    GST TAX NOTICE
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border text-[#8B2626] border-[#8B2626]/40 bg-[#8B2626]/5">
                  HIGH RISK
                </span>
              </div>

              {/* Document Metadata Table */}
              <div className="divide-y divide-[#D5CEC1] font-mono text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#70716D]">REFERENCE NO.</span>
                  <span className="text-[#101B2D] font-bold">GST-2026-1834</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#70716D]">ISSUER</span>
                  <span className="text-[#101B2D] font-bold">CENTRAL BOARD OF TAXES</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#70716D]">AMOUNT</span>
                  <span className="text-[#101B2D] font-bold">₹12,450.00</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#70716D]">DUE DATE</span>
                  <span className="text-[#3158A8] font-bold">18 OCT 2026</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#70716D]">STATUS</span>
                  <span className="text-[#8B2626] font-bold">REPLY REQUIRED</span>
                </div>
              </div>

              {/* Sample Action Callout */}
              <div className="p-3 border border-[#D5CEC1] bg-[#F1EBDD] space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#3158A8] block">
                  ACTION REQUIRED
                </span>
                <p className="font-mono text-xs text-[#101B2D] leading-tight">
                  Verify calculation discrepancy in Form DRC-01 and file reply before the statutory cutoff.
                </p>
              </div>

              <div className="pt-2 flex justify-between items-center font-mono text-[10px] text-[#70716D]">
                <span>CONFIDENTIAL • TAXPAYER COPY</span>
                <button
                  type="button"
                  onClick={handleTryDemo}
                  className="text-[#3158A8] uppercase tracking-wider hover:underline"
                >
                  INSPECT SCENARIO →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Oversized Typographic Brand Treatment extending beyond section */}
        <div className="relative pt-16 sm:pt-24 select-none overflow-hidden">
          <div className="font-serif text-[13vw] font-bold tracking-tighter text-[#101B2D] opacity-[0.06] whitespace-nowrap leading-none text-center">
            DOCUSAATHI
          </div>
        </div>
      </section>

      {/* 01 — THE PROBLEM */}
      <section className="border-t border-[#D5CEC1] pt-12 space-y-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-2">
            01 — THE PROBLEM
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#101B2D] max-w-3xl leading-tight">
            Important documents shouldn’t feel impossible to understand.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs sm:text-sm text-[#70716D] leading-relaxed">
          <p>
            Citizens, freelancers, and small business owners in India routinely receive ambiguous tax notices, complex GST invoices, bank loan sanctions, and dense rental agreements. Jargon conceals non-negotiable deadlines, minor calculation errors become heavy penalties, and critical next steps are lost in legalese.
          </p>
          <p>
            DocuSaathi bridges the gap between passive reading and deliberate action. By marrying Google’s Gemini multimodal AI with deterministic mathematical verification, we ensure you never second-guess an amount, miss a payment cutoff, or overlook legal exposure.
          </p>
        </div>
      </section>

      {/* 02 — THE PROCESS */}
      <section className="border-t border-[#D5CEC1] pt-12 space-y-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-2">
            02 — THE PROCESS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#101B2D]">
            The intelligent document pipeline.
          </h2>
        </div>

        {/* Horizontal editorial stages separated by thin rules */}
        <div className="border border-[#D5CEC1] bg-[#FAF8F2] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-[#D5CEC1]">
          {[
            { step: '01', title: 'UPLOAD', desc: 'PDF, JPG or PNG via in-memory stream' },
            { step: '02', title: 'UNDERSTAND', desc: 'Multimodal semantic classification' },
            { step: '03', title: 'EXTRACT', desc: 'Structured entities, dates & amounts' },
            { step: '04', title: 'VALIDATE', desc: 'Deterministic math parity audit' },
            { step: '05', title: 'IDENTIFY', desc: 'Legal risk & penalty evaluation' },
            { step: '06', title: 'ACT', desc: 'Prioritized sequential next steps' },
          ].map((stage, i) => (
            <div key={i} className="p-5 space-y-2 hover:bg-[#E8E0D2]/40 transition-colors">
              <span className="font-serif text-xl font-bold text-[#3158A8] block">
                {stage.step}
              </span>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#101B2D]">
                {stage.title}
              </h3>
              <p className="font-mono text-[11px] text-[#70716D] leading-normal">
                {stage.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 03 — WHAT DOCUSAATHI FINDS */}
      <section className="border-t border-[#D5CEC1] pt-12 space-y-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-2">
            03 — WHAT DOCUSAATHI FINDS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#101B2D]">
            Structured clarity from unstructured paperwork.
          </h2>
        </div>

        <div className="border-t border-b border-[#D5CEC1] divide-y divide-[#D5CEC1]">
          {[
            {
              label: 'KEY INFORMATION',
              heading: 'Entity extraction with zero guesswork.',
              desc: 'Identifies PAN, GSTIN, reference numbers, assessment years, issuing authorities, and monetary line items into normalized key-value tables.',
            },
            {
              label: 'RISKS',
              heading: 'Penalties, interest charges, and compliance traps.',
              desc: 'Evaluates non-compliance liability, escalating monthly interest under Sections 220(2) or 234, and contractual penalty clauses.',
            },
            {
              label: 'DEADLINES',
              heading: 'Calendar tracking and overdue classification.',
              desc: 'Parses filing cutoffs and appeal timelines. Calculates exact days remaining against the current date.',
            },
            {
              label: 'ACTIONS',
              heading: 'Clear instructions on what to complete first.',
              desc: 'Replaces ambiguous paperwork with numbered, step-by-step action items ranked by urgency.',
            },
            {
              label: 'EXPLANATIONS',
              heading: 'Plain-language summaries for every document.',
              desc: 'Provides a human translation of legal and tax provisions in simple, understandable English or vernacular tone.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline hover:bg-[#FAF8F2]/50 transition-colors"
            >
              <div className="md:col-span-3">
                <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] font-bold">
                  {item.label}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="font-serif text-lg font-bold text-[#101B2D]">
                  {item.heading}
                </h3>
              </div>
              <div className="md:col-span-5">
                <p className="font-mono text-xs text-[#70716D] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 04 — WHY IT MATTERS */}
      <section className="border-t border-[#D5CEC1] pt-12 pb-12 space-y-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-2">
            04 — WHY IT MATTERS
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#101B2D] leading-tight max-w-4xl">
            From a document you receive
            <br />
            <span className="italic font-normal text-[#3158A8]">to an action you can complete.</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
          <button
            type="button"
            onClick={handleAnalyze}
            className="bg-[#101B2D] hover:bg-[#1B2C47] text-[#F1EBDD] px-8 py-4 rounded-sm font-mono text-xs uppercase tracking-widest text-center transition-all hover:translate-y-[-1px]"
          >
            [ ANALYZE A DOCUMENT ]
          </button>

          <button
            type="button"
            onClick={handleTryDemo}
            className="bg-transparent hover:bg-[#E8E0D2] text-[#101B2D] border border-[#101B2D] px-8 py-4 rounded-sm font-mono text-xs uppercase tracking-widest text-center transition-all hover:translate-y-[-1px]"
          >
            [ TRY DEMO ]
          </button>
        </div>
      </section>
    </div>
  );
}

