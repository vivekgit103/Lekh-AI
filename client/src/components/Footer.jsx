import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Cpu, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/05 bg-[#070A0F]/90 backdrop-blur-md text-[#9BA6B5] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/05">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#5B8CFF] to-[#7C5CFF] p-[1px]">
                <div className="w-full h-full bg-[#070A0F] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[#5B8CFF]" />
                </div>
              </div>
              <span className="font-display text-lg font-bold tracking-tight text-[#F5F7FA]">
                Docu<span className="text-[#5B8CFF]">Saathi</span>
              </span>
            </Link>
            <p className="text-xs text-[#9BA6B5] max-w-sm leading-relaxed">
              Intelligent document understanding and decision engine. Converts complex Indian utility bills, invoices, tax notices, and bank letters into clear, validated action plans.
            </p>
            {/* System Status Pill */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#25D9B5]/10 border border-[#25D9B5]/20 text-[11px] font-mono text-[#25D9B5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D9B5] animate-pulse" />
              <span>PIPELINE ENGINE: ONLINE</span>
            </div>
          </div>

          {/* Architecture column */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B8CFF] font-semibold block">
              ARCHITECTURE
            </span>
            <ul className="text-xs text-[#9BA6B5] space-y-2">
              <li className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#7C5CFF]" />
                <span>Gemini Multimodal AI</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#25D9B5]" />
                <span>Deterministic Math Audit</span>
              </li>
              <li className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#5B8CFF]" />
                <span>Supabase Row-Level Security</span>
              </li>
            </ul>
          </div>

          {/* Navigation Column */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5B8CFF] font-semibold block">
              QUICK ACCESS
            </span>
            <ul className="text-xs text-[#9BA6B5] space-y-2">
              <li>
                <Link to="/dashboard" className="hover:text-[#F5F7FA] transition-colors">
                  Overview Dashboard
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-[#F5F7FA] transition-colors">
                  Upload & Analyze
                </Link>
              </li>
              <li>
                <Link to="/deadlines" className="hover:text-[#F5F7FA] transition-colors">
                  Compliance Deadlines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[#657182]">
          <div>
            © {new Date().getFullYear()} DOCUSAATHI AI. ALL RIGHTS RESERVED.
          </div>
          <div className="text-right">
            INTELLIGENT DOCUMENT PROCESSING HACKATHON
          </div>
        </div>
      </div>
    </footer>
  );
}

