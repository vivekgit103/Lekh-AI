import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import DeadlineCard from '../components/DeadlineCard';
import ValidationCard from '../components/ValidationCard';
import ExtractedDataCard from '../components/ExtractedDataCard';
import ActionList from '../components/ActionList';
import DocumentHeader from '../components/DocumentHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import DocumentChatPage from './DocumentChatPage';
import {
  Sparkles,
  AlertTriangle,
  Calendar,
  ShieldAlert,
  MessageSquare,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function DocumentResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(
    location.pathname.endsWith('/chat') ? 'chat' : 'analysis'
  );

  useEffect(() => {
    async function fetchDoc() {
      try {
        setLoading(true);
        const doc = await api.getDocument(id);
        if (!doc) {
          setError('Document not found in repository');
        } else {
          setDocument(doc);
        }
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document analysis');
      } finally {
        setLoading(false);
      }
    }
    fetchDoc();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this document and all associated records?')) return;
    try {
      await api.deleteDocument(id);
      navigate('/dashboard');
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner text="ASSEMBLING MULTIMODAL AUDIT REPORT..." />;
  }

  if (error || !document) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-8 rounded-2xl border border-[#FF5C6C]/30 bg-[#111722] space-y-4 shadow-xl">
        <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C6C] font-bold block">
          DOCUMENT NOT FOUND
        </span>
        <p className="font-sans text-sm text-[#9BA6B5]">{error || 'The requested document is unavailable.'}</p>
        <Link
          to="/dashboard"
          className="inline-block bg-white/10 hover:bg-white/20 text-[#F5F7FA] px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors"
        >
          BACK TO DASHBOARD
        </Link>
      </div>
    );
  }

  const deadlines = document.deadlines || [];
  const risks = document.risks || [];
  const validationData = document.validation_results || document.validationResults;
  const highestRisk = document.overallRisk ||
    (risks.find((r) => r.level === 'HIGH')
      ? 'HIGH'
      : risks.find((r) => r.level === 'MEDIUM')
      ? 'MEDIUM'
      : 'LOW');

  return (
    <div className="space-y-12 pb-20">
      {/* Top Document Header Card with Audit / Chat Tabs */}
      <DocumentHeader
        document={document}
        onDelete={handleDelete}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Tab Content */}
      {activeTab === 'chat' ? (
        <DocumentChatPage document={document} />
      ) : (
        <div className="space-y-12">
          {/* AI SUMMARY: "WHAT THIS MEANS" */}
          <section className="relative rounded-3xl border border-[#5B8CFF]/30 bg-gradient-to-r from-[#111722] via-[#151C29] to-[#111722] p-6 sm:p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#5B8CFF]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5B8CFF]/20 flex items-center justify-center text-[#5B8CFF]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#F5F7FA]">
                      WHAT THIS MEANS
                    </h2>
                    <span className="font-mono text-[10px] uppercase text-[#9BA6B5] tracking-wider block">
                      Generated from your document via Gemini Reasoning
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#5B8CFF]/10 text-[#5B8CFF] border border-[#5B8CFF]/20">
                  AI UNDERSTANDING
                </span>
              </div>

              <div className="pt-2">
                <p className="font-sans text-base sm:text-lg text-[#F5F7FA] leading-relaxed font-normal">
                  {document.summary || 'Summary not available.'}
                </p>
              </div>
            </div>
          </section>

          {/* KEY INFORMATION: Structured Parameters & Line items */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/05 pb-3">
              <span className="w-2 h-2 rounded-full bg-[#7C5CFF]" />
              <h2 className="font-display text-xl font-bold text-[#F5F7FA]">
                Key Information & Line Items
              </h2>
            </div>

            <ExtractedDataCard
              keyFields={document.key_fields || document.keyFields}
              amounts={document.amounts}
            />
          </section>

          {/* VALIDATION: "Verified by DocuSaathi" */}
          <section>
            <ValidationCard validation={validationData} />
          </section>

          {/* RISK ANALYSIS: Intelligent Risk Panel */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/05 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5C6C]" />
                <h2 className="font-display text-xl font-bold text-[#F5F7FA]">
                  Statutory Risk & Liability Analysis
                </h2>
              </div>
              <span className="text-xs font-mono text-[#9BA6B5]">
                {risks.length} EXPOSURE ITEM{risks.length !== 1 ? 'S' : ''}
              </span>
            </div>

            {risks.length === 0 ? (
              <div className="glass-panel p-8 text-center rounded-2xl border border-white/05 font-mono text-xs text-[#9BA6B5]">
                No critical or medium statutory compliance hazards detected.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {risks.map((risk, index) => {
                  const isHigh = risk.level === 'HIGH';
                  const isMed = risk.level === 'MEDIUM';

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -2 }}
                      className={`rounded-2xl border p-6 space-y-3 transition-all ${
                        isHigh
                          ? 'bg-[#111722] border-[#FF5C6C]/30 hover:border-[#FF5C6C]/60 shadow-lg shadow-[#FF5C6C]/05'
                          : isMed
                          ? 'bg-[#111722] border-[#FFB84D]/30 hover:border-[#FFB84D]/60'
                          : 'bg-[#111722] border-[#25D9B5]/30'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <RiskBadge level={risk.level} size="sm" />
                        <span className="font-mono text-[10px] text-[#9BA6B5] uppercase">
                          WHY THIS MATTERS
                        </span>
                      </div>

                      <h3 className="font-sans font-semibold text-base text-[#F5F7FA]">
                        {risk.reason}
                      </h3>

                      {risk.explanation && (
                        <p className="font-sans text-xs text-[#9BA6B5] leading-relaxed">
                          {risk.explanation}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>

          {/* DEADLINES: Striking Countdown Cards */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/05 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#5B8CFF]" />
                <h2 className="font-display text-xl font-bold text-[#F5F7FA]">
                  Statutory Deadlines & Cutoffs
                </h2>
              </div>
              <span className="text-xs font-mono text-[#9BA6B5]">
                {deadlines.length} TRACKED
              </span>
            </div>

            {deadlines.length === 0 ? (
              <div className="glass-panel p-8 text-center rounded-2xl border border-white/05 font-mono text-xs text-[#9BA6B5]">
                No time-sensitive deadlines extracted from this document.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deadlines.map((dl, index) => (
                  <DeadlineCard key={index} deadline={dl} />
                ))}
              </div>
            )}
          </section>

          {/* ACTION PLAN: "Here's what to do next." */}
          <section>
            <ActionList actions={document.actions} />
          </section>

          {/* EXPLANATION: Procedural Breakdown */}
          {document.explanation && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/05 pb-3">
                <span className="w-2 h-2 rounded-full bg-[#7C5CFF]" />
                <h2 className="font-display text-xl font-bold text-[#F5F7FA]">
                  Comprehensive Procedural Breakdown
                </h2>
              </div>

              <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/05 font-sans text-sm text-[#F5F7FA] leading-relaxed whitespace-pre-line space-y-4">
                {document.explanation}
              </div>
            </section>
          )}

          {/* Interactive Q&A Callout */}
          <div className="glass-panel-elevated rounded-3xl border border-[#5B8CFF]/30 p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#5B8CFF]/10 text-[10px] font-mono text-[#5B8CFF] uppercase">
                <Sparkles className="w-3 h-3" />
                <span>MULTIMODAL CONTEXT ACTIVE</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#F5F7FA]">
                Have questions about this document?
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#9BA6B5] max-w-xl">
                Ask our AI assistant about tax provisions, due amounts, appeal procedures, or clarification on specific clauses.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('chat')}
              className="bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-[#F5F7FA] px-6 py-3.5 rounded-xl font-sans text-xs uppercase font-semibold tracking-wider shadow-glow-blue/40 hover:shadow-glow-blue/60 transition-all shrink-0 flex items-center justify-center gap-2"
            >
              <span>ASK DOCUSAATHI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
