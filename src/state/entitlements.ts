// Entitlements — pure data + types, NO React. The single source of truth for
// what each tier unlocks. UI code must ask `has('leads')`, never `tier >= 3`.
// Moving a feature between tiers = editing one `adds` array here.

import { colors } from '../theme';

/** Capabilities granted by paid tiers (cumulative). */
export type TierFeature =
  // Tier 0
  | 'bookkeeping'
  // Tier 1
  | 'socialInbox'
  | 'autoReply'
  | 'escalation'
  | 'orderConfirm'
  | 'calendar'
  | 'financeTracking'
  | 'agentFinanceTips'
  | 'creditScore'
  | 'customerSegments'
  // Tier 2
  | 'website'
  | 'orderVisibility'
  | 'webTemplate'
  | 'webHosting'
  | 'inventory'
  | 'courier'
  | 'paymentGateway'
  // Tier 3
  | 'leads'
  | 'leadScoring'
  | 'upsell'
  // Tier 4
  | 'insights'
  | 'complaints'
  | 'salesAnalytics'
  | 'peakHours'
  | 'leadClosing';

/** Capabilities granted by add-ons (orthogonal to tiers). */
export type AddOnFeature = 'brandStudio';

/** Anything gateable — what `has(...)` accepts. */
export type Feature = TierFeature | AddOnFeature;

export type TierId = 'tier0' | 'tier1' | 'tier2' | 'tier3' | 'tier4';
export type AddOnId = 'brandStudio';

export type TierMeta = {
  id: TierId;
  order: number;
  nameBn: string;
  tagline: string;
  priceMin: number;
  priceMax: number;
  color: string;
  /** Features NEW at this tier; lower tiers are inherited (cumulative). */
  adds: TierFeature[];
};

export const TIERS: Record<TierId, TierMeta> = {
  tier0: {
    id: 'tier0',
    order: 0,
    nameBn: 'অফলাইন',
    tagline: 'শুধু হিসাব — ছোট/অফলাইন ব্যবসার জন্য',
    priceMin: 200,
    priceMax: 200,
    color: colors.ink2,
    adds: ['bookkeeping'],
  },
  tier1: {
    id: 'tier1',
    order: 1,
    nameBn: 'স্টার্টার',
    tagline: 'সোশ্যাল ইনবক্স + অটো-রিপ্লাই + হিসাব',
    priceMin: 700,
    priceMax: 800,
    color: colors.teal,
    adds: [
      'socialInbox',
      'autoReply',
      'escalation',
      'orderConfirm',
      'calendar',
      'financeTracking',
      'agentFinanceTips',
      'creditScore',
      'customerSegments',
    ],
  },
  tier2: {
    id: 'tier2',
    order: 2,
    nameBn: 'গ্রোথ',
    tagline: 'ওয়েবসাইট + ইনভেন্টরি + কুরিয়ার + পেমেন্ট',
    priceMin: 1500,
    priceMax: 1700,
    color: colors.saffron,
    adds: ['website', 'orderVisibility', 'webTemplate', 'webHosting', 'inventory', 'courier', 'paymentGateway'],
  },
  tier3: {
    id: 'tier3',
    order: 3,
    nameBn: 'প্রো',
    tagline: 'লিড ক্যাপচার + স্কোরিং + আপসেল',
    priceMin: 3000,
    priceMax: 3500,
    color: '#8B5CF6',
    adds: ['leads', 'leadScoring', 'upsell'],
  },
  tier4: {
    id: 'tier4',
    order: 4,
    nameBn: 'প্রিমিয়াম',
    tagline: 'ইনসাইট + রিপোর্ট + অভিযোগ + লিড ক্লোজিং',
    priceMin: 5000,
    priceMax: 7000,
    color: '#1d4ed8',
    adds: ['insights', 'complaints', 'salesAnalytics', 'peakHours', 'leadClosing'],
  },
};

export type AddOnMeta = {
  id: AddOnId;
  nameBn: string;
  tagline: string;
  price: number;
  color: string;
  grants: Feature[];
};

export const ADDONS: Record<AddOnId, AddOnMeta> = {
  brandStudio: {
    id: 'brandStudio',
    nameBn: 'ব্র্যান্ড স্টুডিও',
    tagline: 'লোগো + ক্যাপশন ও কপিরাইটিং',
    price: 500,
    color: '#db2777',
    grants: ['brandStudio'],
  },
};

const TIER_ORDER: TierId[] = ['tier0', 'tier1', 'tier2', 'tier3', 'tier4'];

