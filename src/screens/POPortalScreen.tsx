import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthContext';
import { useResponsive } from '../components/AppFrame';
import { Avatar, Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { toBn } from '../data/strings';
import { useActions } from '../state/AppActions';
import { colors, fonts } from '../theme';

type Row = {
  n: string;
  d: string;
  b: string;
  rev: string;
  g: string;
  s: number;
  kind: 'g' | 'a' | 'r';
  loan: string;
};

const rows: Row[] = [
  { n: 'রহিমা বেগম', d: 'ঢাকা', b: 'ইলেকট্রনিক্স', rev: '৬৮,৪০০', g: '+২৪%', s: 72, kind: 'g', loan: 'ঋণ-যোগ্য' },
  { n: 'করিম আহমেদ', d: 'চট্টগ্রাম', b: 'কাপড়', rev: '৫২,১০০', g: '+১৮%', s: 68, kind: 'g', loan: 'ঋণ-যোগ্য' },
  { n: 'সুমাইয়া আক্তার', d: 'সিলেট', b: 'সৌন্দর্য', rev: '৩৪,৮০০', g: '+৯%', s: 58, kind: 'a', loan: 'পর্যবেক্ষণ' },
  { n: 'নাসরিন বেগম', d: 'খুলনা', b: 'খাবার', rev: '৪১,২০০', g: '+১৪%', s: 64, kind: 'g', loan: 'ঋণ-যোগ্য' },
  { n: 'রফিকুল ইসলাম', d: 'রাজশাহী', b: 'গৃহস্থালি', rev: '১৮,৫০০', g: '-৪%', s: 38, kind: 'r', loan: 'মনোযোগ প্রয়োজন' },
  { n: 'হাসিনা পারভীন', d: 'বরিশাল', b: 'কাপড়', rev: '২৭,৬০০', g: '+৬%', s: 55, kind: 'a', loan: 'পর্যবেক্ষণ' },
  { n: 'মুনির খান', d: 'ঢাকা', b: 'ইলেকট্রনিক্স', rev: '৭৫,৩০০', g: '+৩১%', s: 81, kind: 'g', loan: 'ঋণ-যোগ্য' },
  { n: 'রাহেলা খাতুন', d: 'রংপুর', b: 'খাবার', rev: '২২,৪০০', g: '+৩%', s: 49, kind: 'a', loan: 'পর্যবেক্ষণ' },
];

const dotColor = (k: 'g' | 'a' | 'r') => (k === 'g' ? colors.green : k === 'a' ? colors.amber : colors.coral);

export function POPortalScreen({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const [openId, setOpenId] = useState<number | null>(null);
  const [tab, setTab] = useState<'overview' | 'list' | 'alerts'>('overview');
  const [query, setQuery] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <View style={styles.topbar}>
        {!isDesktop ? (
          <Pressable onPress={onClose} hitSlop={6} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
        ) : null}
        <View style={styles.logoDot}>
          <T weight="b" color="#fff" size={14}>P</T>
        </View>
        <View style={{ flex: 1 }}>
          <T weight="b" size={isDesktop ? 16 : 14}>PKSF · আরোপণ PO ড্যাশবোর্ড</T>
          <T size={11.5} color={colors.ink2}>Palli Karma-Sahayak Foundation</T>
        </View>
        {isDesktop ? (
          <Row gap={14}>
            <View style={styles.searchInput}>
              <Ionicons name="search" size={14} color={colors.ink2} />
              <TextInput
                placeholder="খুঁজুন…"
                placeholderTextColor={colors.ink2}
                value={query}
                onChangeText={setQuery}
                style={{ flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.ink, padding: 0 }}
              />
            </View>
            <Row gap={10}>
              <Avatar text={user?.avatarInitial ?? 'মা'} bg="#1d4ed8" />
              <View>
                <T weight="b" size={13}>{user?.bengaliName ?? 'মাসুদ রানা'}</T>
                <T size={11} color={colors.ink2}>PO: BRAC PO-12 · ঢাকা</T>
              </View>
            </Row>
            <Pressable onPress={onClose} style={styles.iconBtn} hitSlop={6}>
              <Ionicons name="close" size={20} color={colors.ink} />
            </Pressable>
          </Row>
        ) : (
          <Avatar text={user?.avatarInitial ?? 'মা'} bg="#1d4ed8" />
        )}
      </View>

      {!isDesktop ? (
        <View style={styles.mobileTabs}>
          {[
            { id: 'overview' as const, l: 'ওভারভিউ' },
            { id: 'list' as const, l: 'বেনিফিশিয়ারি' },
            { id: 'alerts' as const, l: 'মনোযোগ' },
          ].map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[styles.tab, tab === t.id ? { backgroundColor: '#1d4ed8' } : null]}
            >
              <T weight={tab === t.id ? 'b' : 'm'} size={13} color={tab === t.id ? '#fff' : '#475569'}>
                {t.l}
              </T>
            </Pressable>
          ))}
        </View>
      ) : null}

      {isDesktop ? (
        <Row style={{ flex: 1, alignItems: 'stretch' }}>
          <View style={styles.poSidebar}>
            {[
              { id: 'overview', icon: '📊', label: 'ওভারভিউ' },
              { id: 'list', icon: '👥', label: 'বেনিফিশিয়ারি' },
              { id: 'alerts', icon: '⚠️', label: 'মনোযোগ' },
            ].map((it) => (
              <Pressable
                key={it.id}
                onPress={() => setTab(it.id as any)}
                style={[styles.poSideItem, tab === (it.id as any) ? styles.poSideItemActive : null]}
              >
                <T size={14}>{it.icon}</T>
                <T weight={tab === (it.id as any) ? 'b' : 'm'} size={13} color={tab === (it.id as any) ? '#1d4ed8' : '#0f172a'}>
                  {it.label}
                </T>
              </Pressable>
            ))}
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 28, paddingBottom: 60 }}>
            {tab === 'overview' && <OverviewDesktop query={query} />}
            {tab === 'list' && <BeneficiariesDesktop openId={openId} setOpenId={setOpenId} query={query} />}
            {tab === 'alerts' && <AlertsDesktop />}
          </ScrollView>
        </Row>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 60 }}>
          {tab === 'overview' && <OverviewMobile />}
          {tab === 'list' && <BeneficiariesMobile openId={openId} setOpenId={setOpenId} />}
          {tab === 'alerts' && <AlertsMobile />}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* ────────────── Desktop layouts ────────────── */

