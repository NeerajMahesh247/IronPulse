import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Menu, X, ChevronRight, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Technology', href: '/#technology' },
    { name: 'Applications', href: '/#applications' },
    { name: 'Monitoring', href: '/#monitoring' },
    { name: 'About', href: '/#about' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-iron-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl py-3'
          : 'bg-transparent border-b border-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-sky-500/50 rounded-lg p-1"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded bg-iron-900 border border-slate-700 group-hover:border-sky-400 transition-colors">
              <Cpu className="w-5 h-5 text-sky-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base sm:text-lg tracking-wider text-white uppercase">
                  IRON<span className="text-sky-400 font-extrabold">PULSE</span>
                </span>
                <span className="hidden sm:inline-block font-mono text-[9px] px-1.5 py-0.5 rounded bg-iron-900 text-sky-300 border border-sky-500/30">
                  INDUCTION MOTOR HEALTH
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-iron-900/80 px-2 py-1 rounded-md border border-slate-800">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 rounded text-xs font-mono tracking-wide text-slate-300 hover:text-white hover:bg-iron-800 transition-all"
              >
                {link.name}
              </a>
            ))}
            {user && (
              <Link
                to="/dashboard"
                className="px-3.5 py-1.5 rounded text-xs font-mono tracking-wide text-sky-400 hover:text-sky-300 hover:bg-iron-800 transition-all flex items-center gap-1 font-semibold"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3 font-mono text-xs">
            {user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded bg-iron-900 hover:bg-iron-850 border border-slate-700 text-slate-200 transition-colors"
                  title={`Operator: ${user.email}`}
                >
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span className="truncate max-w-[130px] font-mono text-[11px]">
                    {user.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-iron-900/60 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-mono font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="relative group px-4 py-2 text-xs font-mono font-semibold rounded bg-sky-500 hover:bg-sky-400 text-iron-950 transition-all duration-150 flex items-center gap-1.5 shadow-sm"
                >
                  <span>Get Started</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-iron-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-iron-950/95 border-b border-slate-800 px-6 py-5 mt-2 space-y-4 backdrop-blur-xl">
          <div className="flex flex-col space-y-3 font-mono text-sm">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-sky-400 py-1"
              >
                {link.name}
              </a>
            ))}
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sky-400 font-bold py-1 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard Console</span>
              </Link>
            )}
          </div>
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5 font-mono text-xs">
            {user ? (
              <>
                <div className="px-3 py-2 rounded bg-iron-900 border border-slate-800 text-slate-300 text-[11px] truncate">
                  Operator: <strong className="text-white">{user.email}</strong>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 text-xs font-mono font-semibold bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded hover:bg-rose-900/50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-mono text-slate-200 border border-slate-700 rounded hover:bg-iron-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-mono font-semibold bg-sky-500 text-iron-950 rounded"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
