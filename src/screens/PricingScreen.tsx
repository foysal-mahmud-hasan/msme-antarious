import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Card, Row, SathiBadge, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { useEntitlements } from '../state/EntitlementsStore';
import {
  ADDONS,
  AddOnId,
  FEATURE_META,
  TierId,
  TIERS,
  tierPriceLabel,
} from '../state/entitlements';
import { colors } from '../theme';

const TIER_ORDER: TierId[] = ['tier0', 'tier1', 'tier2', 'tier3', 'tier4'];
const FEATURED: TierId = 'tier2';

export function PricingScreen({ onClose }: { onClose: () => void; current?: string }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const { tier: currentTier, setTier, addOns, toggleAddOn } = useEntitlements();

  const onChoose = (t: TierId) => {
    if (t === currentTier) return;
    setTier(t);
    toast.show(`${TIERS[t].nameBn} প্যাকেজ চালু হয়েছে! 🎉`, 'success');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 14, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>আপনার প্যাকেজ</T>
            <T size={12} color={colors.ink2}>যত খুশি আপগ্রেড / ডাউনগ্রেড করুন</T>
          </View>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 760 : undefined, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 20 }}>
          <Card tinted={colors.tealSoft} style={{ padding: 12, marginBottom: 18 }}>
            <Row gap={8}>
              <SathiBadge />
              <T size={13} color={colors.tealDark} style={{ flex: 1 }}>
                আপনার ব্যবসা <T weight="b" size={13} color={colors.tealDark}>৳৬৮,৪০০/মাস</T> আয় করছে।{' '}
                <T weight="b" size={13} color={colors.tealDark}>গ্রোথ</T> প্যাকেজ আপনার জন্য সবচেয়ে উপযুক্ত — মাসিক খরচ আপনার আয়ের ৩% এর কম।
              </T>
            </Row>
          </Card>

          {/* Tier cards (responsive grid on desktop, stack on mobile) */}
          <View style={{ flexDirection: isDesktop ? 'row' : 'column', flexWrap: isDesktop ? 'wrap' : 'nowrap', gap: 14, marginHorizontal: isDesktop ? -7 : 0 }}>
            {TIER_ORDER.map((id) => (
              <View key={id} style={{ width: isDesktop ? '48%' : '100%', paddingHorizontal: isDesktop ? 0 : 0 }}>
                <TierCard
                  id={id}
                  current={currentTier === id}
                  featured={id === FEATURED}
                  onChoose={() => onChoose(id)}
                />
              </View>
            ))}
          </View>

          {/* Brand Studio add-on (orthogonal to tiers) */}
          <T weight="b" size={13} color={colors.ink2} style={{ marginTop: 22, marginBottom: 10, paddingHorizontal: 2 }}>
            অ্যাড-অন · যেকোনো প্যাকেজের সাথে
          </T>
          {(Object.keys(ADDONS) as AddOnId[]).map((id) => (
            <AddOnCard key={id} id={id} active={addOns.has(id)} onToggle={() => toggleAddOn(id)} />
          ))}

          <Card style={{ padding: 14, marginTop: 18, borderStyle: 'dashed' }}>
            <T size={12} color={colors.ink2} style={{ lineHeight: 18 }}>
              💡 বাৎসরিক পেমেন্টে <T weight="b" size={12} color={colors.green}>২ মাস ফ্রি</T> · যেকোনো সময় বদলাতে পারবেন ·{' '}
              <T weight="b" size={12} color={colors.ink}>bKash / Nagad / Rocket</T> গ্রহণযোগ্য
            </T>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TierCard({
  id,
  current,
  featured,
  onChoose,
}: {
  id: TierId;
  current: boolean;
  featured: boolean;
  onChoose: () => void;
}) {
  const t = TIERS[id];
  const ribbon = current ? '✓ আপনার বর্তমান' : featured ? '⭐ সবচেয়ে জনপ্রিয়' : null;
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        borderWidth: current || featured ? 2 : 1,
        borderColor: current ? colors.green : featured ? t.color : colors.border2,
        position: 'relative',
        flex: 1,
      }}
    >
      {ribbon && (
        <View style={{ position: 'absolute', top: -10, left: 16, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: current ? colors.green : t.color }}>
          <T weight="b" size={11} color="#fff">{ribbon}</T>
        </View>
      )}
      <T weight="b" size={20} color={t.color}>{t.nameBn}</T>
      <T size={12.5} color={colors.ink2} style={{ marginBottom: 12, marginTop: 2 }}>{t.tagline}</T>
      <Row gap={6} style={{ alignItems: 'baseline', marginBottom: 14 }}>
        <T weight="b" size={30}>{tierPriceLabel(id)}</T>
        <T size={13} color={colors.ink2}>/মাস</T>
      </Row>

      <View style={{ gap: 8 }}>
        {t.order > 0 && (
          <Row gap={8}>
            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
              <T weight="b" size={11} color={colors.green}>✓</T>
            </View>
            <T size={13} weight="s" color={colors.ink2} style={{ flex: 1 }}>নিচের সব প্যাকেজের সব কিছু</T>
          </Row>
        )}
        {t.adds.map((f) => (
          <Row key={f} gap={8}>
            <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
              <T weight="b" size={11} color={colors.green}>✓</T>
            </View>
            <T size={13} color={colors.ink} style={{ flex: 1 }}>{FEATURE_META[f].nameBn}</T>
          </Row>
        ))}
      </View>

      <Btn
        kind={current ? 'greyOutline' : featured ? 'primary' : 'greyOutline'}
        label={current ? '✓ বর্তমান প্যাকেজ' : `${t.nameBn} নিন →`}
        full
        style={{ marginTop: 16, ...(current ? {} : featured ? { backgroundColor: t.color } : {}) }}
        onPress={onChoose}
        disabled={current}
      />
    </View>
  );
}

function AddOnCard({ id, active, onToggle }: { id: AddOnId; active: boolean; onToggle: () => void }) {
  const a = ADDONS[id];
  return (
    <Card style={{ padding: 16, borderColor: active ? a.color : colors.border2, borderWidth: active ? 2 : 1 }}>
      <Row gap={12}>
        <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: a.color, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="color-palette" size={22} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <T weight="b" size={15}>{a.nameBn}</T>
          <T size={12.5} color={colors.ink2}>{a.tagline}</T>
          <T weight="b" size={13} color={a.color} style={{ marginTop: 2 }}>
            {String(a.price).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d])} ৳ · একবার
          </T>
        </View>
        <Btn
          kind={active ? 'greyOutline' : 'primary'}
          size="sm"
          label={active ? '✓ যুক্ত' : 'যুক্ত করুন'}
          style={active ? {} : { backgroundColor: a.color }}
          onPress={onToggle}
        />
      </Row>
    </Card>
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
