import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, type Timestamp } from 'firebase/firestore';
import { ShieldCheck, User, Mail, Fingerprint, Calendar, Clock, RotateCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { db } from '../../config/firebase';
import { useAuth, syncUserProfileToFirestore } from '../../context/AuthContext';
import { TechCard } from '../ui/TechCard';
import type { UserProfile } from '../../types/user';

function formatTimestamp(ts: Timestamp | { seconds: number; nanoseconds: number } | string | null | undefined): string {
  if (!ts) return 'Synchronizing...';
  try {
    if (typeof ts === 'object' && 'toDate' in ts && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
    if (typeof ts === 'object' && 'seconds' in ts) {
      return new Date(ts.seconds * 1000).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
    if (typeof ts === 'string') {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
      return ts;
    }
  } catch (err) {
    console.warn('Error formatting timestamp:', err);
  }
  return 'Just now';
}

export const UserProfileCard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'failed'>('idle');

  const handleManualSync = async () => {
    if (!user) return;
    setSyncStatus('syncing');
    setError(null);
    console.log(`[IronPulse Manual Test] Triggered explicit Firestore sync for ${user.uid}`);
    const res = await syncUserProfileToFirestore(user);
    if (res.success) {
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 4000);
    } else {
      setSyncStatus('failed');
      const errMsg = (res.error as { message?: string })?.message || String(res.error);
      setError(errMsg);
    }
  };

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Subscribe ONLY to the current authenticated user's single Firestore document: users/{user.uid}
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as UserProfile;
          setProfile({
            uid: docSnap.id,
            email: data.email || user.email || '',
            displayName: data.displayName || user.displayName || '',
            createdAt: data.createdAt,
            lastLoginAt: data.lastLoginAt,
          });
        } else {
          // Document has not yet been written or is propagating
          setProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            createdAt: null,
            lastLoginAt: null,
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error('Firestore user profile snapshot error:', err);
        setError(err.message || 'Failed to retrieve operator profile from Firestore.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <TechCard className="p-6 bg-iron-900 border-slate-800 space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-xs text-sky-400 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AUTHENTICATED OPERATOR PROFILE (FIRESTORE)</span>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            User credentials and timestamps securely isolated at <code className="text-sky-300 bg-iron-950 px-1.5 py-0.5 rounded border border-slate-800 font-mono text-[11px]">users/{user?.uid ? `${user.uid.slice(0, 8)}...` : '{uid}'}</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            onClick={handleManualSync}
            disabled={syncStatus === 'syncing'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-iron-950 hover:bg-iron-850 text-slate-300 hover:text-white border border-slate-800 transition-colors disabled:opacity-50 text-xs"
            title="Force write/verify profile in Firestore"
          >
            <RotateCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-sky-400' : ''}`} />
            <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync to Firestore'}</span>
          </button>

          {syncStatus === 'success' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 text-[10px]">
              <CheckCircle2 className="w-3 h-3" />
              <span>SYNCED</span>
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981] animate-pulse" />
            <span>ISOLATED SESSION ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-950/50 border border-rose-500/60 flex items-start gap-3 text-xs text-rose-300 font-sans shadow-md">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <strong className="block font-semibold text-white">Firestore Security Rule Notice</strong>
            <span>{error}</span>
            {error.toLowerCase().includes('permission') && (
              <p className="text-[11px] text-rose-200/90 font-mono pt-1">
                👉 <strong>Action Required:</strong> Paste the rules from <code className="text-sky-300 bg-iron-950 px-1 py-0.5 rounded">firestore.rules</code> into <strong>Firebase Console → Firestore Database → Rules</strong> and click <strong>Publish</strong>.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center space-y-2 font-mono text-xs text-slate-400">
          <RotateCw className="w-5 h-5 text-sky-400 animate-spin" />
          <span>SYNCHRONIZING USER PROFILE DOCUMENT...</span>
        </div>
      ) : (
        /* Profile Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 font-mono text-xs">
          {/* Operator Name */}
          <div className="p-3.5 rounded bg-iron-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-sky-400" />
              <span>Operator Name</span>
            </div>
            <p className="font-sans font-semibold text-slate-200 text-sm truncate">
              {profile?.displayName || '—'}
            </p>
          </div>

          {/* Email Address */}
          <div className="p-3.5 rounded bg-iron-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>Registered Email</span>
            </div>
            <p className="font-mono text-slate-200 text-xs truncate" title={profile?.email}>
              {profile?.email || user?.email || '—'}
            </p>
          </div>

          {/* Firebase UID */}
          <div className="p-3.5 rounded bg-iron-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <Fingerprint className="w-3.5 h-3.5 text-sky-400" />
              <span>Operator UID</span>
            </div>
            <p className="font-mono text-slate-300 text-xs truncate" title={profile?.uid || user?.uid}>
              {profile?.uid || user?.uid || '—'}
            </p>
          </div>

          {/* Account Creation Date */}
          <div className="p-3.5 rounded bg-iron-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Account Created</span>
            </div>
            <p className="font-mono text-slate-300 text-[11px]">
              {formatTimestamp(profile?.createdAt)}
            </p>
          </div>

          {/* Last Login Date */}
          <div className="p-3.5 rounded bg-iron-950 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Last Login</span>
            </div>
            <p className="font-mono text-emerald-400 font-semibold text-[11px]">
              {formatTimestamp(profile?.lastLoginAt)}
            </p>
          </div>
        </div>
      )}

      {/* Security Assurance Note */}
      <div className="pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>SECURITY ENFORCED: STRICT DOCUMENT ISOLATION (USERS/&#123;UID&#125;)</span>
        </span>
        <span>NO CROSS-USER COLLECTION ACCESS</span>
      </div>
    </TechCard>
  );
};
