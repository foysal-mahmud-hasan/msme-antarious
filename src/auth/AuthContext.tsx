import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Role = 'admin' | 'general';

export type User = {
  id: string;
  username: string;
  fullName: string;
  bengaliName: string;
  role: Role;
  hasPOPortal: boolean;
  avatarColor: string;
  avatarInitial: string;
};

const USERS: Record<string, { user: User; password: string }> = {
  asif: {
    password: '1234',
    user: {
      id: 'u-asif',
      username: 'asif',
      fullName: 'Asif Hasan',
      bengaliName: 'আসিফ হাসান',
      role: 'admin',
      hasPOPortal: true,
      avatarColor: '#1d4ed8',
      avatarInitial: 'আ',
    },
  },
  foysal: {
    password: '1234',
    user: {
      id: 'u-foysal',
      username: 'foysal',
      fullName: 'Foysal Mahmud',
      bengaliName: 'ফয়সাল মাহমুদ',
      role: 'general',
      hasPOPortal: false,
      avatarColor: '#E8820C',
      avatarInitial: 'ফ',
    },
  },
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  offline: boolean;
  setOffline: (v: boolean) => void;
  signIn: (username: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

const STORAGE_KEY = 'aropon:auth:user';
const OFFLINE_KEY = 'aropon:auth:offline';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOfflineState] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw));
        const off = await AsyncStorage.getItem(OFFLINE_KEY);
        if (off === '1') setOfflineState(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setOffline = (v: boolean) => {
    setOfflineState(v);
    AsyncStorage.setItem(OFFLINE_KEY, v ? '1' : '0').catch(() => {});
  };

  const signIn: AuthCtx['signIn'] = async (username, password) => {
    const u = USERS[username.trim().toLowerCase()];
    if (!u) return { ok: false, error: 'এই ইউজারনেমটি খুঁজে পাওয়া যায়নি।' };
    if (u.password !== password) return { ok: false, error: 'পাসওয়ার্ড সঠিক নয়।' };
    setUser(u.user);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u.user));
    return { ok: true };
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <Ctx.Provider value={{ user, loading, offline, setOffline, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export const demoCredentials = [
  { username: 'asif', password: '1234', desc: 'অ্যাডমিন · PO পোর্টাল অ্যাক্সেস' },
  { username: 'foysal', password: '1234', desc: 'সাধারণ ইউজার · অনলাইন + অফলাইন' },
];
