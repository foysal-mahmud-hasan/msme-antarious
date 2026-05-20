import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Debt = {
  id: string;
  name: string;
  amount: number;
  days: number;
  contact: 'হোয়াটসঅ্যাপ' | 'কল';
  avatarColor: string;
  avatarInitial: string;
};

const palette = ['#ffb077', '#f6a8b1', '#a8d4ff', '#c6b8f0', '#ffd28a', '#b0e6c5', '#ffd0d0'];

const seed: Debt[] = [
  { id: 'd-1', name: 'রহিম মিয়া', amount: 1200, days: 32, contact: 'হোয়াটসঅ্যাপ', avatarColor: '#ffb077', avatarInitial: 'র' },
  { id: 'd-2', name: 'নাজমা পারভীন', amount: 850, days: 14, contact: 'কল', avatarColor: '#f6a8b1', avatarInitial: 'ন' },
  { id: 'd-3', name: 'আবুল হোসেন', amount: 1400, days: 8, contact: 'হোয়াটসঅ্যাপ', avatarColor: '#a8d4ff', avatarInitial: 'আ' },
  { id: 'd-4', name: 'সাকিব হাসান', amount: 600, days: 21, contact: 'কল', avatarColor: '#c6b8f0', avatarInitial: 'স' },
  { id: 'd-5', name: 'হাসিনা বেগম', amount: 480, days: 4, contact: 'হোয়াটসঅ্যাপ', avatarColor: '#ffd28a', avatarInitial: 'হ' },
  { id: 'd-6', name: 'মুনির খান', amount: 220, days: 17, contact: 'কল', avatarColor: '#b0e6c5', avatarInitial: 'ম' },
  { id: 'd-7', name: 'সুমাইয়া আক্তার', amount: 100, days: 2, contact: 'হোয়াটসঅ্যাপ', avatarColor: '#ffd0d0', avatarInitial: 'সু' },
];

type Ctx = {
  debts: Debt[];
  total: number;
  addDebt: (d: Omit<Debt, 'id' | 'days' | 'avatarColor' | 'avatarInitial'>) => Debt;
  settleDebt: (id: string) => void;
};

const DebtsCtx = createContext<Ctx | null>(null);

export function DebtsProvider({ children }: { children: React.ReactNode }) {
  const [debts, setDebts] = useState<Debt[]>(seed);

  const addDebt: Ctx['addDebt'] = useCallback((d) => {
    const initial = d.name.trim()[0] ?? '?';
    const next: Debt = {
      id: 'd-' + Date.now(),
      days: 0,
      avatarColor: palette[Math.floor(Math.random() * palette.length)],
      avatarInitial: initial,
      ...d,
    };
    setDebts((prev) => [next, ...prev]);
    return next;
  }, []);

  const settleDebt: Ctx['settleDebt'] = useCallback((id) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const value = useMemo<Ctx>(() => {
    const total = debts.reduce((s, d) => s + d.amount, 0);
    return { debts, total, addDebt, settleDebt };
  }, [debts, addDebt, settleDebt]);

  return <DebtsCtx.Provider value={value}>{children}</DebtsCtx.Provider>;
}

export function useDebts(): Ctx {
  const ctx = useContext(DebtsCtx);
  if (!ctx) throw new Error('useDebts must be used inside DebtsProvider');
  return ctx;
}
