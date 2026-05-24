import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card, Row, SathiBadge, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { useToast } from '../components/Toast';
import { colors } from '../theme';

type FeatureRow = ['ok' | 'no', string];

type Tier = {
  id: string;
  name: string;
  price: number;
  sub: string;
  color: string;
  best: FeatureRow[];
  featured?: boolean;
  current?: boolean;
};

function buildTiers(current: string): Tier[] {
  return [
    {
      id: 'free',
      name: 'ফ্রি',
      price: 0,
      sub: 'শুরু করুন বিনামূল্যে',
      color: '#6b7280',
      best: [
        ['ok', 'মৌলিক হিসাব রাখা'],
        ['ok', '১টি প্ল্যাটফর্ম সংযোগ'],
        ['ok', 'সাথীর সাধারণ পরামর্শ'],
        ['ok', 'সাপ্তাহিক রিপোর্ট'],
        ['no', 'ক্রেডিট স্কোর'],
        ['no', 'অটো-রিপ্লাই'],
        ['no', 'ব্র্যান্ড স্টুডিও'],
        ['no', 'ওয়েবসাইট'],
      ],
      current: current === 'free',
    },
    {
      id: 'basic',
      name: 'বেসিক',
      price: 350,
      sub: 'ছোট দোকানের জন্য',
      color: colors.teal,
      best: [
        ['ok', 'সম্পূর্ণ অটো হিসাব'],
        ['ok', 'WhatsApp + ১টি প্ল্যাটফর্ম'],
        ['ok', 'ক্রেডিট স্কোর তৈরি'],
        ['ok', 'বাজার ট্রেন্ড দেখা'],
        ['ok', 'মাসিক PDF রিপোর্ট'],
        ['no', 'অটো-রিপ্লাই'],
        ['no', 'ব্র্যান্ড স্টুডিও'],
        ['no', 'ওয়েবসাইট'],
      ],
      current: current === 'basic',
    },
    {
      id: 'pro',
      name: 'প্রো',
      price: 699,
      sub: 'বৃদ্ধিমান ব্যবসার জন্য',
      color: colors.saffron,
      featured: true,
      best: [
        ['ok', 'বেসিকের সব কিছু'],
        ['ok', '৩টি প্ল্যাটফর্ম + অটো-রিপ্লাই'],
        ['ok', 'ব্র্যান্ড স্টুডিও + লোগো'],
        ['ok', 'বিজ্ঞাপন ট্র্যাকিং'],
        ['ok', 'প্রতিযোগী মনিটরিং'],
        ['ok', 'অনুমোদন কেন্দ্র'],
        ['ok', 'সোর্সিং ক্যালকুলেটর'],
        ['no', 'ওয়েবসাইট'],
      ],
      current: current === 'pro',
    },
    {
      id: 'premium',
      name: 'প্রিমিয়াম',
      price: 999,
      sub: 'সব কিছু আনলিমিটেড',
      color: '#8B5CF6',
      best: [
        ['ok', 'প্রো-এর সব কিছু'],
        ['ok', 'ওয়েবসাইট টেমপ্লেট'],
        ['ok', 'কাস্টম ডোমেইন'],
        ['ok', 'অসীম প্ল্যাটফর্ম'],
        ['ok', 'অগ্রাধিকার সাপোর্ট'],
        ['ok', 'উন্নত বিশ্লেষণ'],
        ['ok', 'ঋণদাতা সরাসরি যোগাযোগ'],
        ['ok', 'API অ্যাকসেস'],
      ],
      current: current === 'premium',
    },
  ];
}

export function PricingScreen({ onClose, current = 'basic' }: { onClose: () => void; current?: string }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const tiers = buildTiers(current);

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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40, alignItems: 'stretch' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 720 : undefined, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 20 }}>
          <Card tinted={colors.tealSoft} style={{ padding: 12, marginBottom: 18 }}>
            <Row gap={8}>
              <SathiBadge />
              <T size={13} color={colors.tealDark} style={{ flex: 1 }}>
                আপনার ব্যবসা <T weight="b" size={13} color={colors.tealDark}>৳৬৮,৪০০/মাস</T> আয় করছে।{' '}
                <T weight="b" size={13} color={colors.tealDark}>প্রো</T> প্যাকেজ আপনার জন্য সবচেয়ে উপযুক্ত — মাসিক খরচ আপনার ১% এর কম।
              </T>
            </Row>
          </Card>

          <View style={{ gap: 18 }}>
            {tiers.map((t) => (
              <TierCard
                key={t.id}
                tier={t}
                onPress={() => toast.show('প্যাকেজ পরিবর্তন শীঘ্রই আসছে', 'info')}
              />
            ))}
          </View>

          <Card style={{ padding: 14, marginTop: 18, borderStyle: 'dashed' }}>
            <T size={12} color={colors.ink2} style={{ lineHeight: 18 }}>
              💡 বাৎসরিক পেমেন্টে <T weight="b" size={12} color={colors.green}>২ মাস ফ্রি</T> · যেকোনো সময় বন্ধ করতে পারবেন ·{' '}
              <T weight="b" size={12} color={colors.ink}>bKash / Nagad / Rocket</T> গ্রহণযোগ্য
            </T>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TierCard({ tier, onPress }: { tier: Tier; onPress: () => void }) {
  const ribbonText = tier.featured ? '⭐ সবচেয়ে জনপ্রিয়' : tier.current ? '✓ আপনার বর্তমান' : null;
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        borderWidth: tier.featured ? 2 : 1,
        borderColor: tier.featured ? colors.saffron : colors.border2,
        position: 'relative',
      }}
    >
      {ribbonText && (
        <View
          style={{
            position: 'absolute',
            top: -10,
            left: 16,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: tier.featured ? colors.saffron : colors.teal,
          }}
        >
          <T weight="b" size={11} color="#fff">{ribbonText}</T>
        </View>
      )}
      <T weight="b" size={22} color={tier.color}>{tier.name}</T>
      <T size={13} color={colors.ink2} style={{ marginBottom: 14, marginTop: 2 }}>{tier.sub}</T>
      <Row gap={6} style={{ alignItems: 'baseline', marginBottom: 16 }}>
        <T weight="b" size={38}>৳{tier.price}</T>
        <T size={13} color={colors.ink2}>{tier.price === 0 ? 'চিরকাল' : '/মাস'}</T>
      </Row>

      <View style={{ gap: 8 }}>
        {tier.best.map((row, i) => (
          <Row key={i} gap={8}>
            <View
              style={{
                width: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: row[0] === 'ok' ? colors.greenSoft : '#f3f3f3',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <T weight="b" size={11} color={row[0] === 'ok' ? colors.green : '#9ca3af'}>
                {row[0] === 'ok' ? '✓' : '×'}
              </T>
            </View>
            <T size={13} color={row[0] === 'ok' ? colors.ink : colors.ink2} style={{ flex: 1 }}>{row[1]}</T>
          </Row>
        ))}
      </View>

      <Btn
        kind={tier.featured ? 'primary' : 'greyOutline'}
        label={tier.current ? '✓ বর্তমান প্যাকেজ' : tier.featured ? 'প্রো নিন →' : tier.price === 0 ? 'এখানেই থাকি' : `${tier.name} নিন →`}
        full
        style={{ marginTop: 16 }}
        onPress={onPress}
        disabled={tier.current}
      />
    </View>
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
