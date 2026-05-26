import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Card, Row, SathiBadge, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { useComplaints } from '../state/ComplaintsStore';
import { useLeads } from '../state/LeadsStore';
import { useTransactions } from '../state/TransactionsStore';
import { colors } from '../theme';

const BN = (n: number) => String(Math.round(n)).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);
const money = (n: number) => `৳${BN(n)}`;

type Period = 'daily' | 'weekly' | 'monthly';
const PERIODS: { id: Period; label: string; factor: number }[] = [
  { id: 'daily', label: 'দৈনিক', factor: 1 / 7 },
  { id: 'weekly', label: 'সাপ্তাহিক', factor: 1 },
  { id: 'monthly', label: 'মাসিক', factor: 4.33 },
];

// Representative product sales (best / worst). Dummy but consistent with Home.
const PRODUCT_SALES = [
  { e: '🌀', n: 'মিনি ইউএসবি ফ্যান', units: 142, rev: 120700 },
  { e: '💡', n: 'রিচার্জেবল হ্যান্ড ফ্যান', units: 96, rev: 46080 },
  { e: '🧴', n: 'কুলিং বোতল', units: 71, rev: 24850 },
  { e: '👜', n: 'কুলিং কুশন', units: 58, rev: 16240 },
  { e: '☂️', n: 'ছাতা', units: 12, rev: 5400 },
  { e: '💇', n: 'চুলের ক্লিপ', units: 7, rev: 840 },
];

// Orders by hour (dummy peak-hour data).
const PEAK_HOURS = [
  { h: '9', o: 4 }, { h: '11', o: 9 }, { h: '13', o: 14 }, { h: '15', o: 11 },
  { h: '17', o: 7 }, { h: '19', o: 22 }, { h: '21', o: 18 }, { h: '23', o: 6 },
];

