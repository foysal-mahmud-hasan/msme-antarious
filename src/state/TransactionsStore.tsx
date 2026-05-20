import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type TxKind = 'income' | 'expense';

export type Transaction = {
  id: string;
  kind: TxKind;
  amount: number;
  name: string;
  counterparty: string;
  when: string;
};

const seed: Transaction[] = [
  { id: 't-1', kind: 'income', amount: 1700, name: 'মিনি ফ্যান × ২', counterparty: 'করিম সাহেব', when: 'আজ' },
  { id: 't-2', kind: 'expense', amount: 4500, name: 'নতুন স্টক কেনা', counterparty: 'রহমান ট্রেডার্স', when: 'গতকাল' },
  { id: 't-3', kind: 'income', amount: 1050, name: 'কুলিং বোতল × ৩', counterparty: 'সুমাইয়া আপু', when: 'গতকাল' },
  { id: 't-4', kind: 'expense', amount: 750, name: 'বিদ্যুৎ বিল', counterparty: 'মাসিক', when: '২ দিন আগে' },
];

type Ctx = {
  transactions: Transaction[];
  weekIncome: number;
  weekExpense: number;
  weekNet: number;
  addTransaction: (tx: Omit<Transaction, 'id' | 'when'>) => Transaction;
};

const TransactionsCtx = createContext<Ctx | null>(null);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(seed);

  const addTransaction: Ctx['addTransaction'] = useCallback((tx) => {
    const next: Transaction = {
      id: 't-' + Date.now(),
      when: 'আজ',
      ...tx,
    };
    setTransactions((prev) => [next, ...prev]);
    return next;
  }, []);

  const value = useMemo<Ctx>(() => {
    const weekIncome = transactions.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0);
    const weekExpense = transactions.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);
    return {
      transactions,
      weekIncome,
      weekExpense,
      weekNet: weekIncome - weekExpense,
      addTransaction,
    };
  }, [transactions, addTransaction]);

  return <TransactionsCtx.Provider value={value}>{children}</TransactionsCtx.Provider>;
}

export function useTransactions(): Ctx {
  const ctx = useContext(TransactionsCtx);
  if (!ctx) throw new Error('useTransactions must be used inside TransactionsProvider');
  return ctx;
}
