import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Cpu } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-iron-950 flex flex-col items-center justify-center font-mono text-xs text-slate-400 space-y-3">
        <div className="w-10 h-10 rounded bg-iron-900 border border-slate-700 flex items-center justify-center text-sky-400 animate-spin">
          <Cpu className="w-5 h-5" />
        </div>
        <span>VERIFYING MOTOR ACCESS CREDENTIALS...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-iron-950 flex flex-col items-center justify-center font-mono text-xs text-slate-400 space-y-3">
        <div className="w-10 h-10 rounded bg-iron-900 border border-slate-700 flex items-center justify-center text-sky-400 animate-spin">
          <Cpu className="w-5 h-5" />
        </div>
        <span>INITIALIZING CONSOLE...</span>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
