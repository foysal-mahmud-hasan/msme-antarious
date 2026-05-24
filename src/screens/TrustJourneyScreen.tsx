import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Chip, Row, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { colors } from '../theme';

type PhaseState = 'done' | 'current' | 'locked';

const PHASES: {
  ph: number;
  name: string;
  en: string;
  time: string;
  pct: number;
  state: PhaseState;
  desc: string;
  items: string[];
}[] = [
  {
    ph: 1,
    name: 'পরিচয়',
    en: 'Getting to know you',
    time: 'সপ্তাহ ১–২',
    pct: 100,
    state: 'done',
    desc: 'সাথী আপনার ব্যবসা বুঝছে',
    items: [
      'সব কথোপকথন দেখছে, উত্তর সাজেস্ট করছে',
      'মালিক প্রতিটি অ্যাকশন আগে অনুমোদন দিচ্ছেন',
      'পণ্য, দাম, কাস্টমার প্যাটার্ন শিখছে',
    ],
  },
  {
    ph: 2,
    name: 'সহকারী',
    en: 'Assistant',
    time: 'মাস ১',
    pct: 100,
    state: 'done',
    desc: 'সাথী নিয়মিত কাজ নিজেই করছে',
    items: [
      'সাধারণ প্রশ্নের অটো-রিপ্লাই দিচ্ছে',
      'অর্ডার ধরছে — কুরিয়ারের আগে মালিক নিশ্চিত করছেন',
      'সাপ্তাহিক পালস স্বয়ংক্রিয়ভাবে পাঠানো হচ্ছে',
    ],
  },
  {
    ph: 3,
    name: 'ব্যবস্থাপক',
    en: 'Manager',
    time: 'মাস ২–৩',
    pct: 60,
    state: 'current',
    desc: 'সাথী আপনার ব্যবসা চালাচ্ছে',
    items: [
      'কাস্টমার লাইফসাইকেল সম্পূর্ণ স্বায়ত্তভাবে চালাচ্ছে',
      'অর্ডার নিশ্চিত ও ডিসপ্যাচ স্বয়ংক্রিয়',
      'শুধু এসকেলেশনে জানাচ্ছে — কমপ্লেইন, বাল্ক অর্ডার',
      'মৌসুমী ক্যাম্পেইন প্রোঅ্যাকটিভ লঞ্চ',
    ],
  },
  {
    ph: 4,
    name: 'অংশীদার',
    en: 'Business Partner',
    time: 'মাস ৬+',
    pct: 0,
    state: 'locked',
    desc: 'সাথী আপনার ব্যবসার অংশীদার',
    items: [
      'ফুল অটোপাইলট — ব্যবসা নিজে চলছে',
      'মালিক রবিবার সকালের সামারি দেখেন শুধু',
      'গ্রোথ মুভ চিহ্নিত করে ও বাস্তবায়ন করে',
      'মালিক শুধু টাকার সিদ্ধান্ত অনুমোদন দেন',
    ],
  },
];

export function TrustJourneyScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#0B1929', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 22 }}>
        <Row gap={10}>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <T weight="b" size={15} color="#fff">বিশ্বাস স্তর</T>
          </View>
          <View style={{ width: 40 }} />
        </Row>
        <View style={{ alignItems: 'center', marginTop: 14 }}>
          <T size={12} color="rgba(255,255,255,0.7)">আপনি এখন</T>
          <T weight="b" size={26} color={colors.teal} style={{ marginTop: 4 }}>ব্যবস্থাপক</T>
          <T size={12.5} color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>৭০% স্বায়ত্ত · ফেজ ৩ এর ৬০% সম্পন্ন</T>
          <View style={{ width: '80%', height: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 5, marginTop: 14, overflow: 'hidden' }}>
            <View style={{ width: '60%', height: '100%', backgroundColor: colors.teal, borderRadius: 5 }} />
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, alignItems: 'stretch' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 720 : undefined, alignSelf: 'center' }}>
          {PHASES.map((p) => {
            const accent = p.state === 'current' ? colors.teal : p.state === 'done' ? colors.green : '#c8bfa8';
            const locked = p.state === 'locked';
            return (
              <Card
                key={p.ph}
                style={{
                  marginBottom: 12,
                  borderWidth: p.state === 'current' ? 2 : 1,
                  borderColor: p.state === 'current' ? colors.teal : colors.border2,
                  backgroundColor: p.state === 'current' ? colors.tealSoft : '#fff',
                  opacity: locked ? 0.7 : 1,
                  padding: 14,
                }}
              >
                <Row gap={12}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: locked ? '#f4f1e8' : colors.tealDark,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <T weight="b" size={22} color={locked ? '#9ca3af' : '#fff'}>{locked ? '🔒' : 'স'}</T>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Row gap={6}>
                      <T size={11} weight="b" color={colors.ink2}>ফেজ {p.ph}</T>
                      <T size={11} color={colors.ink2}>· {p.time}</T>
                      <View style={{ flex: 1 }} />
                      {p.state === 'done' && <Chip kind="green" size={10}>সম্পন্ন</Chip>}
                      {p.state === 'current' && <Chip kind="teal" size={10}>এখন</Chip>}
                    </Row>
                    <T weight="b" size={18}>{p.name}</T>
                    <T size={12.5} color={colors.ink2}>{p.desc}</T>
                  </View>
                </Row>
                <View style={{ height: 8, backgroundColor: '#f0ebe0', borderRadius: 4, marginTop: 12, overflow: 'hidden' }}>
                  <View style={{ width: (`${p.pct}%`) as `${number}%`, height: '100%', backgroundColor: accent, borderRadius: 4 }} />
                </View>
                <View style={{ gap: 4, marginTop: 12 }}>
                  {p.items.map((it, j) => (
                    <Row key={j} gap={8} style={{ alignItems: 'flex-start' }}>
                      <T size={14} color={accent}>•</T>
                      <T size={12.5} color={locked ? colors.ink2 : colors.ink} style={{ flex: 1, lineHeight: 18 }}>{it}</T>
                    </Row>
                  ))}
                </View>
                {p.state === 'current' && (
                  <View style={{ marginTop: 12, padding: 10, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center' }}>
                    <T size={12} color={colors.ink2}>
                      🎯 আর <T weight="b" size={12} color={colors.tealDark}>৪ সপ্তাহ</T> ব্যবহারে পরের ফেজ আনলক হবে
                    </T>
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
