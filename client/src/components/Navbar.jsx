import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Navbar() {
  const { user, signOut, isDemoMode, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

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
    <header className="sticky top-0 z-50 w-full bg-[#F1EBDD] border-b border-[#D5CEC1]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: Elegant Serif Logo */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#101B2D] hover:opacity-90 transition-opacity"
          >
            DOCUSAATHI.
          </Link>
          {isDemoMode && (
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border border-[#3158A8] text-[#3158A8]">
              DEMO MODE
            </span>
          )}
        </div>

        {/* Right: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-[#101B2D]">
          <Link
            to="/dashboard"
            className={`transition-colors hover:text-[#3158A8] ${
              isActive('/dashboard') ? 'text-[#3158A8] font-semibold border-b border-[#3158A8] pb-0.5' : 'text-[#101B2D]'
            }`}
          >
            DASHBOARD
          </Link>

          <Link
            to="/dashboard"
            className={`transition-colors hover:text-[#3158A8] ${
              isActive('/documents') ? 'text-[#3158A8] font-semibold border-b border-[#3158A8] pb-0.5' : 'text-[#101B2D]'
            }`}
          >
            DOCUMENTS
          </Link>

          <Link
            to="/deadlines"
            className={`transition-colors hover:text-[#3158A8] ${
              isActive('/deadlines') ? 'text-[#3158A8] font-semibold border-b border-[#3158A8] pb-0.5' : 'text-[#101B2D]'
            }`}
          >
            DEADLINES
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
            className="text-[#101B2D] hover:text-[#3158A8] transition-colors"
          >
            CHAT
          </button>

          {/* Upload Button: Dark Navy filled button with sharp / small radius */}
          <Link
            to="/upload"
            className="bg-[#101B2D] hover:bg-[#1B2C47] text-[#F1EBDD] px-5 py-2.5 rounded-sm font-mono text-xs uppercase tracking-widest transition-all hover:translate-y-[-1px]"
          >
            [ UPLOAD DOCUMENT ]
          </Link>

          {/* User state / Sign Out / Try Demo */}
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-[#D5CEC1]">
              <span className="text-[11px] text-[#70716D] max-w-[120px] truncate lowercase">
                {user.email?.split('@')[0]}
              </span>
              <button
                onClick={handleSignOut}
                className="text-[11px] text-[#70716D] hover:text-[#8B2626] transition-colors"
                title="Sign out"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 pl-4 border-l border-[#D5CEC1]">
              <button
                type="button"
                onClick={handleTryDemo}
                className="text-xs text-[#3158A8] hover:underline"
              >
                TRY DEMO
              </button>
              <Link
                to="/login"
                className="text-xs text-[#101B2D] hover:text-[#3158A8]"
              >
                SIGN IN
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <Link
            to="/upload"
            className="bg-[#101B2D] text-[#F1EBDD] px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase tracking-wider"
          >
            UPLOAD
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#D5CEC1] rounded-sm text-[#101B2D] font-mono text-xs"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#D5CEC1] bg-[#F1EBDD] px-6 py-6 space-y-4 font-mono text-xs uppercase tracking-widest">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#101B2D] hover:text-[#3158A8] py-1 border-b border-[#D5CEC1]/50"
          >
            DASHBOARD
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#101B2D] hover:text-[#3158A8] py-1 border-b border-[#D5CEC1]/50"
          >
            DOCUMENTS
          </Link>
          <Link
            to="/deadlines"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#101B2D] hover:text-[#3158A8] py-1 border-b border-[#D5CEC1]/50"
          >
            DEADLINES
          </Link>
          <button
            onClick={async () => {
              setMobileMenuOpen(false);
              const demo = await api.getDemoSample().catch(() => null);
              if (demo && demo.id) navigate(`/documents/${demo.id}/chat`);
              else navigate('/dashboard');
            }}
            className="block text-left w-full text-[#101B2D] hover:text-[#3158A8] py-1 border-b border-[#D5CEC1]/50"
          >
            CHAT
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleTryDemo();
            }}
            className="block text-left w-full text-[#3158A8] font-bold py-1 border-b border-[#D5CEC1]/50"
          >
            TRY DEMO
          </button>

          {user ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSignOut();
              }}
              className="block text-left text-[#8B2626] py-1"
            >
              LOGOUT ({user.email?.split('@')[0]})
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#101B2D] py-1"
            >
              SIGN IN
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
