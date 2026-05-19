import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Btn, Card, Chip, Row, SathiBadge, SectionHeader, T } from '../components/atoms';
import { PillTabs } from '../components/PillTabs';
import { ResponsiveGrid, ScreenScroll } from '../components/ScreenContainer';
import { colors } from '../theme';

type Tab = 'opp' | 'src' | 'season' | 'comp';

export function MarketScreen({ onOpenAgent, onOpenApprovals }: { onOpenAgent: () => void; onOpenApprovals: () => void }) {
  const [tab, setTab] = useState<Tab>('opp');
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title={<T weight="b" size={22}>বাজার</T>}
        subtitle="ট্রেন্ড + সোর্সিং সাথী দেখছে"
        showAgentRunning
        onAgentPress={onOpenAgent}
        onNotificationPress={onOpenApprovals}
        notificationBadge
      />
      <PillTabs<Tab>
        tabs={[
          { id: 'opp', label: 'সুযোগ' },
          { id: 'src', label: 'সোর্সিং' },
          { id: 'season', label: 'মৌসুম' },
          { id: 'comp', label: 'প্রতিযোগী' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'opp' && <Opportunity />}
      {tab === 'src' && <Sourcing />}
      {tab === 'season' && <Season />}
      {tab === 'comp' && <Competitors />}
    </View>
  );
}

function ScoreBar({ icon, label, pct, color, value }: { icon: string; label: string; pct: number; color: string; value: string }) {
  return (
    <View style={{ marginTop: 10 }}>
      <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
        <Row gap={6}>
          <T size={13}>{icon}</T>
          <T size={12.5} color={colors.ink2}>{label}</T>
        </Row>
        <T weight="b" size={12.5} color={color}>{value}</T>
      </Row>
      <View style={{ height: 8, backgroundColor: colors.border2, borderRadius: 4, overflow: 'hidden' }}>
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: color }} />
      </View>
    </View>
  );
}

function Opportunity() {
  return (
    <ScreenScroll>
      <Card leftBar={colors.green} style={{ padding: 16, marginBottom: 12 }}>
        <Row gap={8}>
          <T size={22}>🔥</T>
          <Chip kind="green">সবচেয়ে গরম সুযোগ</Chip>
        </Row>
        <T weight="b" size={18} style={{ marginTop: 10 }}>মিনি ইউএসবি ফ্যান</T>
        <T size={13} color={colors.ink2} style={{ marginTop: 2 }}>চাহিদা <T weight="b" color={colors.green}>+৪৭%</T> · প্রতিযোগিতা কম</T>
        <ScoreBar icon="📈" label="চাহিদা" pct={92} color={colors.green} value="৯২" />
        <ScoreBar icon="⚖️" label="প্রতিযোগিতা" pct={28} color={colors.teal} value="২৮" />
        <ScoreBar icon="💰" label="লাভের সম্ভাবনা" pct={78} color={colors.saffron} value="৭৮" />
        <Btn kind="greenOutline" label="বিস্তারিত দেখুন" full style={{ marginTop: 14 }} iconRight={<Ionicons name="arrow-forward" size={16} color={colors.green} />} />
      </Card>

      <SectionHeader title="আরও সুযোগ" />
      {[
        { e: '☂️', n: 'ছাতা · বর্ষাকাল আসছে', d: '+২৮%', kind: 'teal' as const },
        { e: '🧴', n: 'কুলিং বোতল', d: '+১৮%', kind: 'amber' as const },
        { e: '🌿', n: 'হার্বাল চা', d: '+১৪%', kind: 'green' as const },
      ].map((o) => (
        <Card key={o.n} style={{ padding: 14, marginBottom: 10 }}>
          <Row gap={12}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
              <T size={24}>{o.e}</T>
            </View>
            <View style={{ flex: 1 }}>
              <T weight="b" size={14.5}>{o.n}</T>
              <T size={12.5} color={colors.ink2} style={{ marginTop: 2 }}>সাথীর প্রস্তাব · এই সপ্তাহ</T>
            </View>
            <Chip kind={o.kind} size={12}>{o.d}</Chip>
          </Row>
        </Card>
      ))}
    </ScreenScroll>
  );
}

