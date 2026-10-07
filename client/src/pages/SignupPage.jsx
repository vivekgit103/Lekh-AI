import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle, Play } from 'lucide-react';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: err } = await signUp(email, password, fullName);
      if (err) {
        setError(err.message || 'Failed to sign up');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-12 glass-panel-elevated rounded-3xl border border-white/10 p-8 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-2 border-b border-white/10 pb-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5B8CFF]/10 border border-[#5B8CFF]/25 text-[11px] font-mono uppercase text-[#5B8CFF]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ONBOARDING</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#F5F7FA]">
          Create Account
        </h1>
        <p className="font-sans text-xs text-[#9BA6B5]">
          Set up your workspace for autonomous document analysis and deadline alerts.
        </p>
      </div>

      {/* Demo Mode Access */}
      <div className="p-4 rounded-2xl border border-[#25D9B5]/30 bg-[#25D9B5]/05 space-y-2.5 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-[#25D9B5] uppercase tracking-wider">
            [ HACKATHON EVALUATION ]
          </span>
          <span className="w-2 h-2 rounded-full bg-[#25D9B5] animate-pulse" />
        </div>
        <p className="font-sans text-xs text-[#9BA6B5]">
          Skip credentials and test with pre-computed GST and tax scenarios.
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-[#25D9B5]/15 hover:bg-[#25D9B5]/25 text-[#25D9B5] border border-[#25D9B5]/30 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all font-semibold flex items-center justify-center gap-2"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>CONTINUE AS DEMO USER</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-[#FF5C6C]/30 bg-[#FF5C6C]/10 text-xs font-sans text-[#FF5C6C] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-xs">
        <div className="space-y-1.5">
          <label className="font-mono text-[#9BA6B5] uppercase tracking-wider block text-[11px]">
            FULL NAME
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-[#9BA6B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Rahul Sharma"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070A0F] border border-white/10 text-[#F5F7FA] font-sans text-xs focus:outline-none focus:border-[#5B8CFF] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[#9BA6B5] uppercase tracking-wider block text-[11px]">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#9BA6B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070A0F] border border-white/10 text-[#F5F7FA] font-sans text-xs focus:outline-none focus:border-[#5B8CFF] transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="font-mono text-[#9BA6B5] uppercase tracking-wider block text-[11px]">
            PASSWORD
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#9BA6B5] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••• (min. 6 chars)"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#070A0F] border border-white/10 text-[#F5F7FA] font-sans text-xs focus:outline-none focus:border-[#5B8CFF] transition-colors"
            />
          </div>
        </div>

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#5B8CFF] to-[#7C5CFF] text-white py-3 rounded-xl font-sans text-xs uppercase font-semibold tracking-wider shadow-glow-blue/40 hover:shadow-glow-blue/60 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>CREATING ACCOUNT...</span>
            ) : (
              <>
                <span>REGISTER NOW</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </form>

      <div className="pt-4 border-t border-white/10 text-center text-xs font-sans text-[#9BA6B5] relative z-10">
        Already have an account?{' '}
        <Link to="/login" className="text-[#5B8CFF] hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
