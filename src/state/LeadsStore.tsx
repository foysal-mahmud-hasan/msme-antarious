import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type LeadSource = 'facebook' | 'instagram' | 'whatsapp' | 'walkin' | 'website';
export type LeadStage = 'new' | 'warm' | 'hot' | 'won' | 'lost';

export type Lead = {
  id: string;
  name: string;
  phone: string;
  address: string;
  source: LeadSource;
  interest: string; // product/category they asked about
  budget: number;
  orders: number; // past completed orders (repeat-customer signal)
  lastContactDays: number;
  stage: LeadStage;
  note?: string;
};

export const SOURCE_META: Record<LeadSource, { label: string; emoji: string }> = {
  facebook: { label: 'Facebook', emoji: '📘' },
  instagram: { label: 'Instagram', emoji: '📸' },
  whatsapp: { label: 'WhatsApp', emoji: '💬' },
  walkin: { label: 'দোকান', emoji: '🏪' },
  website: { label: 'ওয়েবসাইট', emoji: '🌐' },
};

export const STAGE_META: Record<LeadStage, { label: string; color: string }> = {
  new: { label: 'নতুন', color: '#6b7280' },
  warm: { label: 'গরম', color: '#D89412' },
  hot: { label: 'হট', color: '#E04F4F' },
  won: { label: 'জিতেছি', color: '#1E7D4F' },
  lost: { label: 'হারানো', color: '#9ca3af' },
};

/** Lead score 0–100 from budget, repeat history, recency, source intent, stage. */
export function scoreLead(l: Lead): number {
  let s = 30;
  s += Math.min(l.orders * 10, 30);
  s += l.budget >= 5000 ? 20 : l.budget >= 2000 ? 12 : l.budget >= 500 ? 6 : 0;
  s += l.lastContactDays <= 2 ? 12 : l.lastContactDays <= 7 ? 6 : l.lastContactDays > 14 ? -8 : 0;
  s += l.source === 'website' || l.source === 'instagram' ? 6 : l.source === 'walkin' ? 4 : 2;
  s += l.stage === 'hot' ? 15 : l.stage === 'warm' ? 8 : l.stage === 'lost' ? -30 : 0;
  return Math.max(0, Math.min(100, Math.round(s)));
}

/** Cross-sell / upsell suggestions keyed loosely on the lead's interest. */
const UPSELL_MAP: { match: string[]; suggest: string[] }[] = [
  { match: ['ফ্যান', 'fan'], suggest: ['কুলিং বোতল', 'রিচার্জেবল লাইট'] },
  { match: ['বোতল', 'কুলিং'], suggest: ['কুলিং কুশন', 'মিনি ফ্যান'] },
  { match: ['কাপড়', 'পোশাক', 'শাড়ি'], suggest: ['ম্যাচিং ব্যাগ', 'হেয়ার ক্লিপ সেট'] },
  { match: ['তেল', 'সৌন্দর্য'], suggest: ['হেয়ার ক্লিপ', 'কম্বো প্যাক'] },
];

export function upsellFor(l: Lead): string[] {
  const lc = l.interest.toLowerCase();
  for (const rule of UPSELL_MAP) {
    if (rule.match.some((m) => lc.includes(m.toLowerCase()))) return rule.suggest;
  }
  return l.orders > 0 ? ['লয়ালটি কম্বো অফার'] : ['স্টার্টার বান্ডল'];
}

const seed: Lead[] = [
  { id: 'l-1', name: 'তানিয়া রহমান', phone: '01711-223344', address: 'ধানমন্ডি, ঢাকা', source: 'instagram', interest: 'মিনি ফ্যান', budget: 3500, orders: 2, lastContactDays: 1, stage: 'hot' },
  { id: 'l-2', name: 'সজীব আহমেদ', phone: '01822-556677', address: 'চকবাজার, চট্টগ্রাম', source: 'facebook', interest: 'কুলিং বোতল', budget: 1200, orders: 0, lastContactDays: 3, stage: 'warm' },
  { id: 'l-3', name: 'মেহজাবিন আক্তার', phone: '01933-889900', address: 'উত্তরা, ঢাকা', source: 'website', interest: 'কুলিং কুশন কম্বো', budget: 6000, orders: 4, lastContactDays: 2, stage: 'hot' },
  { id: 'l-4', name: 'রাকিব হাসান', phone: '01644-112233', address: 'বোয়ালিয়া, রাজশাহী', source: 'whatsapp', interest: 'হ্যান্ড ফ্যান', budget: 800, orders: 0, lastContactDays: 9, stage: 'new' },
  { id: 'l-5', name: 'ফারজানা ইয়াসমিন', phone: '01555-667788', address: 'কোতোয়ালী, খুলনা', source: 'walkin', interest: 'নারিকেল তেল', budget: 450, orders: 1, lastContactDays: 18, stage: 'new' },
  { id: 'l-6', name: 'ইমরান খান', phone: '01388-445566', address: 'জিন্দাবাজার, সিলেট', source: 'instagram', interest: 'ছাতা ও বক্স', budget: 2200, orders: 1, lastContactDays: 5, stage: 'warm' },
];

type Ctx = {
  leads: Lead[];
  /** Leads sorted by score (highest first). */
  ranked: (Lead & { score: number })[];
  hotCount: number;
  warmCount: number;
  avgScore: number;
  addLead: (l: Omit<Lead, 'id' | 'lastContactDays' | 'orders' | 'stage'> & Partial<Pick<Lead, 'orders' | 'stage'>>) => Lead;
  advanceStage: (id: string) => void;
  setStage: (id: string, stage: LeadStage) => void;
};

const LeadsCtx = createContext<Ctx | null>(null);

const NEXT_STAGE: Record<LeadStage, LeadStage> = {
  new: 'warm',
  warm: 'hot',
  hot: 'won',
  won: 'won',
  lost: 'lost',
};

export function LeadsProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(seed);

  const addLead: Ctx['addLead'] = useCallback((l) => {
    const next: Lead = {
      id: 'l-' + Date.now(),
      lastContactDays: 0,
      orders: l.orders ?? 0,
      stage: l.stage ?? 'new',
      ...l,
    };
    setLeads((prev) => [next, ...prev]);
    return next;
  }, []);

  const advanceStage: Ctx['advanceStage'] = useCallback((id) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage: NEXT_STAGE[l.stage], lastContactDays: 0 } : l)));
  }, []);

  const setStage: Ctx['setStage'] = useCallback((id, stage) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, stage } : l)));
  }, []);

  const value = useMemo<Ctx>(() => {
    const ranked = leads
      .map((l) => ({ ...l, score: scoreLead(l) }))
      .sort((a, b) => b.score - a.score);
    const hotCount = leads.filter((l) => l.stage === 'hot').length;
    const warmCount = leads.filter((l) => l.stage === 'warm').length;
    const avgScore = leads.length ? Math.round(ranked.reduce((s, l) => s + l.score, 0) / leads.length) : 0;
    return { leads, ranked, hotCount, warmCount, avgScore, addLead, advanceStage, setStage };
  }, [leads, addLead, advanceStage, setStage]);

  return <LeadsCtx.Provider value={value}>{children}</LeadsCtx.Provider>;
}

export function useLeads(): Ctx {
  const ctx = useContext(LeadsCtx);
  if (!ctx) throw new Error('useLeads must be used inside LeadsProvider');
  return ctx;
}
