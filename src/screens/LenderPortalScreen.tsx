import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card, Row, SathiBadge, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { useToast } from '../components/Toast';
import { colors, fonts } from '../theme';

type Kind = 'g' | 'a' | 'r';

type Beneficiary = {
  n: string;
  d: string;
  b: string;
  rev: string;
  g: string;
  s: number;
  kind: Kind;
  loan: string;
  active: string;
  repay: string;
  cycle: number;
};

const BENEFICIARIES: Beneficiary[] = [
  { n: 'রহিমা বেগম', d: 'ঢাকা', b: 'ইলেকট্রনিক্স', rev: '৬৮,৪০০', g: '+২৪%', s: 720, kind: 'g', loan: 'ঋণ-যোগ্য', active: '৬০,০০০', repay: '১০০%', cycle: 2 },
  { n: 'করিম আহমেদ', d: 'চট্টগ্রাম', b: 'কাপড়', rev: '৫২,১০০', g: '+১৮%', s: 685, kind: 'g', loan: 'ঋণ-যোগ্য', active: '৪৫,০০০', repay: '১০০%', cycle: 1 },
  { n: 'সুমাইয়া আক্তার', d: 'সিলেট', b: 'সৌন্দর্য', rev: '৩৪,৮০০', g: '+৯%', s: 580, kind: 'a', loan: 'পর্যবেক্ষণ', active: '২৫,০০০', repay: '৯২%', cycle: 1 },
  { n: 'নাসরিন বেগম', d: 'খুলনা', b: 'খাবার', rev: '৪১,২০০', g: '+১৪%', s: 640, kind: 'g', loan: 'ঋণ-যোগ্য', active: '৩৫,০০০', repay: '১০০%', cycle: 2 },
  { n: 'রফিকুল ইসলাম', d: 'রাজশাহী', b: 'গৃহস্থালি', rev: '১৮,৫০০', g: '−৪%', s: 380, kind: 'r', loan: 'মনোযোগ প্রয়োজন', active: '২০,০০০', repay: '৭৪%', cycle: 1 },
  { n: 'হাসিনা পারভীন', d: 'বরিশাল', b: 'কাপড়', rev: '২৭,৬০০', g: '+৬%', s: 545, kind: 'a', loan: 'পর্যবেক্ষণ', active: '২০,০০০', repay: '৯৬%', cycle: 1 },
  { n: 'মুনির খান', d: 'ঢাকা', b: 'ইলেকট্রনিক্স', rev: '৭৫,৩০০', g: '+৩১%', s: 810, kind: 'g', loan: 'প্রিমিয়াম', active: '১,২০,০০০', repay: '১০০%', cycle: 3 },
  { n: 'রাহেলা খাতুন', d: 'রংপুর', b: 'খাবার', rev: '২২,৪০০', g: '+৩%', s: 495, kind: 'a', loan: 'পর্যবেক্ষণ', active: '১৫,০০০', repay: '৮৮%', cycle: 1 },
];

const HERO_STATS = [
  { l: 'মোট বেনিফিশিয়ারি', v: '১,২৪০', col: '#0f172a' },
  { l: 'সক্রিয় ঋণ', v: '৯৪২', col: '#1d4ed8' },
  { l: 'ঋণ-যোগ্য', v: '৩১২', col: colors.green, delta: '+২৪' },
  { l: 'মোট বিতরণ (চলমান)', v: '৳৪.২ কোটি', col: '#0f172a' },
  { l: 'মনোযোগ প্রয়োজন', v: '৫৩', col: colors.coral },
];

const SCORE_DIST = [
  { l: '৮৫১–১০০০ · প্রিমিয়াম', n: 38, col: colors.saffron },
  { l: '৭০১–৮৫০ · উত্তম', n: 274, col: colors.green },
  { l: '৫০১–৭০০ · ভাল', n: 412, col: '#0EA5E9' },
  { l: '৩০১–৫০০ · গড়', n: 285, col: '#a16207' },
  { l: '০–৩০০ · শুরু', n: 231, col: '#9ca3af' },
];

