import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#D5CEC1] bg-[#F1EBDD] text-[#101B2D] py-12 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#D5CEC1]">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-[#101B2D]">
              DOCUSAATHI.
            </Link>
            <p className="font-mono text-xs text-[#70716D] max-w-md leading-relaxed">
              Intelligent document understanding and decision engine. Crafted for Indian taxpayers, freelancers, and small businesses facing complex paperwork.
            </p>
          </div>

          {/* Architecture info */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] text-[#3158A8] uppercase tracking-widest block">
              01 — ARCHITECTURE
            </span>
            <ul className="font-mono text-xs text-[#70716D] space-y-1.5">
              <li>Google Gemini Multimodal AI</li>
              <li>Deterministic Rule Audit</li>
              <li>Supabase Row-Level Security</li>
              <li>Zero In-Memory Leak Ingestion</li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <span className="font-mono text-[11px] text-[#3158A8] uppercase tracking-widest block">
              02 — NAVIGATION
            </span>
            <ul className="font-mono text-xs text-[#70716D] space-y-1.5">
              <li>
                <Link to="/dashboard" className="hover:text-[#101B2D] transition-colors">
                  DASHBOARD
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-[#101B2D] transition-colors">
                  UPLOAD DOCUMENT
                </Link>
              </li>
              <li>
                <Link to="/deadlines" className="hover:text-[#101B2D] transition-colors">
                  DEADLINES
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-[#70716D]">
          <div>
            © {new Date().getFullYear()} DOCUSAATHI. ALL RIGHTS RESERVED.
          </div>
          <div>
            BUILT FOR INTELLIGENT DOCUMENT PROCESSING HACKATHON
          </div>
        </div>
      </div>
    </footer>
  );
}

