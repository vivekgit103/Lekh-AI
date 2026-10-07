import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';

export default function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDeadlines() {
      try {
        setLoading(true);
        setError('');
        const stats = await api.getStats();
        const docs = stats?.recentDocuments || [];

        const collected = [];
        docs.forEach((doc) => {
          (doc.deadlines || []).forEach((dl) => {
            collected.push({
              ...dl,
              docId: doc.id,
              docTitle: doc.document_title || doc.documentTitle || doc.original_file_name,
              docType: doc.document_type || doc.documentType || 'Tax Document',
            });
          });
        });

        // Sort: overdue & upcoming chronologically
        collected.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));
        setDeadlines(collected);
      } catch (err) {
        console.error('Failed to load deadlines:', err);
        setError('Could not load deadline chronology.');
      } finally {
        setLoading(false);
      }
    }

    fetchDeadlines();
  }, []);

  if (loading) {
    return <LoadingSpinner text="AUDITING STATUTORY DEADLINES..." />;
  }

  return (
    <div className="space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-[#D5CEC1] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-2">
            10 — DEADLINES
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#101B2D]">
            Chronology of obligations.
          </h1>
          <p className="font-mono text-xs text-[#70716D] mt-2">
            Time-sensitive statutory filing, tax payment, and response windows extracted from your documents.
          </p>
        </div>

        <Link
          to="/upload"
          className="bg-[#101B2D] text-[#F1EBDD] px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-widest text-center"
        >
          [ ADD DOCUMENT ]
        </Link>
      </div>

      {error ? (
        <div className="p-8 border border-[#D5CEC1] bg-[#FAF8F2] text-center font-mono text-xs text-[#8B2626]">
          {error}
        </div>
      ) : deadlines.length === 0 ? (
        <div className="border border-[#D5CEC1] bg-[#FAF8F2] p-12 text-center space-y-4">
          <p className="font-serif text-lg font-bold text-[#101B2D]">
            No pending deadlines tracked.
          </p>
          <p className="font-mono text-xs text-[#70716D]">
            Upload an Indian tax notice, GST invoice, or bank letter to extract critical deadlines.
          </p>
          <Link
            to="/upload"
            className="inline-block bg-[#101B2D] text-[#F1EBDD] px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest"
          >
            [ UPLOAD DOCUMENT ]
          </Link>
        </div>
      ) : (
        /* Ruled Deadlines Rows with Large Date Typography */
        <div className="border border-[#D5CEC1] bg-[#FAF8F2] divide-y divide-[#D5CEC1]">
          {deadlines.map((dl, idx) => {
            const dateStr = dl.date || '';
            const parsed = new Date(dateStr);
            const isValid = !isNaN(parsed.getTime());
            const day = isValid ? parsed.getDate() : '--';
            const month = isValid ? parsed.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'DATE';
            const year = isValid ? parsed.getFullYear() : '';
            const isOverdue = dl.status === 'OVERDUE' || (isValid && parsed < new Date());
            const priority = (dl.priority || 'LOW').toUpperCase();

            return (
              <div
                key={idx}
                onClick={() => navigate(`/documents/${dl.docId}`)}
                className={`p-6 sm:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors ${
                  isOverdue ? 'bg-[#8B2626]/5 hover:bg-[#8B2626]/10' : 'hover:bg-[#E8E0D2]'
                }`}
              >
                {/* Left: Large Date Typography */}
                <div className="flex items-center gap-6">
                  <div className="text-center min-w-[85px] border-r border-[#D5CEC1] pr-6">
                    <div className="font-serif text-4xl sm:text-5xl font-bold text-[#101B2D] leading-none">
                      {day}
                    </div>
                    <div className="font-mono text-xs font-bold text-[#3158A8] uppercase tracking-widest mt-1">
                      {month}
                    </div>
                    {year && (
                      <div className="font-mono text-[10px] text-[#70716D]">
                        {year}
                      </div>
                    )}
                  </div>

                  {/* Middle: Obligation Details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
                      <span className={`px-2 py-0.5 border ${
                        priority === 'HIGH'
                          ? 'text-[#8B2626] border-[#8B2626]/40'
                          : priority === 'MEDIUM'
                          ? 'text-[#9A6B2F] border-[#9A6B2F]/40'
                          : 'text-[#70716D] border-[#D5CEC1]'
                      }`}>
                        {priority} PRIORITY
                      </span>

                      {isOverdue ? (
                        <span className="text-[#8B2626] font-bold">
                          [ OVERDUE ]
                        </span>
                      ) : dl.status === 'COMPLETED' ? (
                        <span className="text-[#2D6A4F] font-bold">
                          [ COMPLETED ]
                        </span>
                      ) : (
                        <span className="text-[#3158A8] font-bold">
                          [ UPCOMING ]
                        </span>
                      )}

                      <span className="text-[#70716D]">
                        • {dl.docType}
                      </span>
                    </div>

                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#101B2D]">
                      {dl.title || 'Statutory Obligation'}
                    </h2>

                    <p className="font-mono text-xs text-[#70716D]">
                      Document: <strong className="text-[#101B2D]">{dl.docTitle}</strong>
                    </p>
                  </div>
                </div>

                {/* Right: Action link */}
                <div className="font-mono text-xs uppercase tracking-widest text-[#3158A8] text-left md:text-right shrink-0">
                  <span>VIEW AUDIT →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