const BRANCH_PERF = [
  { d: 'ঢাকা', v: 'গড় ৭২০', pct: 82 },
  { d: 'চট্টগ্রাম', v: 'গড় ৬৫৪', pct: 74 },
  { d: 'সিলেট', v: 'গড় ৫৮২', pct: 65 },
  { d: 'খুলনা', v: 'গড় ৬৩৪', pct: 71 },
  { d: 'রাজশাহী', v: 'গড় ৫০৮', pct: 58 },
];

const FILTERS = [
  { id: 'all' as const, l: 'সব · ১,২৪০' },
  { id: 'eligible' as const, l: '✅ ঋণ-যোগ্য · ৩১২' },
  { id: 'watch' as const, l: '🟡 পর্যবেক্ষণ · ২৮৫' },
  { id: 'risk' as const, l: '🔴 ঝুঁকি · ৫৩' },
];

const SIDEBAR_PRIMARY = [
  { e: '📊', l: 'ড্যাশবোর্ড', active: true },
  { e: '👥', l: 'বেনিফিশিয়ারি' },
  { e: '💰', l: 'ঋণ পোর্টফোলিও' },
  { e: '📈', l: 'রিপোর্ট' },
  { e: '⚠️', l: 'ঝুঁকি বিশ্লেষণ' },
];

const SIDEBAR_SECONDARY = [
  { e: '🏦', l: 'শাখা ও PO' },
  { e: '📋', l: 'ঋণ পণ্য' },
  { e: '⚙️', l: 'সেটিংস' },
];