function filterRows(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((r) => r.n.toLowerCase().includes(q) || r.d.toLowerCase().includes(q) || r.b.toLowerCase().includes(q));
}

function OverviewDesktop({ query }: { query: string }) {
  const filtered = filterRows(query);
  const toast = useToast();
  const actions = useActions();
  return (
    <View style={{ gap: 22 }}>
      <Row gap={16}>
        {[
          { l: 'মোট বেনিফিশিয়ারি', v: '৪৮', col: '#0f172a' },
          { l: 'এই সপ্তাহে সক্রিয়', v: '৪৩', col: '#15803d', delta: '+৫' },
          { l: 'ঋণ-যোগ্য', v: '৩১', col: '#1d4ed8' },
          { l: 'মনোযোগ প্রয়োজন', v: '৫', col: '#b91c1c' },
        ].map((s) => (
          <View key={s.l} style={[poCard, { flex: 1 }]}>
            <T size={12.5} color="#64748b">{s.l}</T>
            <T weight="b" size={30} style={{ color: s.col, marginTop: 4 }}>{s.v}</T>
            {s.delta ? <T size={12} weight="b" color="#15803d" style={{ marginTop: 2 }}>▲ {s.delta} এই সপ্তাহে</T> : null}
          </View>
        ))}
      </Row>

      <Row gap={20} style={{ alignItems: 'stretch' }}>
        <View style={[poCard, { flex: 1.7, padding: 0 }]}>
          <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#e6e8ec', flexDirection: 'row', justifyContent: 'space-between' }}>
            <T weight="b" size={15}>বেনিফিশিয়ারি ({filtered.length} এর মধ্যে)</T>
            <Row gap={8}>
              <Pressable style={chipBtn} onPress={() => toast.show('জেলা ফিল্টার শীঘ্রই আসছে', 'info')}>
                <T size={12} color="#475569">সব জেলা</T>
              </Pressable>
              <Pressable style={chipBtn} onPress={() => toast.show('CSV রপ্তানি শুরু হয়েছে', 'success')}>
                <T size={12} color="#475569">রপ্তানি</T>
              </Pressable>
            </Row>
          </View>
          <View style={{ flexDirection: 'row', padding: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e6e8ec' }}>
            {['নাম', 'জেলা', 'ব্যবসা', 'মাসিক আয়', 'প্রবৃদ্ধি', 'স্বাস্থ্য', 'ঋণ-যোগ্যতা'].map((h, i) => (
              <T key={h} size={11.5} weight="b" color="#64748b" style={{ flex: i === 6 ? 1.4 : 1, textAlign: i === 3 ? 'right' : 'left' }}>{h}</T>
            ))}
          </View>
          {filtered.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <T size={26}>🔍</T>
              <T size={13} color={colors.ink2} style={{ marginTop: 8 }}>"{query}" এর জন্য কিছু খুঁজে পাওয়া যায়নি</T>
            </View>
          ) : null}
          {filtered.slice(0, 8).map((r, i) => (
            <View key={i} style={{ flexDirection: 'row', padding: 14, paddingVertical: 12, borderBottomWidth: i < filtered.slice(0, 8).length - 1 ? 1 : 0, borderBottomColor: '#f1f5f9' }}>
              <T weight="s" size={13.5} style={{ flex: 1 }}>{r.n}</T>
              <T size={13} color="#475569" style={{ flex: 1 }}>{r.d}</T>
              <T size={13} color="#475569" style={{ flex: 1 }}>{r.b}</T>
              <T weight="b" size={13} style={{ flex: 1, textAlign: 'right' }}>৳{r.rev}</T>
              <T size={13} weight="s" style={{ flex: 1, marginLeft: 12 }} color={r.g.startsWith('-') ? '#b91c1c' : '#15803d'}>{r.g}</T>
              <Row gap={6} style={{ flex: 1 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor(r.kind) }} />
                <T size={13}>{toBn(r.s * 10)}</T>
              </Row>
              <View style={{ flex: 1.4 }}>
                <Chip kind={r.kind === 'g' ? 'green' : r.kind === 'a' ? 'amber' : 'coral'} size={10}>{r.loan}</Chip>
              </View>
            </View>
          ))}
        </View>

        <View style={{ flex: 1, gap: 16 }}>
          <View style={poCard}>
            <T weight="b" size={14}>জেলা ভিত্তিক স্বাস্থ্য</T>
            {[
              { d: 'ঢাকা', pct: 82 },
              { d: 'চট্টগ্রাম', pct: 74 },
              { d: 'সিলেট', pct: 65 },
              { d: 'খুলনা', pct: 71 },
              { d: 'রাজশাহী', pct: 58 },
            ].map((d) => (
              <View key={d.d} style={{ marginTop: 12 }}>
                <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                  <T size={12.5}>{d.d}</T>
                  <T weight="b" size={12.5}>{d.pct}</T>
                </Row>
                <View style={{ height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
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
          </View>
          <View style={[poCard, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <Row gap={8}>
              <SathiBadge />
              <T weight="b" size={13} color="#1e3a8a">সাথীর সাপ্তাহিক ব্রিফ</T>
            </Row>
            <T size={13.5} style={{ marginTop: 8, lineHeight: 21, color: '#1e293b' }}>
              এই সপ্তাহে <T weight="b">৩১ জন বেনিফিশিয়ারি</T> ঋণ-যোগ্য — পরবর্তী চক্রে গড়ে ৳৪৫,০০০ ঋণ দেওয়া যেতে পারে। <T weight="b">৫ জন</T> মনোযোগ প্রয়োজন।
            </T>
            <Pressable
              style={{ marginTop: 12, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start', backgroundColor: '#1d4ed8', borderRadius: 6 }}
              onPress={() => actions.openOverlay('sathi', 'এই সপ্তাহের সাপ্তাহিক ব্রিফ দেখাও')}
            >
              <T size={12.5} weight="b" color="#fff">সম্পূর্ণ ব্রিফ পড়ুন →</T>
            </Pressable>
          </View>
        </View>
      </Row>
    </View>
  );
}

function BeneficiariesDesktop({ openId, setOpenId, query }: { openId: number | null; setOpenId: (n: number | null) => void; query: string }) {
  const filtered = filterRows(query);
  return (
    <View style={{ gap: 16 }}>
      <View style={[poCard, { padding: 0 }]}>
        <View style={{ flexDirection: 'row', padding: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e6e8ec' }}>
          {['নাম', 'জেলা', 'ব্যবসা', 'মাসিক আয়', 'প্রবৃদ্ধি', 'স্বাস্থ্য', 'ঋণ-যোগ্যতা'].map((h, i) => (
            <T key={h} size={11.5} weight="b" color="#64748b" style={{ flex: i === 6 ? 1.4 : 1, textAlign: i === 3 ? 'right' : 'left' }}>{h}</T>
          ))}
        </View>
        {filtered.length === 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <T size={26}>🔍</T>
            <T size={13} color={colors.ink2} style={{ marginTop: 8 }}>"{query}" এর জন্য কিছু খুঁজে পাওয়া যায়নি</T>
          </View>
        ) : null}
        {filtered.map((r, i) => {
          const open = openId === i;
          return (
            <View key={i}>
              <Pressable
                onPress={() => setOpenId(open ? null : i)}
                style={{
                  flexDirection: 'row',
                  padding: 14,
                  paddingVertical: 12,
                  backgroundColor: open ? '#f8fafc' : '#fff',
                  borderBottomWidth: i < rows.length - 1 ? 1 : 0,
                  borderBottomColor: '#f1f5f9',
                }}
              >
                <T weight="s" size={13.5} style={{ flex: 1 }}>{r.n}</T>
                <T size={13} color="#475569" style={{ flex: 1 }}>{r.d}</T>
                <T size={13} color="#475569" style={{ flex: 1 }}>{r.b}</T>
                <T weight="b" size={13} style={{ flex: 1, textAlign: 'right' }}>৳{r.rev}</T>
                <T size={13} weight="s" style={{ flex: 1, marginLeft: 12 }} color={r.g.startsWith('-') ? '#b91c1c' : '#15803d'}>{r.g}</T>
                <Row gap={6} style={{ flex: 1 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor(r.kind) }} />
                  <T size={13}>{toBn(r.s * 10)}</T>
                </Row>
                <View style={{ flex: 1.4 }}>
                  <Chip kind={r.kind === 'g' ? 'green' : r.kind === 'a' ? 'amber' : 'coral'} size={10}>{r.loan}</Chip>
                </View>
              </Pressable>
              {open ? <DetailPanel r={r} /> : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

function AlertsDesktop() {
  const toast = useToast();
  const items = [
    { n: 'রফিকুল ইসলাম', d: 'রাজস্ব ৪% কমেছে গত ২ মাসে', kind: 'coral' as const, e: '📉' },
    { n: 'হাসিনা পারভীন', d: '১৪ দিন বিক্রি লেখেননি', kind: 'amber' as const, e: '⏰' },
    { n: 'সাকিব ইলেকট্রনিক্স', d: 'প্রথম রিপোর্ট জমা হয়নি', kind: 'amber' as const, e: '📋' },
  ];
  return (
    <View style={{ gap: 16 }}>
      <View style={[poCard, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
        <Row gap={8}>
          <Ionicons name="warning" size={18} color="#b91c1c" />
          <T weight="b" size={14} color="#b91c1c">৩টি বেনিফিশিয়ারি মনোযোগ প্রয়োজন</T>
        </Row>
      </View>
      <Row gap={16} style={{ flexWrap: 'wrap', alignItems: 'stretch' }}>
        {items.map((it) => (
          <Card key={it.n} style={{ flex: 1, minWidth: 280, padding: 16, borderLeftWidth: 4, borderLeftColor: it.kind === 'coral' ? colors.coral : colors.amber }}>
            <Row gap={12}>
              <T size={26}>{it.e}</T>
              <View style={{ flex: 1 }}>
                <T weight="b" size={14}>{it.n}</T>
                <T size={12.5} color={colors.ink2}>{it.d}</T>
              </View>
              <Chip kind={it.kind} size={10}>{it.kind === 'coral' ? 'উচ্চ' : 'মাঝারি'}</Chip>
            </Row>
            <Btn
              kind="tealOutline"
              label="দেখা করার সময় নির্ধারণ"
              full
              size="sm"
              style={{ marginTop: 12 }}
              onPress={() => toast.show(`${it.n}-এর সাথে দেখা করার অনুরোধ পাঠানো হয়েছে`, 'success')}
            />
          </Card>
        ))}
      </Row>
    </View>
  );
}

/* ────────────── Mobile layouts (existing) ────────────── */

function OverviewMobile() {
  return (
    <>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {[
          { l: 'মোট বেনিফিশিয়ারি', v: '৪৮', col: '#0f172a' },
          { l: 'সক্রিয় (সপ্তাহ)', v: '৪৩', col: '#15803d', delta: '+৫' },
          { l: 'ঋণ-যোগ্য', v: '৩১', col: '#1d4ed8' },
          { l: 'মনোযোগ প্রয়োজন', v: '৫', col: '#b91c1c' },
        ].map((s) => (
          <View key={s.l} style={[poCardMobile, { flex: 1, minWidth: ('47%') as `${number}%` }]}>
            <T size={12} color="#64748b">{s.l}</T>
            <T weight="b" size={28} style={{ color: s.col, marginTop: 4 }}>{s.v}</T>
            {s.delta ? <T size={12} weight="b" color="#15803d">▲ {s.delta} এই সপ্তাহ</T> : null}
          </View>
        ))}
      </View>
      <View style={{ marginTop: 16, ...poCardMobile }}>
        <T weight="b" size={14}>জেলা ভিত্তিক স্বাস্থ্য</T>
        {[
          { d: 'ঢাকা', pct: 82 },
          { d: 'চট্টগ্রাম', pct: 74 },
          { d: 'সিলেট', pct: 65 },
          { d: 'খুলনা', pct: 71 },
          { d: 'রাজশাহী', pct: 58 },
        ].map((d) => (
          <View key={d.d} style={{ marginTop: 12 }}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <T size={12.5}>{d.d}</T>
              <T weight="b" size={12.5}>{d.pct}</T>
            </Row>
            <View style={{ height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
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
      </View>
      <View style={{ marginTop: 16, ...poCardMobile, backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }}>
        <Row gap={8}>
          <SathiBadge />
          <T weight="b" size={13} color="#1e3a8a">সাথীর সাপ্তাহিক ব্রিফ</T>
        </Row>
        <T size={13.5} style={{ marginTop: 8, lineHeight: 20, color: '#1e293b' }}>
          এই সপ্তাহে <T weight="b">৩১ জন</T> ঋণ-যোগ্য — গড়ে ৳৪৫,০০০ ঋণ দেওয়া যেতে পারে। <T weight="b">৫ জন</T> মনোযোগ প্রয়োজন।
        </T>
      </View>
    </>
  );
}

function BeneficiariesMobile({ openId, setOpenId }: { openId: number | null; setOpenId: (n: number | null) => void }) {
  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e6e8ec', overflow: 'hidden' }}>
      {rows.map((r, i) => {
        const open = openId === i;
        return (
          <View key={i}>
            <Pressable
              onPress={() => setOpenId(open ? null : i)}
              style={{ padding: 14, borderTopWidth: i ? 1 : 0, borderTopColor: '#f1f5f9', backgroundColor: open ? '#f8fafc' : '#fff' }}
            >
              <Row style={{ justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <T weight="s" size={14}>{r.n}</T>
                  <T size={12} color="#475569">{r.b} · {r.d}</T>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <T weight="b" size={14}>৳{r.rev}</T>
                  <T size={11.5} weight="b" color={r.g.startsWith('-') ? '#b91c1c' : '#15803d'}>{r.g}</T>
                </View>
              </Row>
              <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
                <Row gap={6}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: dotColor(r.kind) }} />
                  <T size={12}>স্কোর {toBn(r.s * 10)}</T>
                </Row>
                <Chip kind={r.kind === 'g' ? 'green' : r.kind === 'a' ? 'amber' : 'coral'} size={10}>{r.loan}</Chip>
              </Row>
            </Pressable>
            {open ? <DetailPanel r={r} /> : null}
          </View>
        );
      })}
    </View>
  );
}

function AlertsMobile() {
  const toast = useToast();
  const items = [
    { n: 'রফিকুল ইসলাম', d: 'রাজস্ব ৪% কমেছে গত ২ মাসে', kind: 'coral' as const, e: '📉' },
    { n: 'হাসিনা পারভীন', d: '১৪ দিন বিক্রি লেখেননি', kind: 'amber' as const, e: '⏰' },
    { n: 'সাকিব ইলেকট্রনিক্স', d: 'প্রথম রিপোর্ট জমা হয়নি', kind: 'amber' as const, e: '📋' },
  ];
  return (
    <View>
      <View style={{ backgroundColor: '#fef2f2', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#fecaca' }}>
        <Row gap={8}>
          <Ionicons name="warning" size={18} color="#b91c1c" />
          <T weight="b" size={14} color="#b91c1c">৩টি বেনিফিশিয়ারি মনোযোগ প্রয়োজন</T>
        </Row>
      </View>
      {items.map((it) => (
        <Card key={it.n} style={{ padding: 14, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: it.kind === 'coral' ? colors.coral : colors.amber }}>
          <Row gap={12}>
            <T size={26}>{it.e}</T>
            <View style={{ flex: 1 }}>
              <T weight="b" size={14}>{it.n}</T>
              <T size={12.5} color={colors.ink2}>{it.d}</T>
            </View>
            <Chip kind={it.kind} size={10}>{it.kind === 'coral' ? 'উচ্চ' : 'মাঝারি'}</Chip>
          </Row>
          <Btn
            kind="tealOutline"
            label="দেখা করার সময় নির্ধারণ"
            full
            size="sm"
            style={{ marginTop: 12 }}
            onPress={() => toast.show(`${it.n}-এর সাথে দেখা করার অনুরোধ পাঠানো হয়েছে`, 'success')}
          />
        </Card>
      ))}
    </View>
  );
}

function DetailPanel({ r }: { r: Row }) {
  const toast = useToast();
  return (
    <View style={{ padding: 18, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: '#e6e8ec' }}>
      <T size={11} color="#64748b" weight="b" style={{ letterSpacing: 0.5 }}>বেনিফিশিয়ারি প্রোফাইল</T>
      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        <View>
          <T weight="b" size={22}>{r.n}</T>
          <T size={12.5} color="#475569">{r.b} · {r.d} · যোগদান: জানুয়ারি ২০২৪</T>
        </View>
        <Btn
          label="PDF ডাউনলোড"
          style={{ backgroundColor: '#1d4ed8' }}
          iconLeft={<Ionicons name="download" size={16} color="#fff" />}
          onPress={() => toast.show(`${r.n}-এর প্রোফাইল PDF তৈরি হচ্ছে…`, 'success')}
        />
      </Row>
      <Row gap={12} style={{ marginTop: 14, flexWrap: 'wrap' }}>
        {[
          { l: 'মাসিক রাজস্ব', v: `৳${r.rev}` },
          { l: '৩-মাস বৃদ্ধি', v: r.g, col: '#15803d' },
          { l: 'স্বাস্থ্য', v: `${toBn(r.s * 10)}/১০০০` },
          { l: 'ঋণ-যোগ্যতা', v: r.loan, col: dotColor(r.kind) },
        ].map((m) => (
          <View key={m.l} style={{ flex: 1, minWidth: 140, padding: 12, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e6e8ec' }}>
            <T size={11} color="#64748b">{m.l}</T>
            <T weight="b" size={16} style={{ color: m.col ?? '#0f172a', marginTop: 4 }}>{m.v}</T>
          </View>
        ))}
      </Row>
      <View style={{ marginTop: 14, padding: 14, backgroundColor: '#f0fdfa', borderRadius: 10, borderLeftWidth: 3, borderLeftColor: colors.teal }}>
        <Row gap={8}>
          <SathiBadge />
          <T weight="b" size={13} color="#0d6e62">সাথী সারসংক্ষেপ</T>
        </Row>
        <T size={13.5} style={{ marginTop: 6, lineHeight: 20 }}>
          {r.n} গত ৩ মাসে স্থির প্রবৃদ্ধি দেখিয়েছেন। ৩২টি অর্ডার, ৪৭ জন সক্রিয় কাস্টমার। কোনো ডিফল্ট ঝুঁকি নেই। পরবর্তী চক্রে ৳৫০,০০০ পর্যন্ত বরাদ্দ সুপারিশ।
        </T>
      </View>
    </View>
  );
}

const poCard = {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 18,
  borderWidth: 1,
  borderColor: '#e6e8ec',
};

const poCardMobile = {
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 14,
  borderWidth: 1,
  borderColor: '#e6e8ec',
};

const chipBtn = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
  borderWidth: 1,
  borderColor: '#e6e8ec',
  backgroundColor: '#fff',
};

const styles = {
  topbar: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e8ec',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  logoDot: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#1d4ed8',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  searchInput: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e6e8ec',
    backgroundColor: '#fff',
    width: 220,
  },
  mobileTabs: {
    flexDirection: 'row' as const,
    gap: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e8ec',
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },
  poSidebar: {
    width: 240,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#e6e8ec',
    padding: 14,
    gap: 4,
  },
  poSideItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  poSideItemActive: {
    backgroundColor: '#eff6ff',
  },
};
