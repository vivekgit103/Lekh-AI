import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Sparkles, FileText, Bell, Clock, MessageSquare, LogOut, UploadCloud, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const { user, signOut, isDemoMode, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/documents')) {
      return true;
    }
    return location.pathname === path;
  };

  const handleTryDemo = async () => {
    loginAsDemo();
    try {
      const demo = await api.getDemoSample();
      if (demo && demo.id) {
        navigate(`/documents/${demo.id}`);
        return;
      }
    } catch (e) {
      console.warn('Demo navigation note:', e);
    }
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-3">
      <div 
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 border ${
          scrolled 
            ? 'bg-[#0D1117]/85 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50 py-3 px-5 sm:px-6' 
            : 'bg-[#111722]/60 backdrop-blur-md border-white/05 py-4 px-5 sm:px-6'
        } flex items-center justify-between`}
      >
        {/* Left: Futuristic Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B8CFF] to-[#7C5CFF] p-[1px] shadow-glow-blue/40 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#070A0F] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#5B8CFF] group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl font-bold tracking-tight text-[#F5F7FA]">
                Docu<span className="text-[#5B8CFF]">Saathi</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded-full bg-[#5B8CFF]/10 text-[#5B8CFF] border border-[#5B8CFF]/20">
                AI
              </span>
            </div>
          </Link>

          {isDemoMode && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#25D9B5]/10 text-[#25D9B5] border border-[#25D9B5]/25">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D9B5] animate-pulse" />
              DEMO MODE
            </span>
          )}
        </div>

        {/* Center: Desktop Navigation Pills */}
        <nav className="hidden md:flex items-center gap-1 bg-[#070A0F]/60 border border-white/05 p-1 rounded-xl">
          <Link
            to="/dashboard"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive('/dashboard')
                ? 'bg-gradient-to-r from-[#5B8CFF]/20 to-[#7C5CFF]/20 text-[#F5F7FA] border border-[#5B8CFF]/30 shadow-sm'
                : 'text-[#9BA6B5] hover:text-[#F5F7FA] hover:bg-white/05'
            }`}
          >
            Overview
          </Link>

          <Link
            to="/dashboard"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive('/documents')
                ? 'bg-gradient-to-r from-[#5B8CFF]/20 to-[#7C5CFF]/20 text-[#F5F7FA] border border-[#5B8CFF]/30'
                : 'text-[#9BA6B5] hover:text-[#F5F7FA] hover:bg-white/05'
            }`}
          >
            Documents
          </Link>

          <Link
            to="/deadlines"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive('/deadlines')
                ? 'bg-gradient-to-r from-[#5B8CFF]/20 to-[#7C5CFF]/20 text-[#F5F7FA] border border-[#5B8CFF]/30'
                : 'text-[#9BA6B5] hover:text-[#F5F7FA] hover:bg-white/05'
            }`}
          >
            Deadlines
          </Link>

          <button
            type="button"
            onClick={async () => {
              try {
                const demo = await api.getDemoSample();
                if (demo && demo.id) {
                  navigate(`/documents/${demo.id}/chat`);
                } else {
                  navigate('/dashboard');
                }
              } catch {
                navigate('/dashboard');
              }
            }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#9BA6B5] hover:text-[#F5F7FA] hover:bg-white/05 transition-all flex items-center gap-1.5"
          >
            Ask AI
          </button>
        </nav>

        {/* Right: Actions & User Status */}
        <div className="hidden md:flex items-center gap-3">
          {!user && (
            <button
              type="button"
              onClick={handleTryDemo}
              className="text-xs font-medium text-[#9BA6B5] hover:text-[#25D9B5] px-3 py-1.5 rounded-lg border border-white/05 hover:border-[#25D9B5]/30 hover:bg-[#25D9B5]/05 transition-all"
            >
              Try Demo
            </button>
          )}

          {/* Analyze Document CTA Button */}
          <Link
            to="/upload"
            className="btn-electric flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Analyze Document</span>
          </Link>

          {/* User Status / Login */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5B8CFF]/30 to-[#7C5CFF]/30 border border-white/10 flex items-center justify-center text-xs font-bold text-[#F5F7FA]">
                {user.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-[#9BA6B5] hover:text-[#FF5C6C] rounded-lg hover:bg-white/05 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-medium text-[#9BA6B5] hover:text-[#F5F7FA] px-3 py-1.5 rounded-lg hover:bg-white/05 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/upload"
            className="btn-electric p-2 rounded-lg text-xs"
            title="Upload"
          >
            <UploadCloud className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#9BA6B5] hover:text-[#F5F7FA] rounded-lg border border-white/10 bg-white/05"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-7xl mx-auto rounded-2xl bg-[#0D1117]/95 backdrop-blur-2xl border border-white/10 p-5 space-y-4 shadow-2xl shadow-black/80">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-white/05 border border-white/05 text-[#F5F7FA] hover:border-[#5B8CFF]/40 flex items-center justify-between"
            >
              <span>Overview</span>
              <ArrowUpRight className="w-4 h-4 text-[#5B8CFF]" />
            </Link>
            <Link
              to="/deadlines"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-white/05 border border-white/05 text-[#F5F7FA] hover:border-[#5B8CFF]/40 flex items-center justify-between"
            >
              <span>Deadlines</span>
              <Clock className="w-4 h-4 text-[#7C5CFF]" />
            </Link>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleTryDemo();
              }}
              className="w-full text-left p-3 rounded-xl bg-[#25D9B5]/10 border border-[#25D9B5]/30 text-[#25D9B5] text-sm font-semibold flex items-center justify-between"
            >
              <span>Try Demo Scenario</span>
              <Sparkles className="w-4 h-4" />
            </button>

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full text-left p-3 rounded-xl text-[#FF5C6C] text-sm font-medium hover:bg-[#FF5C6C]/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({user.email?.split('@')[0]})</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center p-3 rounded-xl bg-white/05 text-[#F5F7FA] text-sm font-medium hover:bg-white/10"
              >
                Sign In to DocuSaathi
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
