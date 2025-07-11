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
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { LoginInput, RegisterInput } from '@/lib/schemas';

export interface UserProfile {
  uid: string;
  email: string | null;
  fullName: string | null;
  role: 'student' | 'counselor' | null;
  universityId?: string;
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
  const auth = getAuthInstance();
  const db = getDbInstance();

  useEffect(() => {
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
            role: profileData.role || null,
            universityId: profileData.universityId,
            createdAt: profileData.createdAt,
          });
        } else {
          // This case might happen if Firestore doc creation failed or for older users
           setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName,
            role: null, // Or a default role / attempt to determine role
          });
          console.warn("User document not found in Firestore for UID:", firebaseUser.uid)
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  const login = async (input: LoginInput): Promise<UserProfile | null> => {
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
            role: profileData.role || null,
            universityId: profileData.universityId,
          };
          setUser(loggedInUser);
          return loggedInUser;
        } else {
            // This is a critical state - user exists in Auth but not in Firestore.
            // We should not let them proceed.
            throw new Error("Your user profile could not be found in our database. Please contact support.");
        }
    }
    return null; // Should not happen if login is successful
  };

  const signup = async (input: RegisterInput): Promise<UserProfile | null> => {
    const userCredential = await createUserWithEmailAndPassword(auth, input.email, input.password);
    const firebaseUser = userCredential.user;

    if (firebaseUser) {
      await updateProfile(firebaseUser, {
        displayName: input.fullName,
      });

      const userProfileData: UserProfile = {
        uid: firebaseUser.uid,
        email: input.email,
        fullName: input.fullName,
        universityId: input.universityId,
        role: input.role,
        createdAt: serverTimestamp(),
      };

      // Create the main user document in the 'users' collection
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfileData);

      setUser(userProfileData); // Update context state
      return userProfileData;
    }
    return null;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
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