function Sourcing() {
  return (
    <ScreenScroll>
      <Card style={{ padding: 16, marginBottom: 12 }}>
        <Row gap={8}>
          <SathiBadge />
          <Chip kind="teal">সাথী খুঁজেছে</Chip>
        </Row>
        <T weight="b" size={16} style={{ marginTop: 8 }}>৩ জন সরবরাহকারী পাওয়া গেছে</T>
        <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>
          মিনি ইউএসবি ফ্যানের জন্য চট্টগ্রাম · ঢাকা থেকে
        </T>
      </Card>

      {[
        { n: 'রহমান ট্রেডার্স', city: 'ঢাকা', price: '৳৪৮০', rate: 4.6, kind: 'green' as const, badge: 'বিশ্বস্ত' },
        { n: 'চট্টগ্রাম ইলেকট্রনিক্স', city: 'চট্টগ্রাম', price: '৳৪৫০', rate: 4.3, kind: 'teal' as const, badge: 'নতুন' },
        { n: 'নুর সাপ্লাই', city: 'ঢাকা', price: '৳৫১০', rate: 4.8, kind: 'amber' as const, badge: 'প্রিমিয়াম' },
      ].map((s) => (
        <Card key={s.n} style={{ padding: 14, marginBottom: 10 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <T weight="b" size={15}>{s.n}</T>
              <T size={12.5} color={colors.ink2}>📍 {s.city} · ⭐ {s.rate}</T>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <T weight="b" size={16} color={colors.green}>{s.price}</T>
              <Chip kind={s.kind} size={11} style={{ marginTop: 4 }}>{s.badge}</Chip>
            </View>
          </Row>
          <Row gap={8} style={{ marginTop: 12 }}>
            <Btn kind="tealOutline" label="যোগাযোগ" size="sm" full style={{ flex: 1 }} />
            <Btn kind="greyOutline" label="তুলনা" size="sm" />
          </Row>
        </Card>
      ))}
    </ScreenScroll>
  );
}

function Season() {
  return (
    <ScreenScroll>
      <Card style={{ padding: 16, marginBottom: 12 }}>
        <T weight="b" size={16}>মৌসুমী ক্যালেন্ডার</T>
        <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>আগামী ৩ মাসের পূর্বাভাস</T>
      </Card>
      {[
        { m: 'মে', t: 'গ্রীষ্ম শুরু', tags: ['ফ্যান', 'কুলিং', 'বোতল'], kind: 'amber' as const },
        { m: 'জুন', t: 'বর্ষার প্রস্তুতি', tags: ['ছাতা', 'রেইনকোট'], kind: 'teal' as const },
        { m: 'জুলাই', t: 'বর্ষাকাল', tags: ['ছাতা', 'গাম বুট', 'রেইনগিয়ার'], kind: 'coral' as const },
      ].map((s, i) => (
        <Card key={s.m} style={{ padding: 14, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: i === 0 ? colors.amber : i === 1 ? colors.teal : colors.coral }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T weight="b" size={15}>{s.m}</T>
            <Chip kind={s.kind} size={11}>{s.t}</Chip>
          </Row>
          <Row gap={6} style={{ marginTop: 10, flexWrap: 'wrap' }}>
            {s.tags.map((t) => (
              <View key={t} style={{ paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.bg, borderRadius: 999 }}>
                <T size={12} weight="m">{t}</T>
              </View>
            ))}
          </Row>
        </Card>
      ))}
    </ScreenScroll>
  );
}

function Competitors() {
  return (
    <ScreenScroll>
      <Card style={{ padding: 16, marginBottom: 12 }}>
        <Row gap={8}>
          <SathiBadge />
          <T weight="b" size={14}>আপনার এলাকায় ৬ জন প্রতিযোগী</T>
        </Row>
        <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>
          গড় দাম ৳৮৭০ · আপনার ৳৮৫০ (৩% কম)
        </T>
      </Card>
      {[
        { n: 'সাকিব ইলেকট্রনিক্স', dist: '০.৫ কিমি', price: '৳৮৭০', rate: 4.2 },
        { n: 'নাজমা স্টোর', dist: '১.২ কিমি', price: '৳৯০০', rate: 4.5 },
        { n: 'রহিম গ্যালারি', dist: '২.১ কিমি', price: '৳৮২০', rate: 4.0 },
      ].map((c) => (
        <Card key={c.n} style={{ padding: 14, marginBottom: 10 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <T weight="b" size={15}>{c.n}</T>
              <T size={12.5} color={colors.ink2}>📍 {c.dist} · ⭐ {c.rate}</T>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <T weight="b" size={16}>{c.price}</T>
              <T size={11} color={colors.ink2}>মিনি ফ্যান</T>
            </View>
          </Row>
        </Card>
      ))}
    </ScreenScroll>
  );
}