export function InsightsScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const actions = useActions();
  const { weekIncome, weekExpense, weekNet } = useTransactions();
  const { ranked, leads, avgScore, advanceStage } = useLeads();
  const { openCount, resolutionRate } = useComplaints();
  const [period, setPeriod] = useState<Period>('weekly');

  const factor = PERIODS.find((p) => p.id === period)!.factor;
  const inc = weekIncome * factor;
  const exp = weekExpense * factor;
  const net = weekNet * factor;

  const best = [...PRODUCT_SALES].sort((a, b) => b.units - a.units).slice(0, 3);
  const worst = [...PRODUCT_SALES].sort((a, b) => a.units - b.units).slice(0, 2);
  const peakMax = Math.max(...PEAK_HOURS.map((p) => p.o));
  const peak = PEAK_HOURS.reduce((a, b) => (b.o > a.o ? b : a));

  const hotLeads = ranked.filter((l) => l.stage === 'hot');
  const wonCount = leads.filter((l) => l.stage === 'won').length;
  const conversion = leads.length ? Math.round((wonCount / leads.length) * 100) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 14, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>ইনসাইট ও রিপোর্ট</T>
            <T size={12} color={colors.ink2}>সারসংক্ষেপ · বিশ্লেষণ · লিড ক্লোজিং</T>
          </View>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 680 : undefined, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
          {/* Period toggle */}
          <Row gap={8} style={{ marginBottom: 14 }}>
            {PERIODS.map((p) => {
              const active = period === p.id;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setPeriod(p.id)}
                  style={{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: active ? colors.ink : '#fff', borderWidth: 1, borderColor: active ? colors.ink : colors.border2 }}
                >
                  <T weight="b" size={13} color={active ? '#fff' : colors.ink2}>{p.label}</T>
                </Pressable>
              );
            })}
          </Row>

          {/* Summary */}
          <Card style={{ padding: 16, marginBottom: 14 }}>
            <Row gap={8} style={{ marginBottom: 12 }}>
              <SathiBadge size={18} />
              <T size={12.5} color={colors.ink2}>{PERIODS.find((p) => p.id === period)!.label} সারসংক্ষেপ · সাথী গণনা করেছে</T>
            </Row>
            <Row gap={10}>
              <SummaryCell label="আয়" value={money(inc)} color={colors.green} />
              <SummaryCell label="খরচ" value={money(exp)} color={colors.coral} />
              <SummaryCell label="মুনাফা" value={money(net)} color={colors.ink} />
            </Row>
          </Card>

          {/* Best / worst */}
          <Card style={{ padding: 16, marginBottom: 14 }}>
            <T weight="b" size={15} style={{ marginBottom: 4 }}>সেরা বিক্রিত পণ্য</T>
            {best.map((p, i) => (
              <RankRow key={p.n} rank={i + 1} emoji={p.e} name={p.n} units={p.units} rev={p.rev} good />
            ))}
            <View style={{ height: 1, backgroundColor: colors.border2, marginVertical: 12 }} />
            <T weight="b" size={15} style={{ marginBottom: 4 }}>দুর্বল পণ্য · মনোযোগ দিন</T>
            {worst.map((p) => (
              <RankRow key={p.n} emoji={p.e} name={p.n} units={p.units} rev={p.rev} good={false} />
            ))}
          </Card>

          {/* Peak hours */}
          <Card style={{ padding: 16, marginBottom: 14 }}>
            <T weight="b" size={15}>পিক-আওয়ার বিশ্লেষণ</T>
            <T size={12.5} color={colors.ink2} style={{ marginTop: 2, marginBottom: 12 }}>
              সবচেয়ে ব্যস্ত: <T weight="b" size={12.5} color={colors.saffron}>{BN(parseInt(peak.h))}:০০</T> — এই সময়ে পোস্ট/অফার দিন
            </T>
            <Row gap={6} style={{ height: 110, alignItems: 'flex-end' }}>
              {PEAK_HOURS.map((p) => (
                <View key={p.h} style={{ flex: 1, alignItems: 'center', gap: 5 }}>
                  <T size={9.5} color={colors.ink2}>{BN(p.o)}</T>
                  <View style={{ width: '78%', height: (`${(p.o / peakMax) * 80}%`) as `${number}%`, minHeight: 6, backgroundColor: p.o === peakMax ? colors.saffron : colors.tealSoft, borderRadius: 4 }} />
                  <T size={9.5} color={colors.ink2}>{BN(parseInt(p.h))}</T>
                </View>
              ))}
            </Row>
          </Card>

          {/* Lead closing (live from LeadsStore) */}
          <Card tinted={colors.tealSoft} style={{ padding: 16, marginBottom: 14 }}>
            <Row style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <T weight="b" size={15} color={colors.tealDark}>লিড ক্লোজিং সাপোর্ট</T>
              <T size={12} color={colors.tealDark}>কনভার্সন {BN(conversion)}% · গড় স্কোর {BN(avgScore)}</T>
            </Row>
            {hotLeads.length === 0 ? (
              <T size={13} color={colors.ink2}>এখন ক্লোজ করার মতো হট লিড নেই।</T>
            ) : (
              hotLeads.map((l) => (
                <Row key={l.id} gap={10} style={{ paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' }}>
                  <View style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 2.5, borderColor: colors.green, alignItems: 'center', justifyContent: 'center' }}>
                    <T weight="b" size={12} color={colors.green}>{BN(l.score)}</T>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <T weight="b" size={13.5} numberOfLines={1}>{l.name}</T>
                    <T size={11.5} color={colors.ink2} numberOfLines={1}>{l.interest} · ৳{BN(l.budget)}</T>
                  </View>
                  <Btn
                    kind="primary"
                    size="sm"
                    label="ক্লোজ →"
                    style={{ backgroundColor: colors.green }}
                    onPress={() => {
                      advanceStage(l.id);
                      toast.show(`${l.name} — ডিল ক্লোজড! 🎉`, 'success');
                    }}
                  />
                </Row>
              ))
            )}
          </Card>

          {/* Complaints summary → opens complaints overlay */}
          <Pressable onPress={() => actions.openOverlay('complaints')}>
            <Card leftBar={openCount > 0 ? colors.coral : colors.green} style={{ padding: 16 }}>
              <Row gap={12}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: openCount > 0 ? colors.coralSoft : colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="alert-circle-outline" size={24} color={openCount > 0 ? colors.coral : colors.green} />
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="b" size={15}>অভিযোগ ট্র্যাকিং</T>
                  <T size={12.5} color={colors.ink2}>{BN(openCount)}টি অমীমাংসিত · সমাধান হার {BN(resolutionRate)}%</T>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.ink2} />
              </Row>
            </Card>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ flex: 1 }}>
      <T size={12} color={colors.ink2}>{label}</T>
      <T weight="b" size={20} color={color} style={{ marginTop: 2 }}>{value}</T>
    </View>
  );
}

function RankRow({ rank, emoji, name, units, rev, good }: { rank?: number; emoji: string; name: string; units: number; rev: number; good: boolean }) {
  return (
    <Row gap={10} style={{ paddingVertical: 8 }}>
      <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.border2, alignItems: 'center', justifyContent: 'center' }}>
        <T size={20}>{emoji}</T>
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <T weight="s" size={14} numberOfLines={1}>{rank ? `${BN(rank)}. ` : ''}{name}</T>
        <T size={12} color={colors.ink2}>{BN(units)} টি বিক্রি</T>
      </View>
      <T weight="b" size={14} color={good ? colors.green : colors.ink2}>{money(rev)}</T>
    </Row>
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
