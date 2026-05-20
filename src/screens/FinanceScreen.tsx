import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Btn, Card, Chip, Row, SathiBadge, SectionHeader, T } from '../components/atoms';
import { PillTabs } from '../components/PillTabs';
import { ResponsiveGrid, ScreenScroll } from '../components/ScreenContainer';
import { StatPill } from '../components/StatPill';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { colors } from '../theme';

type Tab = 'cash' | 'inv' | 'pksf';

export function FinanceScreen() {
  const actions = useActions();
  const tab = (actions.getSubTab('finance') as Tab) || 'cash';
  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title={<T weight="b" size={22}>হিসাব</T>}
        subtitle="সাথী হিসাব রাখছে"
        showAgentRunning
        onAgentPress={() => actions.openOverlay('agent')}
        onNotificationPress={() => actions.openOverlay('approvals')}
        notificationBadge
      />
      <PillTabs<Tab>
        tabs={[
          { id: 'cash', label: 'আয়-ব্যয়' },
          { id: 'inv', label: 'ইনভেন্টরি' },
          { id: 'pksf', label: 'PKSF রিপোর্ট' },
        ]}
        active={tab}
        onChange={(t) => actions.setSubTab('finance', t)}
      />
      {tab === 'cash' && <Cash />}
      {tab === 'inv' && <Inventory />}
      {tab === 'pksf' && <PKSF />}
    </View>
  );
}

function Cash() {
  const toast = useToast();
  return (
    <ScreenScroll>
      <Row gap={8}>
        <StatPill value="৳১৮,৪০০" label="এই সপ্তাহ আয়" tint={colors.greenSoft} valueColor={colors.green} />
        <StatPill value="৳৫,২০০" label="এই সপ্তাহ ব্যয়" tint={colors.coralSoft} valueColor={colors.coral} />
        <StatPill value="৳১৩,২০০" label="নিট লাভ" tint={colors.saffronSoft} valueColor={colors.saffron} />
      </Row>

      <SectionHeader title="সাপ্তাহিক প্রবাহ" />
      <Card style={{ padding: 16 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <T size={13} color={colors.ink2}>৫ মে – ১১ মে</T>
          <Chip kind="green" size={11}>▲ ১৮%</Chip>
        </Row>
        <Row gap={4} style={{ marginTop: 14, height: 100, alignItems: 'flex-end' }}>
          {[38, 52, 44, 60, 92, 78, 70].map((h, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
              <View style={{ width: 16, height: h, backgroundColor: colors.green, borderRadius: 4 }} />
              <View style={{ width: 16, height: h * 0.3, backgroundColor: colors.coral, borderRadius: 4, opacity: 0.7 }} />
            </View>
          ))}
        </Row>
        <Row gap={12} style={{ marginTop: 12, justifyContent: 'center' }}>
          <Row gap={6}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.green }} />
            <T size={12} color={colors.ink2}>আয়</T>
          </Row>
          <Row gap={6}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.coral }} />
            <T size={12} color={colors.ink2}>ব্যয়</T>
          </Row>
        </Row>
      </Card>

      <SectionHeader
        title="সাম্প্রতিক লেনদেন"
        trailing={
          <Pressable onPress={() => toast.show('লেনদেন ফিল্টার শীঘ্রই আসছে', 'info')} hitSlop={6}>
            <T size={13} color={colors.tealDark} weight="b">সব →</T>
          </Pressable>
        }
      />
      <Card style={{ padding: 4 }}>
        {[
          { n: 'মিনি ফ্যান × ২', d: 'করিম সাহেব', t: 'আজ', v: '+৳১,৭০০', kind: 'green' },
          { n: 'নতুন স্টক কেনা', d: 'রহমান ট্রেডার্স', t: 'গতকাল', v: '-৳৪,৫০০', kind: 'coral' },
          { n: 'কুলিং বোতল × ৩', d: 'সুমাইয়া আপু', t: 'গতকাল', v: '+৳১,০৫০', kind: 'green' },
          { n: 'বিদ্যুৎ বিল', d: 'মাসিক', t: '২ দিন আগে', v: '-৳৭৫০', kind: 'coral' },
        ].map((tx, i, arr) => (
          <Pressable key={i} onPress={() => toast.show(`${tx.n} · ${tx.v}`, 'info')}>
            <Row
              gap={12}
              style={{
                padding: 12,
                borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                borderBottomColor: colors.border2,
              }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: tx.kind === 'green' ? colors.greenSoft : colors.coralSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={tx.kind === 'green' ? 'arrow-down' : 'arrow-up'} size={16} color={tx.kind === 'green' ? colors.green : colors.coral} />
              </View>
              <View style={{ flex: 1 }}>
                <T weight="s" size={14}>{tx.n}</T>
                <T size={12} color={colors.ink2}>{tx.d} · {tx.t}</T>
              </View>
              <T weight="b" size={14} color={tx.kind === 'green' ? colors.green : colors.coral}>{tx.v}</T>
            </Row>
          </Pressable>
        ))}
      </Card>

      <Btn
        kind="greyOutline"
        label="নতুন লেনদেন যোগ করুন"
        full
        style={{ marginTop: 14 }}
        iconLeft={<Ionicons name="add" size={16} color={colors.ink2} />}
        onPress={() => toast.show('নতুন লেনদেন ফর্ম শীঘ্রই আসছে', 'info')}
      />
    </ScreenScroll>
  );
}

