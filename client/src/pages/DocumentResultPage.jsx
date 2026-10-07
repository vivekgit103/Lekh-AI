import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import DeadlineCard from '../components/DeadlineCard';
import ValidationCard from '../components/ValidationCard';
import ExtractedDataCard from '../components/ExtractedDataCard';
import ActionList from '../components/ActionList';
import DocumentHeader from '../components/DocumentHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import DocumentChatPage from './DocumentChatPage';

export default function DocumentResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'chat'

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
    return <LoadingSpinner text="ASSEMBLING EDITORIAL AUDIT REPORT..." />;
  }

  if (error || !document) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-8 border border-[#D5CEC1] bg-[#FAF8F2] space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-[#8B2626] font-bold block">
          [ DOCUMENT NOT FOUND ]
        </span>
        <p className="font-mono text-xs text-[#101B2D]">{error || 'The requested document is unavailable.'}</p>
        <Link
          to="/dashboard"
          className="inline-block bg-[#101B2D] text-[#F1EBDD] px-6 py-2.5 rounded-sm font-mono text-xs uppercase tracking-widest"
        >
          [ BACK TO DASHBOARD ]
        </Link>
      </div>
    );
  }

  const deadlines = document.deadlines || [];
  const risks = document.risks || [];
  const validationData = document.validation_results || document.validationResults;

  return (
    <div className="space-y-16">
      {/* 05 — DOCUMENT: Top Header Block */}
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
        <div className="space-y-16">
          {/* 06 — SUMMARY */}
          <section className="space-y-4 border-b border-[#D5CEC1] pb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block">
              06 — SUMMARY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#101B2D]">
              What this document is saying.
            </h2>
            <div className="max-w-4xl pt-2">
              <p className="font-serif text-lg sm:text-xl text-[#101B2D] leading-relaxed">
                {document.summary || 'Summary not available.'}
              </p>
            </div>
          </section>

          {/* 07 — INFORMATION (Ruled Data Table) */}
          <section className="space-y-6 border-b border-[#D5CEC1] pb-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-1">
                07 — INFORMATION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B2D]">
                Structured parameters & figures.
              </h2>
            </div>

            <ExtractedDataCard
              keyFields={document.key_fields || document.keyFields}
              amounts={document.amounts}
            />
          </section>

          {/* 08 — VALIDATION */}
          <section className="border-b border-[#D5CEC1] pb-10">
            <ValidationCard validation={validationData} />
          </section>

          {/* 09 — RISKS (Typography + Strong Left Border) */}
          <section className="space-y-6 border-b border-[#D5CEC1] pb-10">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-1">
                  09 — RISKS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B2D]">
                  Legal exposure & non-compliance flags.
                </h2>
              </div>
              <span className="font-mono text-xs text-[#70716D] uppercase">
                {risks.length} EXPOSURE ITEM{risks.length !== 1 ? 'S' : ''}
              </span>
            </div>

            {risks.length === 0 ? (
              <div className="border border-[#D5CEC1] bg-[#FAF8F2] p-8 font-mono text-xs text-[#70716D] italic">
                No high or medium statutory risks detected for this document.
              </div>
            ) : (
              <div className="space-y-4">
                {risks.map((risk, index) => {
                  const isHigh = risk.level === 'HIGH';
                  const isMed = risk.level === 'MEDIUM';
                  const borderCol = isHigh ? 'border-l-[#8B2626]' : isMed ? 'border-l-[#9A6B2F]' : 'border-l-[#2D6A4F]';

                  return (
                    <div
                      key={index}
                      className={`border border-[#D5CEC1] border-l-4 ${borderCol} bg-[#FAF8F2] p-6 space-y-2`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <RiskBadge level={risk.level} size="sm" />
                        <span className="font-mono text-[10px] text-[#70716D] uppercase">
                          STATUTORY AUDIT NOTE
                        </span>
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#101B2D]">
                        {risk.reason}
                      </h3>

                      {risk.explanation && (
                        <p className="font-mono text-xs text-[#70716D] leading-relaxed">
                          {risk.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 10 — DEADLINES (Large Editorial Date Display) */}
          <section className="space-y-6 border-b border-[#D5CEC1] pb-10">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-1">
                  10 — DEADLINES
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B2D]">
                  Statutory deadlines & cutoffs.
                </h2>
              </div>
              <span className="font-mono text-xs text-[#70716D] uppercase">
                {deadlines.length} TRACKED DATE{deadlines.length !== 1 ? 'S' : ''}
              </span>
            </div>

            {deadlines.length === 0 ? (
              <div className="border border-[#D5CEC1] bg-[#FAF8F2] p-8 font-mono text-xs text-[#70716D] italic">
                No time-sensitive deadlines extracted.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deadlines.map((dl, index) => (
                  <DeadlineCard key={index} deadline={dl} />
                ))}
              </div>
            )}
          </section>

          {/* 11 — ACTION PLAN (Prominent Numbered Steps) */}
          <section className="border-b border-[#D5CEC1] pb-10">
            <ActionList actions={document.actions} />
          </section>

          {/* 12 — EXPLANATION (Comfortable reading width with highlighted values) */}
          <section className="space-y-6 border-b border-[#D5CEC1] pb-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-1">
                12 — EXPLANATION
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B2D]">
                Detailed procedural breakdown.
              </h2>
            </div>

            <div className="max-w-3xl border border-[#D5CEC1] bg-[#FAF8F2] p-6 sm:p-10">
              <div className="font-serif text-base sm:text-lg text-[#101B2D] leading-relaxed whitespace-pre-line space-y-4">
                {document.explanation || 'No detailed legal explanation generated.'}
              </div>
            </div>
          </section>

          {/* Jump to Chat Callout */}
          <div className="border border-[#D5CEC1] bg-[#101B2D] text-[#F1EBDD] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="font-mono text-[10px] text-[#3158A8] uppercase tracking-widest block">
                13 — INTERACTIVE Q&A
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Have specific questions about this document?
              </h3>
              <p className="font-mono text-xs text-[#D5CEC1] max-w-xl">
                Chat with the document context grounded on amounts, deadlines, and procedural steps.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('chat')}
              className="bg-[#F1EBDD] text-[#101B2D] hover:bg-[#E8E0D2] px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest shrink-0 transition-colors"
            >
              [ ASK THE DOCUMENT ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

