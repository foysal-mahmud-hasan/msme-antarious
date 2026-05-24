import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { useActions } from '../state/AppActions';
import { colors } from '../theme';

const FACTORS = [
  { e: '📝', l: 'নিয়মিত হিসাব রাখা', earned: 180, max: 200, sub: '১৪ দিন একটানা · চমৎকার', col: colors.green },
  { e: '💵', l: 'মাসিক আয় বৃদ্ধি', earned: 145, max: 200, sub: '৩-মাসে +২৪% · ভাল', col: colors.green },
  { e: '🏦', l: 'ঋণ পরিশোধের ইতিহাস', earned: 115, max: 200, sub: 'গত ঋণ সময়মত · ১ বার দেরি', col: colors.saffron },
  { e: '📈', l: 'ব্যবসার বৃদ্ধি', earned: 130, max: 150, sub: 'নতুন পণ্য + ক্যাম্পেইন', col: colors.green },
  { e: '👥', l: 'কাস্টমার ধরে রাখা', earned: 95, max: 150, sub: '৪৭ জন সক্রিয় · গড় ৪.৩ অর্ডার', col: colors.saffron },
  { e: '📚', l: 'নতুন কিছু শেখা', earned: 55, max: 100, sub: '২টা টিউটোরিয়াল দেখেছেন', col: colors.amber },
];

const BANDS = [
  { l: '০–৩০০', n: 'শুরু', col: '#9ca3af' },
  { l: '৩০১–৫০০', n: 'গড়', col: colors.amber },
  { l: '৫০১–৭০০', n: 'ভাল', col: colors.teal },
  { l: '৭০১–৮৫০', n: 'উত্তম', col: colors.green, cur: true },
  { l: '৮৫১–১০০০', n: 'প্রিমিয়াম', col: colors.saffron },
];

const HISTORY = [
  { m: 'নভে ২৪', v: 380 },
  { m: 'ডিসে', v: 425 },
  { m: 'জানু ২৫', v: 480 },
  { m: 'ফেব্রু', v: 540 },
  { m: 'মার্চ', v: 615 },
  { m: 'এপ্রিল', v: 680 },
  { m: 'মে', v: 720 },
];

