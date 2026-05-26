import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Card, Row, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { useEntitlements } from '../state/EntitlementsStore';
import {
  addOnFor,
  ADDONS,
  Feature,
  FEATURE_META,
  requiredTierFor,
  TIERS,
  tierPriceLabel,
} from '../state/entitlements';
import { colors } from '../theme';

export function UpgradeSheet({ onClose, feature }: { onClose: () => void; feature?: Feature }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const actions = useActions();
  const { tier, setTier, toggleAddOn, addOns } = useEntitlements();

  const target = feature ?? 'leads';
  const meta = FEATURE_META[target];
  const reqTier = requiredTierFor(target);
  const reqAddOn = reqTier ? null : addOnFor(target);

  // What the unlocking tier additionally gives you (its own adds), for the benefits list.
  const benefits: Feature[] = reqTier
    ? TIERS[reqTier].adds
    : reqAddOn
    ? ADDONS[reqAddOn].grants
    : [];

  const isAddOn = !!reqAddOn;
  const titleColor = reqTier ? TIERS[reqTier].color : reqAddOn ? ADDONS[reqAddOn].color : colors.saffron;
  const planName = reqTier ? TIERS[reqTier].nameBn : reqAddOn ? ADDONS[reqAddOn].nameBn : '';
  const priceLabel = reqTier
    ? tierPriceLabel(reqTier)
    : reqAddOn
    ? `${String(ADDONS[reqAddOn].price).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d])} ৳`
    : '';

  const onPurchase = () => {
    if (reqTier) {
      setTier(reqTier);
      toast.show(`${TIERS[reqTier].nameBn} প্যাকেজ চালু হয়েছে! 🎉 ${meta.nameBn} এখন আনলক।`, 'success');
    } else if (reqAddOn) {
      toggleAddOn(reqAddOn);
      toast.show(`${ADDONS[reqAddOn].nameBn} যুক্ত হয়েছে! 🎉`, 'success');
    }
    onClose();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 14, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="close" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>আপগ্রেড করুন</T>
            <T size={12} color={colors.ink2}>একটি ফিচার আনলক করুন</T>
          </View>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 520 : undefined, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 20 }}>
          {/* Locked feature hero */}
          <View style={{ alignItems: 'center', marginBottom: 18 }}>
            <View style={{ width: 76, height: 76, borderRadius: 22, backgroundColor: titleColor, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Ionicons name={meta.icon as any} size={36} color="#fff" />
            </View>
            <Row gap={6} style={{ marginBottom: 6 }}>
              <Ionicons name="lock-closed" size={14} color={colors.ink2} />
              <T size={13} color={colors.ink2}>লক করা ফিচার</T>
            </Row>
            <T weight="b" size={22} style={{ textAlign: 'center' }}>{meta.nameBn}</T>
            <T size={14} color={colors.ink2} style={{ textAlign: 'center', marginTop: 4 }}>
              {isAddOn ? `${planName} অ্যাড-অনে` : `${planName} প্যাকেজে`} আনলক হবে
            </T>
          </View>

          {/* The unlocking plan */}
          <Card style={{ padding: 18, borderColor: titleColor, borderWidth: 2 }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <T weight="b" size={20} color={titleColor}>{planName}</T>
              <Row gap={4} style={{ alignItems: 'baseline' }}>
                <T weight="b" size={22}>{priceLabel}</T>
                <T size={12} color={colors.ink2}>{isAddOn ? '/একবার' : '/মাস'}</T>
              </Row>
            </Row>
            {reqTier ? <T size={12.5} color={colors.ink2} style={{ marginTop: 2 }}>{TIERS[reqTier].tagline}</T> : null}

            <View style={{ height: 1, backgroundColor: colors.border2, marginVertical: 14 }} />

            <T weight="b" size={12.5} color={colors.ink2} style={{ marginBottom: 10 }}>
              {isAddOn ? 'যা পাবেন' : 'এই প্যাকেজে যা যুক্ত হবে'}
            </T>
            <View style={{ gap: 9 }}>
              {benefits.map((f) => (
                <Row key={f} gap={10}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="checkmark" size={13} color={colors.green} />
                  </View>
                  <Row gap={6} style={{ flex: 1 }}>
                    <Ionicons name={FEATURE_META[f].icon as any} size={15} color={colors.ink2} />
                    <T size={13.5} color={f === target ? colors.ink : colors.ink2} weight={f === target ? 'b' : 'r'}>
                      {FEATURE_META[f].nameBn}
                    </T>
                  </Row>
                </Row>
              ))}
            </View>

            {reqTier ? (
              <T size={11.5} color={colors.ink2} style={{ marginTop: 12 }}>
                ✓ নিচের সব প্যাকেজের সব কিছু সহ
              </T>
            ) : null}

            <Btn
              kind="primary"
              label={isAddOn ? 'অ্যাড-অন যুক্ত করুন' : `${planName} প্যাকেজ নিন`}
              full
              style={{ marginTop: 16, backgroundColor: titleColor }}
              onPress={onPurchase}
            />
          </Card>

          <Pressable onPress={() => actions.openOverlay('pricing')} style={{ paddingVertical: 16, alignItems: 'center' }}>
            <T weight="b" size={14} color={colors.ink2}>সব প্যাকেজ তুলনা করুন →</T>
          </Pressable>

          <T size={11} color={colors.ink2} style={{ textAlign: 'center' }}>
            আপনি এখন <T weight="b" size={11}>{TIERS[tier].nameBn}</T> প্যাকেজে আছেন{addOns.size > 0 ? ` · ${addOns.size}টি অ্যাড-অন` : ''}
          </T>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const iconBtn = {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: colors.bg,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};
