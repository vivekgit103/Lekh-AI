import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import MetricCard from '../components/MetricCard';
import RiskBadge from '../components/RiskBadge';
import StatusBadge from '../components/StatusBadge';
import DeadlineCard from '../components/DeadlineCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';

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
    return <LoadingSpinner text="RETRIEVING DASHBOARD DATA..." />;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 border border-[#D5CEC1] bg-[#FAF8F2] text-center space-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-[#8B2626] font-bold block">
          [ SYSTEM ERROR ]
        </span>
        <p className="font-mono text-xs text-[#101B2D]">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-[#101B2D] text-[#F1EBDD] px-6 py-2.5 rounded-sm font-mono text-xs uppercase tracking-widest"
        >
          [ RETRY ]
        </button>
      </div>
    );
  }

  const documents = stats?.recentDocuments || [];

  // Extract upcoming deadlines across recent documents
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

  return (
    <div className="space-y-16">
      {/* 02 — OVERVIEW Header */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#D5CEC1] pb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-2">
              02 — OVERVIEW
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#101B2D] leading-[1.1]">
              Your documents,
              <br />
              at a glance.
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
              className="bg-transparent hover:bg-[#E8E0D2] text-[#101B2D] border border-[#101B2D] px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-widest transition-all"
            >
              [ TRY DEMO ]
            </button>

            <Link
              to="/upload"
              className="bg-[#101B2D] hover:bg-[#1B2C47] text-[#F1EBDD] px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-widest transition-all"
            >
              [ UPLOAD DOCUMENT ]
            </Link>
          </div>
        </div>

        {/* Statistics using oversized numbers separated by vertical/horizontal rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#D5CEC1] divide-y sm:divide-y-0 sm:divide-x divide-[#D5CEC1]">
          <MetricCard
            title="DOCUMENTS"
            value={stats?.totalDocuments || 0}
            subtitle="Indexed in active repository"
          />

          <MetricCard
            title="UPCOMING DEADLINES"
            value={stats?.upcomingDeadlines || 0}
            subtitle="Future statutory cutoffs"
          />

          <MetricCard
            title="HIGH RISK"
            value={stats?.highRiskDocuments || 0}
            subtitle="Critical exposure flagged"
          />

          <MetricCard
            title="PENDING ACTIONS"
            value={stats?.overdueDocuments || 0}
            subtitle="Overdue or requiring action"
          />
        </div>
      </section>

      {/* 03 — RECENT DOCUMENTS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#D5CEC1] pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-1">
              03 — RECENT DOCUMENTS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B2D]">
              Indexed records & audit reports.
            </h2>
          </div>
          <span className="font-mono text-xs text-[#70716D] uppercase">
            {documents.length} RECENT FILE{documents.length !== 1 ? 'S' : ''}
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="border border-[#D5CEC1] bg-[#FAF8F2] p-12 text-center space-y-4">
            <p className="font-serif text-lg font-bold text-[#101B2D]">
              No documents processed yet.
            </p>
            <p className="font-mono text-xs text-[#70716D]">
              Upload an Indian tax notice, GST invoice, or bank letter to run multimodal extraction.
            </p>
            <Link
              to="/upload"
              className="inline-block bg-[#101B2D] text-[#F1EBDD] px-6 py-3 rounded-sm font-mono text-xs uppercase tracking-widest"
            >
              [ UPLOAD FIRST DOCUMENT ]
            </Link>
          </div>
        ) : (
          <div className="border border-[#D5CEC1] bg-[#FAF8F2] overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#D5CEC1] text-[#70716D] text-[11px] uppercase tracking-wider bg-[#F1EBDD]/70">
                  <th className="py-3.5 px-6 font-semibold">DOCUMENT</th>
                  <th className="py-3.5 px-6 font-semibold">TYPE</th>
                  <th className="py-3.5 px-6 font-semibold">DATE</th>
                  <th className="py-3.5 px-6 font-semibold">STATUS</th>
                  <th className="py-3.5 px-6 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D5CEC1]">
                {documents.map((doc) => {
                  const highestRisk = doc.overallRisk ||
                    ((doc.risks || []).find((r) => r.level === 'HIGH')
                      ? 'HIGH'
                      : (doc.risks || []).find((r) => r.level === 'MEDIUM')
                      ? 'MEDIUM'
                      : 'LOW');

                  const title = doc.document_title || doc.documentTitle || doc.original_file_name;
                  const type = doc.document_type || doc.documentType || 'Tax Document';

                  return (
                    <tr
                      key={doc.id}
                      onClick={() => navigate(`/documents/${doc.id}`)}
                      className="cursor-pointer hover:bg-[#E8E0D2] transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="font-serif text-sm font-bold text-[#101B2D] block hover:text-[#3158A8]">
                            {title}
                          </span>
                          <span className="text-[11px] text-[#70716D] block">
                            Issuer: {doc.issuer || 'N/A'}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-[#101B2D] uppercase font-semibold">
                        {type}
                      </td>

                      <td className="py-4 px-6 text-[#70716D]">
                        {formatDate(doc.created_at)}
                      </td>

                      <td className="py-4 px-6">
                        <RiskBadge level={highestRisk} size="sm" />
                      </td>

                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => navigate(`/documents/${doc.id}`)}
                            className="text-[#3158A8] hover:underline uppercase text-[11px]"
                          >
                            [ VIEW ]
                          </button>
                          <button
                            onClick={(e) => handleDelete(doc.id, e)}
                            disabled={deletingId === doc.id}
                            className="text-[#70716D] hover:text-[#8B2626] uppercase text-[11px]"
                          >
                            [ DELETE ]
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Deadlines Section on Dashboard */}
      {allDeadlines.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-[#D5CEC1]">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#D5CEC1] pb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#3158A8] block mb-1">
                04 — ACTIVE DEADLINES
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#101B2D]">
                Statutory cutoffs across your documents.
              </h2>
            </div>
            <Link
              to="/deadlines"
              className="font-mono text-xs uppercase tracking-widest text-[#3158A8] hover:underline"
            >
              VIEW ALL DEADLINES →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allDeadlines.slice(0, 6).map((dl, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/documents/${dl.docId}`)}
                className="cursor-pointer"
              >
                <DeadlineCard deadline={dl} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

