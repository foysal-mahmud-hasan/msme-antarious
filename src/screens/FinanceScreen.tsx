import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Btn, Card, Chip, Row, SathiBadge, SectionHeader, T } from '../components/atoms';
import { PillTabs } from '../components/PillTabs';
import { ResponsiveGrid, ScreenScroll } from '../components/ScreenContainer';
import { StatPill } from '../components/StatPill';
import { useToast } from '../components/Toast';
import { toBn } from '../data/strings';
import { useActions } from '../state/AppActions';
import { useProducts } from '../state/ProductsStore';
import { useTransactions } from '../state/TransactionsStore';
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
  const actions = useActions();
  const { transactions, weekIncome, weekExpense, weekNet } = useTransactions();
  return (
    <ScreenScroll>
      <Row gap={8}>
        <StatPill value={`৳${toBn(weekIncome.toLocaleString('en-US'))}`} label="এই সপ্তাহ আয়" tint={colors.greenSoft} valueColor={colors.green} />
        <StatPill value={`৳${toBn(weekExpense.toLocaleString('en-US'))}`} label="এই সপ্তাহ ব্যয়" tint={colors.coralSoft} valueColor={colors.coral} />
        <StatPill value={`৳${toBn(weekNet.toLocaleString('en-US'))}`} label="নিট লাভ" tint={colors.saffronSoft} valueColor={colors.saffron} />
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
          <Pressable onPress={() => actions.openOverlay('ledger')} hitSlop={6}>
            <T size={13} color={colors.tealDark} weight="b">সব →</T>
          </Pressable>
        }
      />
      <Card style={{ padding: 4 }}>
        {transactions.map((tx, i, arr) => {
          const positive = tx.kind === 'income';
          const sign = positive ? '+' : '-';
          const label = `${sign}৳${toBn(tx.amount.toLocaleString('en-US'))}`;
          return (
            <Pressable key={tx.id} onPress={() => toast.show(`${tx.name} · ${label}`, 'info')}>
              <Row
                gap={12}
                style={{
                  padding: 12,
                  borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border2,
                }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: positive ? colors.greenSoft : colors.coralSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={positive ? 'arrow-down' : 'arrow-up'} size={16} color={positive ? colors.green : colors.coral} />
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="s" size={14}>{tx.name}</T>
                  <T size={12} color={colors.ink2}>{tx.counterparty} · {tx.when}</T>
                </View>
                <T weight="b" size={14} color={positive ? colors.green : colors.coral}>{label}</T>
              </Row>
            </Pressable>
          );
        })}
      </Card>

      <Btn
        kind="greyOutline"
        label="নতুন লেনদেন যোগ করুন"
        full
        style={{ marginTop: 14 }}
        iconLeft={<Ionicons name="add" size={16} color={colors.ink2} />}
        onPress={() => actions.openOverlay('transaction')}
      />
    </ScreenScroll>
  );
}

function Inventory() {
  const toast = useToast();
  const actions = useActions();
  const { products, lowCount, adjustStock } = useProducts();
  return (
    <ScreenScroll>
      {lowCount > 0 ? (
        <Card tinted={colors.amberSoft} style={{ padding: 14, marginBottom: 14 }}>
          <Row gap={8}>
            <SathiBadge />
            <T weight="b" size={14}>{toBn(lowCount)}টি পণ্য কম স্টক · রিঅর্ডার দরকার</T>
          </Row>
        </Card>
      ) : null}
      <Card style={{ padding: 4 }}>
        {products.map((it, i, arr) => {
          const low = it.stock <= it.lowThreshold;
          return (
            <Row
              key={it.id}
              gap={12}
              style={{ padding: 12, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border2 }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                <T size={22}>{it.emoji}</T>
              </View>
              <View style={{ flex: 1 }}>
                <T weight="s" size={14}>{it.name}</T>
                <T size={12} color={colors.ink2}>মজুদ: {toBn(it.stock)} টি · ৳{toBn(it.price)}</T>
              </View>
              <Row gap={4}>
                <Pressable
                  onPress={() => adjustStock(it.id, -1)}
                  hitSlop={6}
                  style={stepBtn}
                >
                  <Ionicons name="remove" size={14} color={colors.ink} />
                </Pressable>
                <Pressable
                  onPress={() => {
                    adjustStock(it.id, 1);
                    toast.show(`${it.name} +১`, 'success');
                  }}
                  hitSlop={6}
                  style={stepBtn}
                >
                  <Ionicons name="add" size={14} color={colors.ink} />
                </Pressable>
                {low ? <Chip kind="coral" size={11}>কম</Chip> : <Chip kind="green" size={11}>ঠিক</Chip>}
              </Row>
            </Row>
          );
        })}
      </Card>
      <Btn
        kind="greyOutline"
        label="নতুন পণ্য যোগ করুন"
        full
        style={{ marginTop: 14 }}
        iconLeft={<Ionicons name="add" size={16} color={colors.ink2} />}
        onPress={() => actions.openOverlay('newProduct')}
      />
    </ScreenScroll>
  );
}

const stepBtn = {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: colors.bg,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  borderWidth: 1,
  borderColor: colors.border2,
};

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
            onPress={() => actions.openOverlay('pksfReport')}
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