function Inventory() {
  const toast = useToast();
  const items = [
    { e: '🌀', n: 'মিনি ইউএসবি ফ্যান', q: 8, low: true },
    { e: '💡', n: 'রিচার্জেবল হ্যান্ড ফ্যান', q: 23 },
    { e: '🧴', n: 'কুলিং বোতল', q: 14 },
    { e: '👜', n: 'কুলিং কুশন', q: 12 },
    { e: '📦', n: 'প্লাস্টিক বক্স', q: 31 },
    { e: '☂️', n: 'ছাতা', q: 6, low: true },
  ];
  return (
    <ScreenScroll>
      <Card tinted={colors.amberSoft} style={{ padding: 14, marginBottom: 14 }}>
        <Row gap={8}>
          <SathiBadge />
          <T weight="b" size={14}>২টি পণ্য কম স্টক · রিঅর্ডার দরকার</T>
        </Row>
      </Card>
      <Card style={{ padding: 4 }}>
        {items.map((it, i, arr) => (
          <Pressable key={it.n} onPress={() => toast.show(`${it.n} · মজুদ ${it.q} টি`, 'info')}>
            <Row gap={12} style={{ padding: 12, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border2 }}>
              <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                <T size={22}>{it.e}</T>
              </View>
              <View style={{ flex: 1 }}>
                <T weight="s" size={14}>{it.n}</T>
                <T size={12} color={colors.ink2}>মজুদ: {it.q} টি</T>
              </View>
              {it.low ? <Chip kind="coral" size={11}>কম</Chip> : <Chip kind="green" size={11}>ঠিক</Chip>}
            </Row>
          </Pressable>
        ))}
      </Card>
      <Btn
        kind="greyOutline"
        label="নতুন পণ্য যোগ করুন"
        full
        style={{ marginTop: 14 }}
        iconLeft={<Ionicons name="add" size={16} color={colors.ink2} />}
        onPress={() => toast.show('নতুন পণ্য ফর্ম শীঘ্রই আসছে', 'info')}
      />
    </ScreenScroll>
  );
}

function PKSF() {
  const actions = useActions();
  const toast = useToast();
  return (
    <ScreenScroll>
      <Card tinted={colors.tealSoft} style={{ padding: 16, marginBottom: 12 }}>
        <Row gap={12}>
          <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <T size={28}>🏦</T>
          </View>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>PKSF · আরোপণ স্কোর</T>
            <T size={12.5} color={colors.ink2} style={{ marginTop: 2 }}>আপনার ঋণ স্বাস্থ্য ভালো</T>
          </View>
        </Row>
        <Row style={{ marginTop: 14, alignItems: 'baseline', justifyContent: 'space-between' }}>
          <T weight="b" size={36} color={colors.green}>৭২০</T>
          <T size={14} color={colors.ink2}>/ ১০০০</T>
          <Chip kind="green" size={11}>▲ +৪ এই মাসে</Chip>
        </Row>
      </Card>

      <Card style={{ padding: 16, marginBottom: 12 }}>
        <T weight="b" size={14}>স্কোর বিশ্লেষণ</T>
        {[
          { l: 'নিয়মিত আয়', v: 85 },
          { l: 'হিসাব রক্ষণ', v: 78 },
          { l: 'গ্রাহক বৃদ্ধি', v: 64 },
          { l: 'ডিজিটাল উপস্থিতি', v: 58 },
        ].map((m) => (
          <View key={m.l} style={{ marginTop: 10 }}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 4 }}>
              <T size={12.5} color={colors.ink2}>{m.l}</T>
              <T weight="b" size={12.5}>{m.v}</T>
            </Row>
            <View style={{ height: 6, backgroundColor: colors.border2, borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ width: (`${m.v}%`) as `${number}%`, height: '100%', backgroundColor: m.v >= 70 ? colors.green : m.v >= 60 ? colors.amber : colors.coral }} />
            </View>
          </View>
        ))}
      </Card>

      <Card style={{ padding: 16, marginBottom: 12 }}>
        <Row gap={8}>
          <SathiBadge />
          <T weight="b" size={14}>সাথীর সুপারিশ</T>
        </Row>
        <T size={14} style={{ marginTop: 8, lineHeight: 21 }}>
          আপনি ৳৫০,০০০ পর্যন্ত ঋণ পেতে পারেন। PO অফিসারকে রিপোর্ট পাঠানো হয়েছে।
        </T>
        <Row gap={8} style={{ marginTop: 12 }}>
          <Btn
            kind="teal"
            label="বিস্তারিত রিপোর্ট"
            full
            style={{ flex: 1 }}
            onPress={() => {
              toast.show('রিপোর্ট তৈরি হচ্ছে — সাথী জানাবে', 'success');
              actions.openOverlay('sathi', 'আমার PKSF রিপোর্ট বানিয়ে দাও');
            }}
            iconRight={<Ionicons name="arrow-forward" size={16} color="#fff" />}
          />
          <Btn
            kind="greyOutline"
            label="PDF"
            onPress={() => toast.show('PDF ডাউনলোড শুরু হয়েছে', 'success')}
            iconLeft={<Ionicons name="download-outline" size={16} color={colors.ink2} />}
          />
        </Row>
      </Card>
    </ScreenScroll>
  );
}
