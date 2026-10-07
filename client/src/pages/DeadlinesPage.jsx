import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Plus
} from 'lucide-react';

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

        // Sort chronologically
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
    return <LoadingSpinner text="AUDITING STATUTORY TIMELINES..." />;
  }

  const todayStr = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="space-y-12 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5B8CFF]/10 border border-[#5B8CFF]/20">
            <Clock className="w-3.5 h-3.5 text-[#5B8CFF]" />
            <span className="font-mono text-[11px] font-semibold text-[#5B8CFF] uppercase tracking-wider">
              STATUTORY TIMELINE
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#F5F7FA]">
            Compliance Timeline
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#9BA6B5]">
            Chronological schedule of tax filings, response windows, and contractual obligations.
          </p>
        </div>

        <Link
          to="/upload"
          className="bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-[#F5F7FA] px-5 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-semibold shadow-glow-blue/40 hover:shadow-glow-blue/60 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>ADD DOCUMENT</span>
        </Link>
      </div>

      {error ? (
        <div className="p-8 rounded-2xl border border-[#FF5C6C]/30 bg-[#111722] text-center font-mono text-xs text-[#FF5C6C]">
          {error}
        </div>
      ) : deadlines.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-white/05 space-y-4">
          <Calendar className="w-10 h-10 text-[#5B8CFF] mx-auto opacity-70" />
          <h3 className="font-display text-lg font-bold text-[#F5F7FA]">
            No pending deadlines tracked.
          </h3>
          <p className="font-sans text-xs text-[#9BA6B5] max-w-sm mx-auto">
            Upload an Indian tax notice, GST invoice, or loan letter to extract key response dates.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-[#F5F7FA] px-5 py-2.5 rounded-xl font-sans text-xs uppercase font-semibold"
          >
            <span>Upload Document</span>
          </Link>
        </div>
      ) : (
        /* Visual Vertical Timeline */
        <div className="relative pl-6 sm:pl-10 space-y-8">
          {/* Glowing Vertical Timeline Line */}
          <div className="absolute left-3 sm:left-4 top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#5B8CFF] via-[#7C5CFF] to-transparent shadow-[0_0_10px_#5B8CFF]" />

          {/* TODAY MARKER */}
          <div className="relative flex items-center gap-4">
            <div className="w-6 h-6 rounded-full bg-[#5B8CFF] border-4 border-[#070A0F] shadow-glow-blue flex items-center justify-center -translate-x-[11px] sm:-translate-x-[11px] shrink-0" />
            <div className="px-3.5 py-1.5 rounded-xl bg-[#5B8CFF]/15 border border-[#5B8CFF]/30 font-mono text-xs text-[#5B8CFF] font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B8CFF] animate-pulse" />
              <span>TODAY: {todayStr}</span>
            </div>
          </div>

          {/* TIMELINE ITEMS */}
          {deadlines.map((dl, idx) => {
            const dateStr = dl.date || '';
            const parsed = new Date(dateStr);
            const isValid = !isNaN(parsed.getTime());
            const day = isValid ? parsed.getDate() : '--';
            const month = isValid ? parsed.toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'DATE';
            const year = isValid ? parsed.getFullYear() : '';
            const priority = (dl.priority || 'LOW').toUpperCase();

            // Calculate countdown
            let countdown = '';
            let isOverdue = false;
            if (isValid) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const target = new Date(parsed);
              target.setHours(0, 0, 0, 0);
              const diffTime = target.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays < 0) {
                isOverdue = true;
                countdown = `${Math.abs(diffDays)}d overdue`;
              } else if (diffDays === 0) {
                countdown = 'Due today';
              } else {
                countdown = `${diffDays}d remaining`;
              }
            }

            return (
              <motion.div
                key={idx}
                whileHover={{ x: 4 }}
                onClick={() => navigate(`/documents/${dl.docId}`)}
                className="relative flex items-start gap-4 sm:gap-6 cursor-pointer group"
              >
                {/* Timeline Node Ring */}
                <div
                  className={`w-4 h-4 rounded-full border-2 border-[#070A0F] -translate-x-[7px] sm:-translate-x-[7px] shrink-0 mt-6 ${
                    isOverdue
                      ? 'bg-[#FF5C6C] shadow-glow-red'
                      : priority === 'HIGH'
                      ? 'bg-[#FF5C6C]'
                      : priority === 'MEDIUM'
                      ? 'bg-[#FFB84D]'
                      : 'bg-[#25D9B5]'
                  }`}
                />

                {/* Timeline Card */}
                <div
                  className={`flex-1 p-5 sm:p-6 rounded-2xl glass-panel border transition-all ${
                    isOverdue
                      ? 'border-[#FF5C6C]/30 bg-[#FF5C6C]/05 hover:border-[#FF5C6C]/60'
                      : priority === 'HIGH'
                      ? 'border-white/10 hover:border-[#FF5C6C]/40 hover:shadow-glow-red/10'
                      : 'border-white/10 hover:border-[#5B8CFF]/40 hover:shadow-glow-blue/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Date Badge */}
                      <div className="w-14 h-14 rounded-xl bg-[#070A0F] border border-white/10 flex flex-col items-center justify-center text-center shrink-0">
                        <span className="font-display font-black text-xl leading-none text-[#F5F7FA]">
                          {day}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#5B8CFF] uppercase mt-0.5">
                          {month}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                              priority === 'HIGH'
                                ? 'text-[#FF5C6C] bg-[#FF5C6C]/10 border-[#FF5C6C]/30'
                                : priority === 'MEDIUM'
                                ? 'text-[#FFB84D] bg-[#FFB84D]/10 border-[#FFB84D]/30'
                                : 'text-[#25D9B5] bg-[#25D9B5]/10 border-[#25D9B5]/30'
                            }`}
                          >
                            {priority} PRIORITY
                          </span>

                          {countdown && (
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                                isOverdue
                                  ? 'text-[#FF5C6C] bg-[#FF5C6C]/15 font-semibold'
                                  : 'text-[#5B8CFF] bg-[#5B8CFF]/10'
                              }`}
                            >
                              {countdown}
                            </span>
                          )}
                        </div>

                        <h3 className="font-sans font-semibold text-base text-[#F5F7FA] group-hover:text-white transition-colors">
                          {dl.title || 'Statutory Obligation'}
                        </h3>

                        <p className="font-mono text-xs text-[#9BA6B5]">
                          Source: <span className="text-[#F5F7FA]">{dl.docTitle}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono text-[#5B8CFF] group-hover:translate-x-1 transition-transform shrink-0">
                      <span>VIEW AUDIT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
