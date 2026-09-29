import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, KeyRound, Cpu, AlertCircle, Loader2 } from 'lucide-react';
import { TechCard } from '../components/ui/TechCard';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, getFriendlyErrorMessage } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setErrorMessage(getFriendlyErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-iron-950 flex flex-col justify-center items-center px-4 py-16 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-industrial-grid opacity-25 pointer-events-none" />

      {/* Back to Home Button */}
      <div className="relative z-10 w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Overview</span>
        </Link>
      </div>

      <TechCard className="w-full max-w-md p-8 bg-iron-900 border-slate-700/80 shadow-2xl relative z-10">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2.5 mb-7">
          <div className="w-11 h-11 mx-auto rounded bg-iron-950 border border-slate-700 flex items-center justify-center text-sky-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-white tracking-tight">
            IRON<span className="text-sky-400">PULSE</span> CONSOLE
          </h1>
          <p className="text-xs font-mono text-slate-400">
            MOTOR HEALTH OPERATOR ACCESS
          </p>
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <div className="p-3.5 rounded bg-rose-950/40 border border-rose-500/50 mb-6 flex items-start gap-2.5 text-xs text-rose-300 font-sans">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-slate-300 mb-1.5 uppercase text-[10px] tracking-wider">
              Operator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@plant.industrial"
                className="w-full pl-9 pr-3 py-2.5 rounded bg-iron-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-slate-300 uppercase text-[10px] tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded bg-iron-950 border border-slate-800 text-slate-100 placeholder-slate-600 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded bg-sky-500 hover:bg-sky-400 text-iron-950 font-semibold font-mono text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Console</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center font-mono text-xs text-slate-400">
          <span>Need a new operator account? </span>
          <Link to="/signup" className="text-sky-400 hover:underline">
            Register here
          </Link>
        </div>
      </TechCard>
    </div>
  );
};
