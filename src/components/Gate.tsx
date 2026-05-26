import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useActions } from '../state/AppActions';
import { useEntitlements } from '../state/EntitlementsStore';
import { Feature, FEATURE_META, TierId, TIERS } from '../state/entitlements';
import { colors } from '../theme';
import { Row, T } from './atoms';

/** Hook: is a feature unlocked, what tier unlocks it, and how to upsell. */
export function useFeature(feature: Feature) {
  const { has, requiredTierFor } = useEntitlements();
  const actions = useActions();
  return {
    enabled: has(feature),
    requiredTier: requiredTierFor(feature),
    openUpsell: () => actions.openOverlay('upgrade', feature),
  };
}

/** Small "🔒 <Tier>" pill. Used wherever a locked surface is shown. */
export function LockBadge({
  tier,
  label,
  size = 'md',
}: {
  tier?: TierId | null;
  label?: string;
  size?: 'sm' | 'md';
}) {
  const text = label ?? (tier ? TIERS[tier].nameBn : 'প্রিমিয়াম');
  const fs = size === 'sm' ? 10 : 11.5;
  return (
    <Row
      gap={4}
      style={{
        paddingHorizontal: size === 'sm' ? 7 : 9,
        paddingVertical: size === 'sm' ? 2 : 3,
        borderRadius: 999,
        backgroundColor: colors.ink,
        alignSelf: 'flex-start',
      }}
    >
      <Ionicons name="lock-closed" size={fs} color="#fff" />
      <T weight="b" size={fs} color="#fff">{text}</T>
    </Row>
  );
}

/**
 * Wraps any content; renders it normally if the feature is unlocked, else a
 * dimmed, non-interactive version with a centered lock chip that taps through
 * to the upgrade sheet. Per project policy: locked = VISIBLE + locked, never
 * silently hidden, identical on every breakpoint (see LAWS.md Law 4 clause).
 */
export function FeatureGate({
  feature,
  children,
}: {
  feature: Feature;
  children: React.ReactNode;
}) {
  const { enabled, requiredTier, openUpsell } = useFeature(feature);
  if (enabled) return <>{children}</>;
  return (
    <Pressable onPress={openUpsell} style={{ position: 'relative' }}>
      <View pointerEvents="none" style={{ opacity: 0.45 }}>
        {children}
      </View>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <LockBadge tier={requiredTier} />
      </View>
    </Pressable>
  );
}

/**
 * A tappable feature tile that locks itself when the feature isn't unlocked.
 * Unlocked → runs `onPress`. Locked → opens upsell + shows a 🔒 badge.
 * Used by the Home "do more" grid and any feature launcher.
 */
export function LockableTile({
  feature,
  label,
  sub,
  icon,
  color = colors.saffron,
  onPress,
  style,
}: {
  feature: Feature;
  label: string;
  sub?: string;
  icon?: string;
  color?: string;
  onPress: () => void;
  style?: object;
}) {
  const { enabled, requiredTier, openUpsell } = useFeature(feature);
  const meta = FEATURE_META[feature];
  return (
    <Pressable
      onPress={enabled ? onPress : openUpsell}
      style={[
        {
          flex: 1,
          backgroundColor: '#fff',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border2,
          padding: 14,
          minHeight: 96,
          justifyContent: 'space-between',
          opacity: enabled ? 1 : 0.92,
        },
        style as object,
      ]}
    >
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: enabled ? color : '#e5e7eb', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={(icon ?? meta.icon) as any} size={20} color={enabled ? '#fff' : colors.ink2} />
        </View>
        {!enabled && <LockBadge tier={requiredTier} size="sm" />}
      </Row>
      <View style={{ marginTop: 10 }}>
        <T weight="b" size={14} color={enabled ? colors.ink : colors.ink2}>{label}</T>
        {sub ? <T size={11.5} color={colors.ink2} style={{ marginTop: 1 }}>{sub}</T> : null}
      </View>
    </Pressable>
  );
}
