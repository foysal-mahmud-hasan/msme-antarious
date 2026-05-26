import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type ComplaintStatus = 'open' | 'progress' | 'resolved';
export type Severity = 'low' | 'med' | 'high';

export type Complaint = {
  id: string;
  customer: string;
  product: string;
  issue: string;
  severity: Severity;
  status: ComplaintStatus;
  ageDays: number;
};

export const STATUS_META: Record<ComplaintStatus, { label: string; color: string }> = {
  open: { label: 'নতুন', color: '#E04F4F' },
  progress: { label: 'চলমান', color: '#D89412' },
  resolved: { label: 'সমাধান', color: '#1E7D4F' },
};

export const SEVERITY_META: Record<Severity, { label: string; color: string }> = {
  low: { label: 'কম', color: '#6b7280' },
  med: { label: 'মাঝারি', color: '#D89412' },
  high: { label: 'জরুরি', color: '#E04F4F' },
};

const seed: Complaint[] = [
  { id: 'c-1', customer: 'করিম সাহেব', product: 'মিনি ইউএসবি ফ্যান', issue: 'ফ্যান চালু হচ্ছে না', severity: 'high', status: 'open', ageDays: 1 },
  { id: 'c-2', customer: 'সুমাইয়া আপু', product: 'কুলিং বোতল', issue: 'ঢাকনা লিক করছে', severity: 'med', status: 'progress', ageDays: 2 },
  { id: 'c-3', customer: 'নাজমা বেগম', product: 'হ্যান্ড ফ্যান', issue: 'ডেলিভারি দেরি হয়েছে', severity: 'low', status: 'open', ageDays: 4 },
  { id: 'c-4', customer: 'রফিক মিয়া', product: 'প্লাস্টিক বক্স', issue: 'ভুল রঙ এসেছে', severity: 'med', status: 'resolved', ageDays: 6 },
  { id: 'c-5', customer: 'তানিয়া রহমান', product: 'কুলিং কুশন', issue: 'সাইজ ছোট', severity: 'low', status: 'resolved', ageDays: 8 },
];

const NEXT: Record<ComplaintStatus, ComplaintStatus> = { open: 'progress', progress: 'resolved', resolved: 'resolved' };

type Ctx = {
  complaints: Complaint[];
  openCount: number;
  progressCount: number;
  resolvedCount: number;
  resolutionRate: number; // %
  addComplaint: (c: Omit<Complaint, 'id' | 'ageDays' | 'status'> & Partial<Pick<Complaint, 'status'>>) => Complaint;
  advanceStatus: (id: string) => void;
};

const ComplaintsCtx = createContext<Ctx | null>(null);

export function ComplaintsProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(seed);

  const addComplaint: Ctx['addComplaint'] = useCallback((c) => {
    const next: Complaint = { id: 'c-' + Date.now(), ageDays: 0, status: c.status ?? 'open', ...c };
    setComplaints((prev) => [next, ...prev]);
    return next;
  }, []);

  const advanceStatus: Ctx['advanceStatus'] = useCallback((id) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status: NEXT[c.status] } : c)));
  }, []);

  const value = useMemo<Ctx>(() => {
    const openCount = complaints.filter((c) => c.status === 'open').length;
    const progressCount = complaints.filter((c) => c.status === 'progress').length;
    const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
    const resolutionRate = complaints.length ? Math.round((resolvedCount / complaints.length) * 100) : 0;
    return { complaints, openCount, progressCount, resolvedCount, resolutionRate, addComplaint, advanceStatus };
  }, [complaints, addComplaint, advanceStatus]);

  return <ComplaintsCtx.Provider value={value}>{children}</ComplaintsCtx.Provider>;
}

export function useComplaints(): Ctx {
  const ctx = useContext(ComplaintsCtx);
  if (!ctx) throw new Error('useComplaints must be used inside ComplaintsProvider');
  return ctx;
}
