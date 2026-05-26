import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Row, SathiBadge, T } from '../components/atoms';
import { colors } from '../theme';

const BN = (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

type EvtKind = 'order' | 'followup' | 'reorder' | 'payment' | 'post';
const KIND_META: Record<EvtKind, { label: string; color: string; icon: string }> = {
  order: { label: 'অর্ডার', color: colors.green, icon: 'cube-outline' },
  followup: { label: 'ফলো-আপ', color: colors.teal, icon: 'call-outline' },
  reorder: { label: 'রিঅর্ডার', color: colors.amber, icon: 'repeat-outline' },
  payment: { label: 'পেমেন্ট', color: colors.coral, icon: 'cash-outline' },
  post: { label: 'পোস্ট', color: '#8B5CF6', icon: 'megaphone-outline' },
};

type Evt = { time: string; title: string; kind: EvtKind };
const DAYS = ['সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি', 'রবি'];
const DATES = [12, 13, 14, 15, 16, 17, 18];

const WEEK_EVENTS: Evt[][] = [
  [{ time: '১০:০০', title: 'করিম সাহেবের অর্ডার ডেলিভারি', kind: 'order' }, { time: '১৯:০০', title: 'সন্ধ্যার ফেসবুক পোস্ট', kind: 'post' }],
  [{ time: '১১:৩০', title: 'সুমাইয়া আপুকে ফলো-আপ কল', kind: 'followup' }, { time: '১৫:০০', title: 'রহমান ট্রেডার্স পেমেন্ট', kind: 'payment' }],
  [{ time: '০৯:০০', title: 'মিনি ফ্যান রিঅর্ডার', kind: 'reorder' }],
  [{ time: '১৩:০০', title: '২টি অর্ডার প্যাকিং', kind: 'order' }, { time: '১৯:৩০', title: 'ঈদ ক্যাম্পেইন পোস্ট', kind: 'post' }],
  [{ time: '১২:০০', title: 'নতুন কাস্টমার ফলো-আপ', kind: 'followup' }],
  [{ time: '১৪:০০', title: 'সাপ্তাহিক স্টক চেক', kind: 'reorder' }, { time: '১৬:০০', title: 'বকেয়া আদায় — রহিম মিয়া', kind: 'payment' }],
  [],
];

export function CalendarScreen({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [day, setDay] = useState(3); // বৃহঃ

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 14, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>ক্যালেন্ডার</T>
            <T size={12} color={colors.ink2}>দৈনিক ও সাপ্তাহিক সময়সূচি</T>
          </View>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: 640, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
          <Row gap={8} style={{ marginBottom: 14 }}>
            {(['daily', 'weekly'] as const).map((v) => {
              const active = view === v;
              return (
                <Pressable key={v} onPress={() => setView(v)} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: active ? colors.ink : '#fff', borderWidth: 1, borderColor: active ? colors.ink : colors.border2 }}>
                  <T weight="b" size={13} color={active ? '#fff' : colors.ink2}>{v === 'daily' ? 'দৈনিক' : 'সাপ্তাহিক'}</T>
                </Pressable>
              );
            })}
          </Row>

          {/* Week strip */}
          <Row gap={6} style={{ marginBottom: 16 }}>
            {DAYS.map((d, i) => {
              const active = view === 'daily' && day === i;
              const count = WEEK_EVENTS[i].length;
              return (
                <Pressable key={d} onPress={() => { setDay(i); setView('daily'); }} style={{ flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 12, backgroundColor: active ? colors.saffron : '#fff', borderWidth: 1, borderColor: active ? colors.saffron : colors.border2 }}>
                  <T size={10.5} color={active ? '#fff' : colors.ink2}>{d}</T>
                  <T weight="b" size={15} color={active ? '#fff' : colors.ink}>{BN(DATES[i])}</T>
                  {count > 0 ? <View style={{ width: 5, height: 5, borderRadius: 3, marginTop: 3, backgroundColor: active ? '#fff' : colors.saffron }} /> : <View style={{ height: 8 }} />}
                </Pressable>
              );
            })}
          </Row>

          <Card tinted={colors.tealSoft} style={{ padding: 12, marginBottom: 14 }}>
            <Row gap={8}>
              <SathiBadge size={18} />
              <T size={12.5} color={colors.ink} style={{ flex: 1 }}>
                আজ <T weight="b" size={12.5}>{BN(WEEK_EVENTS[day].length)}টি</T> কাজ আছে। সন্ধ্যা ৭টায় পোস্ট দিলে সবচেয়ে বেশি সাড়া পাবেন।
              </T>
            </Row>
          </Card>

          {view === 'daily' ? (
            <DayColumn day={DAYS[day]} date={DATES[day]} events={WEEK_EVENTS[day]} />
          ) : (
            <View style={{ gap: 16 }}>
              {DAYS.map((d, i) => (
                <DayColumn key={d} day={d} date={DATES[i]} events={WEEK_EVENTS[i]} compact />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DayColumn({ day, date, events, compact }: { day: string; date: number; events: Evt[]; compact?: boolean }) {
  return (
    <View>
      {compact ? <T weight="b" size={13} color={colors.ink2} style={{ marginBottom: 6 }}>{day} · {BN(date)}</T> : null}
      {events.length === 0 ? (
        <Card style={{ padding: 14 }}><T size={13} color={colors.ink2}>কোনো কাজ নেই — বিশ্রাম নিন 🌿</T></Card>
      ) : (
        <View style={{ gap: 10 }}>
          {events.map((e, i) => {
            const m = KIND_META[e.kind];
            return (
              <Card key={i} leftBar={m.color} style={{ padding: 14 }}>
                <Row gap={12}>
                  <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: m.color + '22', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={m.icon as any} size={20} color={m.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Row gap={6}>
                      <T weight="b" size={13} color={m.color}>{e.time}</T>
                      <View style={{ paddingHorizontal: 6, paddingVertical: 1, borderRadius: 5, backgroundColor: m.color + '22' }}>
                        <T size={10} weight="b" color={m.color}>{m.label}</T>
                      </View>
                    </Row>
                    <T size={14} color={colors.ink} style={{ marginTop: 2 }}>{e.title}</T>
                  </View>
                </Row>
              </Card>
            );
          })}
        </View>
      )}
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
