import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, UserCredential, AuthError } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  getFriendlyErrorMessage: (error: unknown) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getFriendlyErrorMessage(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return 'An unexpected error occurred. Please try again.';
  }

  const authError = error as AuthError;
  switch (authError.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/email-already-in-use':
      return 'An account with this email is already registered. Please login instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please provide a valid email address format.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily restricted due to unusual activity. Please try again in a few minutes.';
    case 'auth/user-disabled':
      return 'This user account has been disabled by an administrator.';
    default:
      return authError.message || 'Authentication failed. Please try again.';
  }
}

// Centralized Firestore User Profile Sync Function
export async function syncUserProfileToFirestore(
  authUser: User,
  displayName?: string
): Promise<{ success: boolean; error?: unknown }> {
  const userDocRef = doc(db, 'users', authUser.uid);
  const targetEmail = authUser.email || '';
  const targetDisplayName = displayName?.trim() || authUser.displayName || '';

  console.log(`[IronPulse Firestore] FIRESTORE WRITE STARTED for users/${authUser.uid}`);
  console.log(`[IronPulse Firestore] Target Project ID:`, import.meta.env.VITE_FIREBASE_PROJECT_ID);
  console.log(`[IronPulse Firestore] Auth User UID:`, authUser.uid);
  console.log(`[IronPulse Firestore] Auth User Email:`, targetEmail);

  try {
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      // Document exists: update lastLoginAt (preserve createdAt and existing fields)
      await updateDoc(userDocRef, {
        lastLoginAt: serverTimestamp(),
        ...(targetDisplayName ? { displayName: targetDisplayName } : {}),
      });
      console.log(`[IronPulse Firestore] FIRESTORE WRITE SUCCESS (Updated lastLoginAt for users/${authUser.uid})`);
    } else {
      // Document does not exist yet: create it with serverTimestamp()
      await setDoc(userDocRef, {
        uid: authUser.uid,
        email: targetEmail,
        displayName: targetDisplayName,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
      console.log(`[IronPulse Firestore] FIRESTORE WRITE SUCCESS (Created new profile doc at users/${authUser.uid})`);
    }
    return { success: true };
  } catch (err: unknown) {
    console.error(`[IronPulse Firestore] FIRESTORE WRITE FAILED for users/${authUser.uid}:`, err);
    return { success: false, error: err };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Listen for real-time Firebase authentication state persistence
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // When an authenticated user session is detected/restored, ensure their Firestore doc exists
      if (currentUser) {
        syncUserProfileToFirestore(currentUser).catch((err) => {
          console.warn('[IronPulse Firestore] Auto-sync on auth state change encountered error:', err);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signup = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<UserCredential> => {
    // 1. Authenticate and create account in Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const authUser = cred.user;

    // 2. Set Firebase Auth display name if provided
    if (displayName?.trim()) {
      try {
        await updateProfile(authUser, { displayName: displayName.trim() });
      } catch (profileErr) {
        console.warn('Could not set Auth profile displayName:', profileErr);
      }
    }

    // 3. Create user document in Firestore: users/{uid}
    const result = await syncUserProfileToFirestore(authUser, displayName);
    if (!result.success && result.error) {
      console.error('[IronPulse Firestore] Signup Firestore write error:', result.error);
      // We don't block registration if Auth succeeded, but log error clearly
    }

    return cred;
  };

  const login = async (email: string, password: string): Promise<UserCredential> => {
    // 1. Authenticate with Firebase Auth
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const authUser = cred.user;

    // 2. Sync profile to Firestore (creates users/{uid} if missing, or updates lastLoginAt)
    const result = await syncUserProfileToFirestore(authUser);
    if (!result.success && result.error) {
      console.error('[IronPulse Firestore] Login Firestore write error:', result.error);
    }

    return cred;
  };

  const logout = (): Promise<void> => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        getFriendlyErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
