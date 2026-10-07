import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import MetricCard from '../components/MetricCard';
import RiskBadge from '../components/RiskBadge';
import DeadlineCard from '../components/DeadlineCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowRight,
  Trash2,
  ChevronRight,
  ShieldAlert,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setError(err.response?.data?.message || err.message || 'Could not load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this document and all associated records?')) return;
    try {
      setDeletingId(id);
      await api.deleteDocument(id);
      await fetchDashboardData();
    } catch (err) {
      alert('Failed to delete document: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="RETRIEVING INTELLIGENT WORKSPACE..." />;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-2xl border border-[#FF5C6C]/30 bg-[#111722] text-center space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-[#FF5C6C] font-bold block">
          SYSTEM ERROR
        </span>
        <p className="font-sans text-sm text-[#9BA6B5]">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-white/10 hover:bg-white/20 text-[#F5F7FA] px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider"
        >
          RETRY
        </button>
      </div>
    );
  }

  const documents = stats?.recentDocuments || [];

  // Extract all deadlines across documents
  const allDeadlines = [];
  documents.forEach((doc) => {
    (doc.deadlines || []).forEach((dl) => {
      allDeadlines.push({
        ...dl,
        docId: doc.id,
        docTitle: doc.document_title || doc.documentTitle || doc.original_file_name,
      });
    });
  });
  // Sort upcoming
  allDeadlines.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  // Determine greeting based on local hour
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'GOOD MORNING' : hour < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  return (
    <div className="space-y-12 pb-20">
      {/* Top Welcome Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-[#5B8CFF] font-semibold block">
              {greeting}, USER
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F5F7FA] leading-[1.1]">
              Your documents,
              <br />
              <span className="text-gradient">under control.</span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                try {
                  const demo = await api.getDemoSample();
                  if (demo && demo.id) navigate(`/documents/${demo.id}`);
                } catch {
                  navigate('/upload');
                }
              }}
              className="glass-panel text-[#F5F7FA] hover:text-white px-5 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-semibold border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5B8CFF]" />
              <span>TRY DEMO</span>
            </button>

            <Link
              to="/upload"
              className="bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-[#F5F7FA] px-5 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-semibold shadow-glow-blue/40 hover:shadow-glow-blue/60 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>UPLOAD DOCUMENT</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="DOCUMENTS"
            value={stats?.totalDocuments || 0}
            subtitle="Indexed in active repository"
            icon={FileText}
          />

          <MetricCard
            title="HIGH RISK"
            value={stats?.highRiskDocuments || 0}
            subtitle="Immediate statutory liability"
            icon={AlertTriangle}
          />

          <MetricCard
            title="UPCOMING"
            value={stats?.upcomingDeadlines || 0}
            subtitle="Statutory filing deadlines"
            icon={Calendar}
          />

          <MetricCard
            title="PENDING"
            value={stats?.overdueDocuments || 0}
            subtitle="Overdue or requiring action"
            icon={Clock}
          />
        </div>
      </section>

      {/* Responsive Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Recent Documents as Intelligent Objects (8 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-white/05 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5B8CFF]" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F5F7FA]">
                Recent Documents
              </h2>
            </div>
            <span className="font-mono text-xs text-[#9BA6B5]">
              {documents.length} PROCESSED
            </span>
          </div>

          {documents.length === 0 ? (
            <div className="glass-panel p-10 text-center rounded-2xl border border-white/05 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/05 border border-white/10 flex items-center justify-center mx-auto text-[#9BA6B5]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#F5F7FA]">
                No documents uploaded yet.
              </h3>
              <p className="font-sans text-xs text-[#9BA6B5] max-w-sm mx-auto">
                Drop a GST notice, tax form, or invoice to trigger autonomous multimodal parsing and compliance checks.
              </p>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-[#F5F7FA] px-5 py-2.5 rounded-xl font-sans text-xs uppercase font-semibold"
              >
                <span>Upload First Document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => {
                const highestRisk = doc.overallRisk ||
                  ((doc.risks || []).find((r) => r.level === 'HIGH')
                    ? 'HIGH'
                    : (doc.risks || []).find((r) => r.level === 'MEDIUM')
                    ? 'MEDIUM'
                    : 'LOW');

                const title = doc.document_title || doc.documentTitle || doc.original_file_name;
                const type = doc.document_type || doc.documentType || 'Tax Document';
                const firstDeadline = (doc.deadlines || [])[0];

                return (
                  <motion.div
                    key={doc.id}
                    whileHover={{ y: -3 }}
                    onClick={() => navigate(`/documents/${doc.id}`)}
                    className="p-5 rounded-2xl glass-panel border border-white/08 hover:border-[#5B8CFF]/50 hover:shadow-glow-blue/20 cursor-pointer transition-all space-y-3 group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Icon & Title */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-[#070A0F] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#5B8CFF]/50 transition-colors">
                          <FileText className="w-5 h-5 text-[#5B8CFF] group-hover:scale-110 transition-transform" />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <h3 className="font-display font-bold text-base text-[#F5F7FA] group-hover:text-white transition-colors truncate">
                            {title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#9BA6B5]">
                            <span className="uppercase text-[#5B8CFF]">{type}</span>
                            <span>•</span>
                            <span>{formatDate(doc.created_at)}</span>
                            {doc.issuer && (
                              <>
                                <span>•</span>
                                <span className="truncate max-w-[120px]">{doc.issuer}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Risk Badge & Delete */}
                      <div className="flex items-center gap-2 shrink-0">
                        <RiskBadge level={highestRisk} size="sm" />
                        <button
                          type="button"
                          onClick={(e) => handleDelete(doc.id, e)}
                          disabled={deletingId === doc.id}
                          className="p-1.5 rounded-lg text-[#9BA6B5] hover:text-[#FF5C6C] hover:bg-[#FF5C6C]/10 transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Metadata & Hover Reveal */}
                    <div className="pt-2 border-t border-white/05 flex items-center justify-between text-xs font-mono">
                      {firstDeadline ? (
                        <span className="text-[#FFB84D] flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Deadline: {formatDate(firstDeadline.date)}</span>
                        </span>
                      ) : (
                        <span className="text-[#9BA6B5]/60">No pending deadline</span>
                      )}

                      <span className="text-[#5B8CFF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        VIEW ANALYSIS <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Upcoming Deadlines (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/05 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5C6C]" />
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#F5F7FA]">
                Upcoming Deadlines
              </h2>
            </div>
            <Link
              to="/deadlines"
              className="font-mono text-xs text-[#5B8CFF] hover:underline uppercase tracking-wider"
            >
              VIEW TIMELINE →
            </Link>
          </div>

          {allDeadlines.length === 0 ? (
            <div className="glass-panel p-8 text-center rounded-2xl border border-white/05 font-mono text-xs text-[#9BA6B5]">
              No upcoming statutory obligations tracked.
            </div>
          ) : (
            <div className="space-y-3">
              {allDeadlines.slice(0, 5).map((dl, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/documents/${dl.docId}`)}
                  className="cursor-pointer"
                >
                  <DeadlineCard deadline={dl} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