export function CreditScreen({ onClose }: { onClose: () => void }) {
  const actions = useActions();
  const { isDesktop } = useResponsive();
  const score = 720;
  const max = 1000;
  const r = 80;
  const C = 2 * Math.PI * r;
  const offset = C * (1 - score / max);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.saffron, paddingHorizontal: 14, paddingTop: 6, paddingBottom: 24 }}>
        <Row gap={10}>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <T weight="b" size={16} color="#fff">আরোপণ ক্রেডিট স্কোর</T>
          </View>
          <View style={{ width: 40 }} />
        </Row>
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: -16 }}
        contentContainerStyle={{ paddingBottom: 40, alignItems: 'stretch' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: '100%', maxWidth: isDesktop ? 720 : undefined, alignSelf: 'center', paddingHorizontal: 16 }}>
          <Card style={{ padding: 22, alignItems: 'center' }}>
            <T size={11.5} weight="b" color={colors.ink2}>আপনার বর্তমান স্কোর</T>
            <View style={{ width: 200, height: 200, marginTop: 8 }}>
              <Svg width={200} height={200} viewBox="0 0 200 200">
                <Defs>
                  <LinearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor={colors.saffron} />
                    <Stop offset="100%" stopColor="#22c55e" />
                  </LinearGradient>
                </Defs>
                <Circle cx="100" cy="100" r={r} stroke="#eee2c8" strokeWidth={14} fill="none" />
                <Circle
                  cx="100"
                  cy="100"
                  r={r}
                  stroke="url(#scoreGrad)"
                  strokeWidth={14}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${C}, ${C}`}
                  strokeDashoffset={offset}
                  transform="rotate(-90 100 100)"
                />
              </Svg>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                <T weight="b" size={54} color={colors.ink}>{score}</T>
                <T size={12} color={colors.ink2}>/ ১০০০</T>
                <Chip kind="green" style={{ marginTop: 8 }}>উত্তম স্তর</Chip>
              </View>
            </View>
            <Row gap={8} style={{ marginTop: 18 }}>
              <Chip kind="green">▲ +৪০ এই মাসে</Chip>
              <T size={12} color={colors.ink2}>লক্ষ্য: ৮৫০</T>
            </Row>
          </Card>

          <T weight="b" size={14} style={{ marginTop: 18, marginBottom: 8 }}>স্কোর স্তর</T>
          <Card style={{ padding: 4 }}>
            {BANDS.map((b, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderLeftWidth: 4,
                  borderLeftColor: b.cur ? b.col : 'transparent',
                  backgroundColor: b.cur ? '#fffaf3' : '#fff',
                  borderBottomWidth: i < BANDS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border2,
                }}
              >
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: b.col }} />
                <T weight={b.cur ? 'b' : 'm'} size={13.5}>{b.n}</T>
                <View style={{ flex: 1 }} />
                <T size={12.5} color={colors.ink2}>{b.l}</T>
                {b.cur && (
                  <View style={{ paddingHorizontal: 7, paddingVertical: 1, borderRadius: 999, backgroundColor: colors.saffron }}>
                    <T weight="b" size={10} color="#fff">আপনি এখানে</T>
                  </View>
                )}
              </View>
            ))}
          </Card>

          <T weight="b" size={14} style={{ marginTop: 18, marginBottom: 8 }}>স্কোর কোন কোন কারণে?</T>
          <Card style={{ padding: 4 }}>
            {FACTORS.map((f, i) => (
              <View
                key={i}
                style={{
                  padding: 12,
                  borderBottomWidth: i < FACTORS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border2,
                }}
              >
                <Row gap={10}>
                  <T size={20}>{f.e}</T>
                  <View style={{ flex: 1 }}>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <T weight="s" size={13.5}>{f.l}</T>
                      <T weight="b" size={13}>
                        {f.earned}
                        <T size={13} color={colors.ink2}>/{f.max}</T>
                      </T>
                    </Row>
                    <View style={{ height: 6, borderRadius: 3, backgroundColor: '#f1ebdf', marginTop: 6, overflow: 'hidden' }}>
                      <View
                        style={{
                          width: (`${(f.earned / f.max) * 100}%`) as `${number}%`,
                          height: '100%',
                          backgroundColor: f.col,
                          borderRadius: 3,
                        }}
                      />
                    </View>
                    <T size={11.5} color={colors.ink2} style={{ marginTop: 4 }}>{f.sub}</T>
                  </View>
                </Row>
              </View>
            ))}
          </Card>

          <T weight="b" size={14} style={{ marginTop: 18, marginBottom: 8 }}>৭ মাসের অগ্রগতি</T>
          <Card style={{ padding: 14 }}>
            <Row gap={8} style={{ height: 110, alignItems: 'flex-end', justifyContent: 'space-between' }}>
              {HISTORY.map((h, i) => {
                const isLast = i === HISTORY.length - 1;
                return (
                  <View key={h.m} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                    <T size={10} color={colors.ink2}>{h.v}</T>
                    <View
                      style={{
                        width: 18,
                        height: (h.v / 1000) * 90,
                        backgroundColor: isLast ? colors.saffron : colors.teal,
                        borderRadius: 4,
                      }}
                    />
                    <T size={10.5} weight={isLast ? 'b' : 'r'} color={colors.ink2}>{h.m}</T>
                  </View>
                );
              })}
            </Row>
          </Card>

          <Card tinted={colors.tealSoft} style={{ padding: 14, marginTop: 18 }}>
            <Row gap={8}>
              <SathiBadge />
              <T weight="b" size={13} color={colors.tealDark}>সাথীর পরামর্শ — স্কোর বাড়ান</T>
            </Row>
            <T size={13.5} color={colors.ink} style={{ marginTop: 8, lineHeight: 20 }}>
              <T weight="b" size={13.5}>+৩৫ পয়েন্ট পেতে পারেন</T> এই ৩ কাজ করলে:{'\n'}
              • দৈনিক হিসাব ৩০ দিন একটানা (+১০){'\n'}
              • চলমান ঋণ পরের কিস্তি সময়মত (+১৫){'\n'}
              • ১টি নতুন কাস্টমার ধরে রাখা (+১০)
            </T>
          </Card>

          <Card style={{ padding: 16, marginTop: 18, backgroundColor: '#1A1A2E', borderColor: 'transparent' }}>
            <T size={11.5} weight="b" color="rgba(255,255,255,0.7)">ঋণদাতাকে দেখান</T>
            <T weight="b" size={16} color="#fff" style={{ marginTop: 4 }}>৭২০ স্কোর — ঋণ-যোগ্য 🎯</T>
            <T size={12.5} color="rgba(255,255,255,0.8)" style={{ marginTop: 4, lineHeight: 18 }}>
              আপনার স্কোর + ৬ মাসের হিসাব + ব্যবসার রিপোর্ট একসাথে BRAC, ASA, বা অন্য NGO/ব্যাংক-কে পাঠান। তারা যাচাই করে দ্রুত ঋণ দিতে পারবে।
            </T>
            <Btn
              kind="primary"
              label="📤 ঋণদাতাকে শেয়ার করুন"
              full
              style={{ marginTop: 14 }}
              onPress={() => actions.openOverlay('lender')}
            />
            <Pressable
              style={{
                marginTop: 8,
                paddingVertical: 14,
                borderRadius: 12,
                backgroundColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center',
              }}
              onPress={() => undefined}
            >
              <T weight="b" size={15} color="#fff">📱 QR কোড তৈরি করুন</T>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
