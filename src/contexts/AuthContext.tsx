
// src/contexts/AuthContext.tsx
'use client';

import type { User as FirebaseUser } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAuthInstance, getDbInstance } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  type Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { LoginInput, RegisterInput } from '@/lib/schemas';

export interface UserProfile {
  uid: string;
  email: string | null;
  fullName: string | null;
  role: 'student' | 'counselor' | null;
  universityId?: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: any; // Firestore Timestamp
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<UserProfile | null>;
  signup: (input: RegisterInput) => Promise<UserProfile | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs only on the client-side
    const auth = getAuthInstance();
    const db = getDbInstance();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data() as Omit<UserProfile, 'uid' | 'email' | 'fullName'>;
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName,
            ...profileData,
          });
        } else {
           setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName,
            role: null,
          });
          console.warn("User document not found in Firestore for UID:", firebaseUser.uid)
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (input: LoginInput): Promise<UserProfile | null> => {
    const auth = getAuthInstance();
    const db = getDbInstance();
    const userCredential = await signInWithEmailAndPassword(auth, input.email, input.password);
    if (userCredential.user) {
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const profileData = userDocSnap.data() as Omit<UserProfile, 'uid' | 'email' | 'fullName'>;
          const loggedInUser: UserProfile = {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            fullName: userCredential.user.displayName,
            ...profileData
          };
          return loggedInUser;
        } else {
            throw new Error("Your user profile could not be found in our database. Please contact support.");
        }
    }
    return null;
  };

  const signup = async (input: RegisterInput): Promise<UserProfile | null> => {
    const auth = getAuthInstance();
    const db = getDbInstance();
    const userCredential = await createUserWithEmailAndPassword(auth, input.email, input.password);
    const firebaseUser = userCredential.user;

    if (firebaseUser) {
      await updateProfile(firebaseUser, {
        displayName: input.fullName,
      });

      const userProfileData: Omit<UserProfile, 'uid'> = {
        email: input.email,
        fullName: input.fullName,
        universityId: input.universityId,
        role: input.role,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userProfileData);
      
      return { uid: firebaseUser.uid, ...userProfileData };
    }
    return null;
  };

  const logout = async () => {
    const auth = getAuthInstance();
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
