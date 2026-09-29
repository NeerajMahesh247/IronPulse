import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number } | string | null;
  lastLoginAt?: Timestamp | { seconds: number; nanoseconds: number } | string | null;
}
