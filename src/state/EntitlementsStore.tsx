import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  ADDONS,
  AddOnId,
  Feature,
  featuresForTier,
  requiredTierFor,
  TierId,
  TIERS,
  TierMeta,
} from './entitlements';

/** Default plan per demo user. Seeded once; user can switch live in Pricing. */
const DEFAULT_TIER: TierId = 'tier1';
const DEFAULT_ADDONS: AddOnId[] = [];

type Persisted = { tier: TierId; addOns: AddOnId[] };

type Ctx = {
  tier: TierId;
  tierMeta: TierMeta;
  addOns: Set<AddOnId>;
  /** Does the current plan + add-ons grant this feature? */
  has: (feature: Feature) => boolean;
  /** Minimum tier that unlocks a feature (for upsell targeting). */
  requiredTierFor: (feature: Feature) => TierId | null;
  /** Live tier switch (simulated purchase). Persists + updates app-wide. */
  setTier: (tier: TierId) => void;
  /** Toggle an add-on (simulated). */
  toggleAddOn: (addOn: AddOnId) => void;
  hydrated: boolean;
};

const EntitlementsCtx = createContext<Ctx | null>(null);

const keyFor = (userId: string) => `aropon:entitlements:${userId}`;

export function EntitlementsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [tier, setTierState] = useState<TierId>(DEFAULT_TIER);
  const [addOns, setAddOns] = useState<Set<AddOnId>>(new Set(DEFAULT_ADDONS));
  const [hydrated, setHydrated] = useState(false);

  // Hydrate per-user on sign-in / user switch.
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!userId) {
        if (alive) {
          setTierState(DEFAULT_TIER);
          setAddOns(new Set(DEFAULT_ADDONS));
          setHydrated(true);
        }
        return;
      }
      setHydrated(false);
      try {
        const raw = await AsyncStorage.getItem(keyFor(userId));
        if (alive && raw) {
          const parsed = JSON.parse(raw) as Persisted;
          if (parsed.tier && TIERS[parsed.tier]) setTierState(parsed.tier);
          else setTierState(DEFAULT_TIER);
          setAddOns(new Set((parsed.addOns ?? []).filter((a) => ADDONS[a])));
        } else if (alive) {
          setTierState(DEFAULT_TIER);
          setAddOns(new Set(DEFAULT_ADDONS));
        }
      } finally {
        if (alive) setHydrated(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  const persist = useCallback(
    (next: Persisted) => {
      if (!userId) return;
      AsyncStorage.setItem(keyFor(userId), JSON.stringify(next)).catch(() => {});
    },
    [userId]
  );

  const setTier = useCallback(
    (next: TierId) => {
      setTierState(next);
      persist({ tier: next, addOns: Array.from(addOns) });
    },
    [addOns, persist]
  );

  const toggleAddOn = useCallback(
    (addOn: AddOnId) => {
      setAddOns((prev) => {
        const next = new Set(prev);
        if (next.has(addOn)) next.delete(addOn);
        else next.add(addOn);
        persist({ tier, addOns: Array.from(next) });
        return next;
      });
    },
    [tier, persist]
  );

  const value = useMemo<Ctx>(() => {
    const granted = featuresForTier(tier);
    for (const a of addOns) {
      for (const f of ADDONS[a].grants) granted.add(f);
    }
    return {
      tier,
      tierMeta: TIERS[tier],
      addOns,
      has: (feature) => granted.has(feature),
      requiredTierFor,
      setTier,
      toggleAddOn,
      hydrated,
    };
  }, [tier, addOns, setTier, toggleAddOn, hydrated]);

  return <EntitlementsCtx.Provider value={value}>{children}</EntitlementsCtx.Provider>;
}

export function useEntitlements(): Ctx {
  const ctx = useContext(EntitlementsCtx);
  if (!ctx) throw new Error('useEntitlements must be used inside EntitlementsProvider');
  return ctx;
}