/** Cumulative feature set for a tier (its own adds + everything below it). */
export function featuresForTier(tier: TierId): Set<Feature> {
  const max = TIERS[tier].order;
  const out = new Set<Feature>();
  for (const id of TIER_ORDER) {
    if (TIERS[id].order <= max) {
      for (const f of TIERS[id].adds) out.add(f);
    }
  }
  return out;
}

/** Minimum tier that unlocks a feature (null if no tier grants it — e.g. add-on only). */
export function requiredTierFor(feature: Feature): TierId | null {
  for (const id of TIER_ORDER) {
    if ((TIERS[id].adds as Feature[]).includes(feature)) return id;
  }
  return null;
}

/** The add-on that grants a feature, if any. */
export function addOnFor(feature: Feature): AddOnId | null {
  for (const id of Object.keys(ADDONS) as AddOnId[]) {
    if (ADDONS[id].grants.includes(feature)) return id;
  }
  return null;
}

export type FeatureMeta = { nameBn: string; icon: string };

/** Display label + Ionicons name for a feature (used by lock badges + upsell). */
export const FEATURE_META: Record<Feature, FeatureMeta> = {
  bookkeeping: { nameBn: 'হিসাব রাখা', icon: 'calculator-outline' },
  socialInbox: { nameBn: 'সোশ্যাল ইনবক্স', icon: 'chatbubbles-outline' },
  autoReply: { nameBn: 'অটো-রিপ্লাই', icon: 'sparkles-outline' },
  escalation: { nameBn: 'ম্যানুয়াল এসকেলেশন', icon: 'hand-left-outline' },
  orderConfirm: { nameBn: 'অর্ডার নিশ্চিতকরণ', icon: 'checkmark-done-outline' },
  calendar: { nameBn: 'ক্যালেন্ডার', icon: 'calendar-outline' },
  financeTracking: { nameBn: 'আয়-ব্যয়-মুনাফা', icon: 'trending-up-outline' },
  agentFinanceTips: { nameBn: 'সাথীর আর্থিক পরামর্শ', icon: 'bulb-outline' },
  creditScore: { nameBn: 'ক্রেডিট স্কোর', icon: 'speedometer-outline' },
  customerSegments: { nameBn: 'কাস্টমার আচরণ', icon: 'people-outline' },
  website: { nameBn: 'ওয়েবসাইট', icon: 'globe-outline' },
  orderVisibility: { nameBn: 'অর্ডার ভিজিবিলিটি', icon: 'eye-outline' },
  webTemplate: { nameBn: 'ওয়েবসাইট টেমপ্লেট', icon: 'browsers-outline' },
  webHosting: { nameBn: 'হোস্টিং পরামর্শ', icon: 'server-outline' },
  inventory: { nameBn: 'ইনভেন্টরি', icon: 'cube-outline' },
  courier: { nameBn: 'কুরিয়ার ইন্টিগ্রেশন', icon: 'bicycle-outline' },
  paymentGateway: { nameBn: 'পেমেন্ট গেটওয়ে', icon: 'card-outline' },
  leads: { nameBn: 'লিড ক্যাপচার', icon: 'magnet-outline' },
  leadScoring: { nameBn: 'লিড স্কোরিং', icon: 'podium-outline' },
  upsell: { nameBn: 'আপসেল ও ক্রস-সেল', icon: 'gift-outline' },
  insights: { nameBn: 'ইনসাইট ও রিপোর্ট', icon: 'analytics-outline' },
  complaints: { nameBn: 'অভিযোগ ট্র্যাকিং', icon: 'alert-circle-outline' },
  salesAnalytics: { nameBn: 'সেরা ও দুর্বল পণ্য', icon: 'bar-chart-outline' },
  peakHours: { nameBn: 'পিক-আওয়ার বিশ্লেষণ', icon: 'time-outline' },
  leadClosing: { nameBn: 'লিড ক্লোজিং', icon: 'flag-outline' },
  brandStudio: { nameBn: 'ব্র্যান্ড স্টুডিও', icon: 'color-palette-outline' },
};

const BN = (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

/** Bengali price-range label, e.g. "৭০০–৮০০ ৳" or "২০০ ৳". */
export function tierPriceLabel(tier: TierId): string {
  const t = TIERS[tier];
  return t.priceMin === t.priceMax ? `${BN(t.priceMin)} ৳` : `${BN(t.priceMin)}–${BN(t.priceMax)} ৳`;
}

/** Bengali numerals for arbitrary numbers (shared util). */
export function toBnNum(n: number): string {
  return BN(n);
}