export function LenderPortalScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const [filter, setFilter] = useState<'all' | 'eligible' | 'watch' | 'risk'>('all');
  const [openId, setOpenId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const byFilter = BENEFICIARIES.filter((r) => {
      if (filter === 'eligible') return r.kind === 'g';
      if (filter === 'watch') return r.kind === 'a';
      if (filter === 'risk') return r.kind === 'r';
      return true;
    });
    if (!query.trim()) return byFilter;
    const q = query.trim().toLowerCase();
    return byFilter.filter((r) => `${r.n} ${r.d} ${r.b}`.toLowerCase().includes(q));
  }, [filter, query]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f6f8' }}>
      {/* Topbar */}
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: 16,
          paddingTop: 6,
          paddingBottom: 12,
          borderBottomColor: '#e6e8ec',
          borderBottomWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </Pressable>
        <Row gap={10}>
          <View style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: colors.saffron, alignItems: 'center', justifyContent: 'center' }}>
            <T weight="b" size={18} color="#fff">আ</T>
          </View>
          <View>
            <T weight="b" size={15}>আরোপণ · ঋণদাতা পোর্টাল</T>
            <T size={11.5} color="#64748b" weight="s">NGO · ব্যাংক · MFI · সব ধরনের প্রতিষ্ঠানের জন্য</T>
          </View>
        </Row>
        <View style={{ flex: 1, minWidth: 8 }} />
        {isDesktop && (
          <>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="বেনিফিশিয়ারি খুঁজুন…"
              placeholderTextColor="#94a3b8"
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 8,
                borderColor: '#e6e8ec',
                borderWidth: 1,
                width: 220,
                fontFamily: fonts.regular,
                fontSize: 13,
                color: colors.ink,
              }}
            />
            <Row gap={10}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#dc2626', alignItems: 'center', justifyContent: 'center' }}>
                <T weight="b" size={13} color="#fff">BR</T>
              </View>
              <View>
                <T weight="s" size={13}>BRAC মাইক্রোফিন্যান্স</T>
                <T size={11} color="#64748b">মাসুদ রানা · PO · ঢাকা শাখা</T>
              </View>
            </Row>
          </>
        )}
      </View>

      <View style={{ flex: 1, flexDirection: isDesktop ? 'row' : 'column' }}>
        {/* Sidebar */}
        {isDesktop && (
          <View style={{ width: 220, backgroundColor: '#fff', borderRightColor: '#e6e8ec', borderRightWidth: 1, paddingVertical: 14 }}>
            <T size={10} weight="b" color="#94a3b8" style={{ paddingHorizontal: 16, marginBottom: 8, letterSpacing: 1.5 }}>ওভারভিউ</T>
            {SIDEBAR_PRIMARY.map((it) => (
              <View
                key={it.l}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  backgroundColor: it.active ? '#f0f9ff' : 'transparent',
                  borderLeftWidth: 3,
                  borderLeftColor: it.active ? '#1d4ed8' : 'transparent',
                }}
              >
                <T size={16}>{it.e}</T>
                <T weight={it.active ? 'b' : 's'} size={13} color={it.active ? '#1d4ed8' : colors.ink}>{it.l}</T>
              </View>
            ))}
            <T size={10} weight="b" color="#94a3b8" style={{ paddingHorizontal: 16, marginTop: 14, marginBottom: 8, letterSpacing: 1.5 }}>প্রতিষ্ঠান</T>
            {SIDEBAR_SECONDARY.map((it) => (
              <View
                key={it.l}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                }}
              >
                <T size={16}>{it.e}</T>
                <T weight="s" size={13} color={colors.ink}>{it.l}</T>
              </View>
            ))}
          </View>
        )}

        {/* Main */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {!isDesktop && (
            <Card style={{ padding: 12, marginBottom: 14 }}>
              <Row gap={8}>
                <Ionicons name="information-circle" size={18} color={colors.tealDark} />
                <T size={12.5} color={colors.ink2} style={{ flex: 1 }}>
                  ডেস্কটপ-প্রিভিউ মোড — সম্পূর্ণ ড্যাশবোর্ডে কম্পিউটার থেকে অ্যাকসেস করুন
                </T>
              </Row>
            </Card>
          )}

          {/* Hero stats */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -7, marginBottom: 14 }}>
            {HERO_STATS.map((s) => (
              <View key={s.l} style={{ width: isDesktop ? '20%' : '50%', padding: 7 }}>
                <Card style={{ padding: 14 }}>
                  <T size={12} color="#64748b">{s.l}</T>
                  <T weight="b" size={24} color={s.col} style={{ marginTop: 4 }}>{s.v}</T>
                  {s.delta && <T size={11.5} weight="s" color={colors.green} style={{ marginTop: 2 }}>▲ {s.delta} এই মাসে</T>}
                </Card>
              </View>
            ))}
          </View>

          {/* Filter pills + export */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            {FILTERS.map((p) => {
              const active = filter === p.id;
              return (
                <Pressable
                  key={p.id}
                  onPress={() => setFilter(p.id)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 999,
                    backgroundColor: active ? '#0f172a' : '#fff',
                    borderColor: active ? '#0f172a' : '#e6e8ec',
                    borderWidth: 1,
                  }}
                >
                  <T weight="s" size={13} color={active ? '#fff' : '#475569'}>{p.l}</T>
                </Pressable>
              );
            })}
            <View style={{ flex: 1, minWidth: 8 }} />
            <Pressable
              onPress={() => toast.show('Excel এক্সপোর্ট প্রস্তুত হচ্ছে…', 'info')}
              style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, backgroundColor: '#1d4ed8' }}
            >
              <T weight="s" size={13} color="#fff">📤 Excel এক্সপোর্ট</T>
            </Pressable>
          </View>

          {/* Two-col body */}
          <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 16 }}>
            {/* Left column: table */}
            <Card style={{ flex: isDesktop ? 1.7 : undefined, padding: 0, overflow: 'hidden' }}>
              <View style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#f8fafc', flexDirection: 'row' }}>
                <T weight="b" size={12} color="#475569" style={{ flex: 2 }}>নাম · জেলা</T>
                <T weight="b" size={12} color="#475569" style={{ width: 80, textAlign: 'right' }}>আয়</T>
                <T weight="b" size={12} color="#475569" style={{ width: 60, textAlign: 'right' }}>স্কোর</T>
                <T weight="b" size={12} color="#475569" style={{ width: 90, textAlign: 'right' }}>ঋণ-যোগ্যতা</T>
              </View>
              {filtered.map((r, i) => (
                <Pressable
                  key={i}
                  onPress={() => setOpenId(openId === i ? null : i)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderTopColor: '#e6e8ec',
                    borderTopWidth: 1,
                    backgroundColor: openId === i ? '#f8fafc' : '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 2 }}>
                    <T weight="s" size={13.5}>{r.n}</T>
                    <T size={11.5} color="#475569">{r.d} · {r.b}</T>
                  </View>
                  <T weight="b" size={13} style={{ width: 80, textAlign: 'right' }}>৳{r.rev}</T>
                  <View style={{ width: 60, alignItems: 'flex-end' }}>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                        backgroundColor:
                          r.s >= 700 ? '#dcfce7' : r.s >= 500 ? '#fef3c7' : '#fee2e2',
                      }}
                    >
                      <T
                        weight="b"
                        size={12.5}
                        color={r.s >= 700 ? '#15803d' : r.s >= 500 ? '#a16207' : '#b91c1c'}
                      >
                        {r.s}
                      </T>
                    </View>
                  </View>
                  <View style={{ width: 90, alignItems: 'flex-end' }}>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 6,
                        backgroundColor:
                          r.kind === 'g' ? '#dcfce7' : r.kind === 'a' ? '#fef3c7' : '#fee2e2',
                      }}
                    >
                      <T
                        weight="s"
                        size={11}
                        color={r.kind === 'g' ? '#15803d' : r.kind === 'a' ? '#a16207' : '#b91c1c'}
                      >
                        {r.loan}
                      </T>
                    </View>
                  </View>
                </Pressable>
              ))}
            </Card>

            {/* Right column: charts */}
            <View style={{ flex: 1, gap: 16 }}>
              <Card style={{ padding: 16 }}>
                <T weight="b" size={14} style={{ marginBottom: 12 }}>স্কোর বণ্টন</T>
                {SCORE_DIST.map((d, i) => {
                  const p = (d.n / 1240) * 100;
                  return (
                    <View key={i} style={{ marginBottom: 9 }}>
                      <Row style={{ justifyContent: 'space-between', marginBottom: 3 }}>
                        <T size={12}>{d.l}</T>
                        <T weight="b" size={12}>{d.n}</T>
                      </Row>
                      <View style={{ height: 6, backgroundColor: '#f1f5f9', borderRadius: 3 }}>
                        <View style={{ width: (`${p}%`) as `${number}%`, height: '100%', backgroundColor: d.col, borderRadius: 3 }} />
                      </View>
                    </View>
                  );
                })}
              </Card>

              <Card tinted={colors.tealSoft} style={{ padding: 16 }}>
                <Row gap={8}>
                  <SathiBadge />
                  <T weight="b" size={13} color={colors.tealDark}>সাথীর সাপ্তাহিক ব্রিফ</T>
                </Row>
                <T size={13} color={colors.ink} style={{ marginTop: 8, lineHeight: 20 }}>
                  এই সপ্তাহে <T weight="b" size={13}>৩১২ জন</T> ঋণ-যোগ্য — গড়ে <T weight="b" size={13}>৳৪৫,০০০</T> পর্যন্ত। মুনির খান (স্কোর ৮১০) তৃতীয় চক্রে — <T weight="b" size={13}>প্রিমিয়াম ঋণ পণ্য</T> অফার করতে পারেন। রফিকুল ইসলামের রাজস্ব ৪% কমেছে · ফলো-আপ দরকার।
                </T>
                <Btn
                  kind="primary"
                  size="sm"
                  label="সম্পূর্ণ ব্রিফ পড়ুন →"
                  style={{ marginTop: 12, backgroundColor: '#1d4ed8' }}
                  onPress={() => toast.show('ব্রিফ ওপেন হচ্ছে…', 'info')}
                />
              </Card>

              <Card style={{ padding: 16 }}>
                <T weight="b" size={14} style={{ marginBottom: 12 }}>শাখা পারফরম্যান্স</T>
                {BRANCH_PERF.map((d, i) => (
                  <View key={i} style={{ marginBottom: 10 }}>
                    <Row style={{ justifyContent: 'space-between', marginBottom: 3 }}>
                      <T size={12.5}>{d.d}</T>
                      <T weight="b" size={12.5}>{d.v}</T>
                    </Row>
                    <View style={{ height: 6, backgroundColor: '#f1f5f9', borderRadius: 3 }}>
                      <View
                        style={{
                          width: (`${d.pct}%`) as `${number}%`,
                          height: '100%',
                          backgroundColor: d.pct >= 70 ? '#15803d' : d.pct >= 60 ? '#a16207' : '#b91c1c',
                          borderRadius: 3,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </Card>
            </View>
          </View>

          {/* Expanded profile */}
          {openId !== null && filtered[openId] && (
            <ExpandedProfile beneficiary={filtered[openId]} onPdf={() => toast.show('PDF প্রস্তুত হচ্ছে…', 'success')} onContact={() => toast.show('যোগাযোগ ফর্ম খোলা হচ্ছে…', 'info')} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function ExpandedProfile({
  beneficiary,
  onPdf,
  onContact,
}: {
  beneficiary: Beneficiary;
  onPdf: () => void;
  onContact: () => void;
}) {
  const stats = [
    { l: 'মাসিক আয়', v: '৳' + beneficiary.rev },
    {
      l: '৩-মাসের প্রবৃদ্ধি',
      v: beneficiary.g,
      col: beneficiary.g.startsWith('−') ? '#b91c1c' : '#15803d',
    },
    {
      l: 'আরোপণ স্কোর',
      v: beneficiary.s + '/১০০০',
      col: beneficiary.kind === 'g' ? '#15803d' : beneficiary.kind === 'a' ? '#a16207' : '#b91c1c',
    },
    { l: 'চলমান ঋণ', v: '৳' + beneficiary.active },
    { l: 'পরিশোধ', v: beneficiary.repay, col: beneficiary.repay === '১০০%' ? '#15803d' : '#a16207' },
  ];
  return (
    <Card style={{ padding: 18, marginTop: 16 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1, minWidth: 200 }}>
          <T size={11.5} color="#64748b" weight="b" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>বেনিফিশিয়ারি প্রোফাইল</T>
          <T weight="b" size={22} style={{ marginTop: 4 }}>{beneficiary.n}</T>
          <T size={13} color="#64748b">
            {beneficiary.b} · {beneficiary.d} · যোগদান: জানুয়ারি ২০২৪ · {beneficiary.cycle}য় ঋণ চক্র
          </T>
        </View>
        <Row gap={8} style={{ flexWrap: 'wrap' }}>
          <Btn kind="tealOutline" label="📞 যোগাযোগ" onPress={onContact} size="sm" />
          <Btn kind="primary" label="📄 PDF (ক্রেডিট কমিটি)" onPress={onPdf} size="sm" style={{ backgroundColor: '#1d4ed8' }} />
        </Row>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginTop: 14 }}>
        {stats.map((m, i) => (
          <View key={i} style={{ width: '20%', minWidth: 110, padding: 6 }}>
            <View style={{ padding: 14, backgroundColor: '#f8fafc', borderRadius: 10 }}>
              <T size={11.5} color="#64748b">{m.l}</T>
              <T weight="b" size={18} color={m.col || '#0f172a'} style={{ marginTop: 4 }}>{m.v}</T>
            </View>
          </View>
        ))}
      </View>

      <View style={{ marginTop: 14, padding: 16, backgroundColor: '#fff', borderColor: '#e6e8ec', borderWidth: 1, borderRadius: 10 }}>
        <T size={12.5} weight="b" color="#475569" style={{ marginBottom: 10 }}>ঋণের ইতিহাস</T>
        <HistoryRow cycle="১য় (জানু-জুন ২০২৪)" amount="৳২৫,০০০" period="৬ মাস" repay="১০০% সময়মত" status="সম্পন্ন" kind="g" />
        {beneficiary.cycle >= 2 && (
          <HistoryRow cycle="২য় (জুলাই ২০২৪–জানু ২০২৫)" amount="৳৪০,০০০" period="৬ মাস" repay="১০০% সময়মত" status="সম্পন্ন" kind="g" />
        )}
        <HistoryRow
          cycle={`${beneficiary.cycle}য় (চলমান)`}
          amount={`৳${beneficiary.active}`}
          period="৬ মাস"
          repay={beneficiary.repay}
          status={beneficiary.repay === '১০০%' ? 'সময়মত' : beneficiary.kind === 'a' ? 'পর্যবেক্ষণ' : 'মনোযোগ'}
          kind={beneficiary.kind}
        />
      </View>

      <Card tinted="#f0fdfa" leftBar={colors.teal} style={{ marginTop: 14, padding: 14 }}>
        <Row gap={8}>
          <SathiBadge />
          <T weight="b" size={13} color="#0d6e62">সাথী সারসংক্ষেপ</T>
        </Row>
        <T size={14} style={{ marginTop: 8, lineHeight: 22 }}>
          {beneficiary.n} গত {beneficiary.cycle * 6} মাস আরোপণে। গত ৩ মাসে আয় বৃদ্ধি <T weight="b" size={14}>{beneficiary.g}</T>। ৩২টি লেনদেন/মাস, ৪৭ জন সক্রিয় কাস্টমার, ডিজিটাল কার্যকলাপ উচ্চ।{' '}
          {beneficiary.kind === 'g'
            ? `কোনো ডিফল্ট ঝুঁকি নেই — পরবর্তী চক্রে বড় বরাদ্দ সুপারিশ।`
            : beneficiary.kind === 'a'
            ? 'পরিশোধে কিছু দেরি — সরাসরি ফলো-আপ সুপারিশ।'
            : 'রাজস্ব কমছে — অবিলম্বে যোগাযোগ ও সাপোর্ট দরকার।'}
        </T>
      </Card>
    </Card>
  );
}

function HistoryRow({
  cycle,
  amount,
  period,
  repay,
  status,
  kind,
}: {
  cycle: string;
  amount: string;
  period: string;
  repay: string;
  status: string;
  kind: Kind;
}) {
  const bg = kind === 'g' ? '#dcfce7' : kind === 'a' ? '#fef3c7' : '#fee2e2';
  const fg = kind === 'g' ? '#15803d' : kind === 'a' ? '#a16207' : '#b91c1c';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopColor: '#f1f5f9', borderTopWidth: 1 }}>
      <T size={12.5} style={{ flex: 2 }}>{cycle}</T>
      <T size={12.5} weight="s" style={{ width: 80, textAlign: 'right' }}>{amount}</T>
      <T size={12.5} color="#64748b" style={{ width: 70, textAlign: 'right' }}>{period}</T>
      <T size={12.5} style={{ width: 110, textAlign: 'right' }}>{repay}</T>
      <View style={{ width: 90, alignItems: 'flex-end' }}>
        <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: bg }}>
          <T weight="s" size={11} color={fg}>{status}</T>
        </View>
      </View>
    </View>
  );
}

const iconBtn = {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#f1f5f9',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};
