import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="max-w-md mx-auto my-12 border border-[#D5CEC1] bg-[#FAF8F2] p-8 sm:p-10 space-y-8 font-mono">
      <div className="space-y-2 border-b border-[#D5CEC1] pb-6">
        <span className="text-[10px] uppercase tracking-widest text-[#3158A8] block">
          01 — REGISTRATION
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#101B2D]">
          Create account.
        </h1>
        <p className="text-xs text-[#70716D]">
          Set up your workspace for intelligent document analysis.
        </p>
      </div>

      {/* Quick Demo Mode Access */}
      <div className="p-4 border border-[#9A6B2F] bg-[#9A6B2F]/10 space-y-2">
        <span className="text-[10px] font-bold text-[#9A6B2F] uppercase tracking-wider block">
          [ HACKATHON EVALUATION ]
        </span>
        <p className="text-xs text-[#101B2D]">
          Skip signup and launch straight into the dashboard with pre-loaded scenarios.
        </p>
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full bg-[#101B2D] text-[#F1EBDD] py-2.5 font-mono text-xs uppercase tracking-widest hover:bg-[#1B2C47] transition-colors"
        >
          [ CONTINUE AS DEMO USER ]
        </button>
      </div>

      {error && (
        <div className="p-3 border border-[#8B2626] bg-[#8B2626]/10 text-xs text-[#8B2626]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="text-[#70716D] uppercase tracking-wider block">FULL NAME</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Rahul Mehta"
            className="w-full p-2.5 bg-[#FAF8F2] border border-[#D5CEC1] text-[#101B2D] focus:outline-none focus:border-[#3158A8]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[#70716D] uppercase tracking-wider block">EMAIL ADDRESS</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="taxpayer@domain.com"
            className="w-full p-2.5 bg-[#FAF8F2] border border-[#D5CEC1] text-[#101B2D] focus:outline-none focus:border-[#3158A8]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[#70716D] uppercase tracking-wider block">PASSWORD</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••• (min. 6 chars)"
            className="w-full p-2.5 bg-[#FAF8F2] border border-[#D5CEC1] text-[#101B2D] focus:outline-none focus:border-[#3158A8]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#101B2D] text-[#F1EBDD] hover:bg-[#1B2C47] py-3 text-xs uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {loading ? '[ CREATING ACCOUNT... ]' : '[ CREATE ACCOUNT ]'}
          </button>
        </div>
      </form>

      <div className="pt-4 border-t border-[#D5CEC1] text-center text-xs text-[#70716D]">
        Already have an account?{' '}
        <Link to="/login" className="text-[#3158A8] hover:underline uppercase tracking-wider font-bold">
          Sign In
        </Link>
      </div>
    </div>
  );
}

