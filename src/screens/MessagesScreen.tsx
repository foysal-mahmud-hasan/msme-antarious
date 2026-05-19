import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useResponsive } from '../components/AppFrame';
import { AppHeader } from '../components/AppHeader';
import { Avatar, Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { PillTabs } from '../components/PillTabs';
import { ResponsiveGrid, ScreenScroll } from '../components/ScreenContainer';
import { colors, fonts } from '../theme';

type Tab = 'inbox' | 'leads' | 'orders' | 'bcast';
type Convo = {
  id: number;
  esc?: boolean;
  sathi?: boolean;
  n: string;
  pl: 'fb' | 'wa';
  t: string;
  preview: string;
  badge: string;
  badgeKind: 'amber' | 'coral' | 'teal' | 'green';
  avatar: string;
  col: string;
};

const convos: Convo[] = [
  { id: 1, esc: true, n: 'করিম সাহেব', pl: 'fb', t: '২ মি', preview: 'দাম কমানো যাবে? ১০টা নেব...', badge: 'মূল্য আলোচনা', badgeKind: 'amber', avatar: 'ক', col: '#ffb077' },
  { id: 2, esc: true, n: 'সুমাইয়া আক্তার', pl: 'wa', t: '১৫ মি', preview: 'পণ্য পেলাম কিন্তু রঙ ভুল', badge: 'অভিযোগ', badgeKind: 'coral', avatar: 'স', col: '#f6a8b1' },
  { id: 3, sathi: true, n: 'নাসরিন বেগম', pl: 'fb', t: '৩ মি', preview: 'পণ্যটি স্টকে আছে। আগামীকাল পাঠাব।', badge: 'সাথী', badgeKind: 'teal', avatar: 'ন', col: '#a8d4ff' },
  { id: 4, sathi: true, n: 'রফিকুল ইসলাম', pl: 'wa', t: '৮ মি', preview: 'ডেলিভারি ২-৩ দিনে পৌঁছাবে।', badge: 'সাথী', badgeKind: 'teal', avatar: 'র', col: '#c6b8f0' },
  { id: 5, sathi: true, n: 'হাসিনা পারভীন', pl: 'wa', t: '২২ মি', preview: 'পেমেন্ট কীভাবে করবেন?', badge: 'সাথী', badgeKind: 'teal', avatar: 'হ', col: '#ffd28a' },
  { id: 6, n: 'মুনির খান', pl: 'fb', t: '১ ঘ', preview: 'অর্ডার পেয়েছি, ধন্যবাদ!', badge: 'সমাধান', badgeKind: 'green', avatar: 'ম', col: '#b0e6c5' },
];

export function MessagesScreen({ onOpenAgent, onOpenApprovals }: { onOpenAgent: () => void; onOpenApprovals: () => void }) {
  const [tab, setTab] = useState<Tab>('inbox');
  const [open, setOpen] = useState<Convo | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title={<T weight="b" size={22}>বার্তা</T>}
        subtitle="সাথী ৭টি পরিচালনা করছে"
        showAgentRunning
        onAgentPress={onOpenAgent}
        onNotificationPress={onOpenApprovals}
        notificationBadge
      />
      <PillTabs<Tab>
        tabs={[
          { id: 'inbox', label: 'ইনবক্স' },
          { id: 'leads', label: 'লিড' },
          { id: 'orders', label: 'অর্ডার' },
          { id: 'bcast', label: 'ব্রডকাস্ট' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'inbox' && <Inbox onOpen={setOpen} />}
      {tab === 'leads' && <Leads />}
      {tab === 'orders' && <Orders />}
      {tab === 'bcast' && <Broadcast />}

      {open ? (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.bg }}>
          <Conversation c={open} onClose={() => setOpen(null)} />
        </View>
      ) : null}
    </View>
  );
}

function Inbox({ onOpen }: { onOpen: (c: Convo) => void }) {
  const [filter, setFilter] = useState<'all' | 'you' | 'sathi' | 'done'>('all');
  const filters: { id: typeof filter; label: string; n: number }[] = [
    { id: 'all', label: 'সব', n: 12 },
    { id: 'you', label: 'আপনার জন্য', n: 2 },
    { id: 'sathi', label: 'সাথী দেখছে', n: 7 },
    { id: 'done', label: 'সমাধান', n: 3 },
  ];
  return (
    <ScreenScroll>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
        {filters.map((f) => (
          <Pressable
            key={f.id}
            onPress={() => setFilter(f.id)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: filter === f.id ? colors.saffron : '#F1EBDF',
            }}
          >
            <T weight="s" size={12.5} color={filter === f.id ? '#fff' : colors.ink}>
              {f.label} <T weight="b" size={12.5} color={filter === f.id ? 'rgba(255,255,255,0.85)' : colors.ink2}>{f.n}</T>
            </T>
          </Pressable>
        ))}
      </ScrollView>

      <Card style={{ marginTop: 14, padding: 4 }}>
        {convos.map((c, i) => (
          <Pressable
            key={c.id}
            onPress={() => onOpen(c)}
            style={{
              flexDirection: 'row',
              gap: 12,
              alignItems: 'center',
              padding: 12,
              borderTopWidth: i ? 1 : 0,
              borderTopColor: colors.border2,
              borderLeftWidth: 3,
              borderLeftColor: c.esc ? colors.amber : c.sathi ? colors.teal : 'transparent',
              marginLeft: c.esc || c.sathi ? -4 : 0,
              opacity: c.sathi ? 0.92 : 1,
            }}
          >
            <View>
              <Avatar text={c.avatar} bg={c.col} color={colors.ink} />
              <View style={styles.platformDot}>
                {c.pl === 'fb' ? (
                  <MaterialCommunityIcons name="facebook" size={12} color="#1877F2" />
                ) : (
                  <MaterialCommunityIcons name="whatsapp" size={12} color="#25D366" />
                )}
              </View>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <T weight="b" size={14.5}>{c.n}</T>
                <T size={12} color={colors.ink2}>{c.t}</T>
              </Row>
              <Row gap={6} style={{ marginTop: 3 }}>
                {c.sathi ? <SathiBadge size={16} /> : null}
                <T size={13} color={colors.ink2} numberOfLines={1} style={{ flex: 1 }}>
                  {c.preview}
                </T>
              </Row>
            </View>
            <Chip kind={c.badgeKind} size={11}>{c.badge}</Chip>
          </Pressable>
        ))}
      </Card>
    </ScreenScroll>
  );
}

function Leads() {
  const leads = [
    { n: 'করিম সাহেব', interest: 'মিনি ফ্যান × ১০', score: 'গরম', kind: 'coral' as const, time: '৩৫ মি বাকি' },
    { n: 'নাজমা পারভীন', interest: 'কুলিং কুশন', score: 'মাঝারি', kind: 'amber' as const, time: '২ ঘ' },
    { n: 'আবুল হোসেন', interest: 'হ্যান্ড ফ্যান × ৫', score: 'ঠান্ডা', kind: 'green' as const, time: '১ দিন' },
  ];
  return (
    <ScreenScroll>
      <Card tinted={colors.tealSoft} style={{ padding: 14, marginBottom: 14 }}>
        <Row gap={8}>
          <SathiBadge />
          <T weight="b" size={14}>সাথীর অন্তর্দৃষ্টি</T>
        </Row>
        <T size={14} style={{ marginTop: 6, lineHeight: 20 }}>
          <T weight="b" size={14}>৩টি গরম লিড</T> আজ মেয়াদ শেষ হবে — দ্রুত যোগাযোগ করুন
        </T>
      </Card>
      <Card style={{ padding: 4 }}>
        {leads.map((l, i) => (
          <Row
            key={l.n}
            gap={12}
            style={{ padding: 14, borderTopWidth: i ? 1 : 0, borderTopColor: colors.border2 }}
          >
            <Avatar text={l.n[0]} bg={colors.saffronSoft} color={colors.saffron} />
            <View style={{ flex: 1 }}>
              <T weight="b" size={14.5}>{l.n}</T>
              <T size={12.5} color={colors.ink2}>{l.interest}</T>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Chip kind={l.kind} size={11}>{l.score}</Chip>
              <T size={11} color={colors.ink2}>{l.time}</T>
            </View>
          </Row>
        ))}
      </Card>
    </ScreenScroll>
  );
}

function Orders() {
  const orders = [
    { id: 'অর্ডার-৩৪২', cust: 'করিম সাহেব', items: '৩ পণ্য', t: '৳২,৭৫০', status: 'প্যাকিং', kind: 'amber' as const },
    { id: 'অর্ডার-৩৪১', cust: 'নাসরিন বেগম', items: '১ পণ্য', t: '৳৮৫০', status: 'পথে', kind: 'teal' as const },
    { id: 'অর্ডার-৩৪০', cust: 'মুনির খান', items: '২ পণ্য', t: '৳১,৬০০', status: 'ডেলিভার্ড', kind: 'green' as const },
    { id: 'অর্ডার-৩৩৯', cust: 'হাসিনা পারভীন', items: '১ পণ্য', t: '৳৩৫০', status: 'বাতিল', kind: 'coral' as const },
  ];
  return (
    <ScreenScroll>
      {orders.map((o) => (
        <Card key={o.id} style={{ padding: 14, marginBottom: 10 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <T weight="b" size={14}>{o.id}</T>
            <Chip kind={o.kind} size={11}>{o.status}</Chip>
          </Row>
          <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>{o.cust} · {o.items}</T>
          <Row style={{ justifyContent: 'space-between', marginTop: 10 }}>
            <T weight="b" size={18} color={colors.green}>{o.t}</T>
            <Pressable hitSlop={6}>
              <T weight="b" size={13} color={colors.tealDark}>বিস্তারিত →</T>
            </Pressable>
          </Row>
        </Card>
      ))}
    </ScreenScroll>
  );
}

function Broadcast() {
  return (
    <ScreenScroll>
      <Card style={{ padding: 16, marginBottom: 12 }}>
        <Row gap={8}>
          <SathiBadge />
          <Chip kind="teal">সাথীর প্রস্তাব</Chip>
        </Row>
        <T weight="b" size={16} style={{ marginTop: 8 }}>মিনি ফ্যান সেলের জন্য ৩৪ জনকে পাঠান?</T>
        <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>
          ৩ মাসে যারা গরমকালীন পণ্য কিনেছেন · WhatsApp + Facebook
        </T>
        <Row gap={8} style={{ marginTop: 14 }}>
          <Btn kind="teal" label="অনুমোদন দিন" size="sm" full style={{ flex: 1 }} />
          <Btn kind="greyOutline" label="সম্পাদনা" size="sm" />
        </Row>
      </Card>
      <Card style={{ padding: 16, marginBottom: 12 }}>
        <T weight="b" size={14}>সাম্প্রতিক ক্যাম্পেইন</T>
        {[
          { n: 'ঈদ অফার', r: '৯২ জন', t: '১৪ এপ্রিল' },
          { n: 'নতুন স্টক', r: '৪১ জন', t: '২ এপ্রিল' },
        ].map((c, i) => (
          <Row key={c.n} gap={12} style={{ marginTop: 12, paddingTop: 12, borderTopWidth: i ? 1 : 0, borderTopColor: colors.border2 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.saffronSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="megaphone-outline" size={18} color={colors.saffron} />
            </View>
            <View style={{ flex: 1 }}>
              <T weight="s" size={14}>{c.n}</T>
              <T size={12} color={colors.ink2}>{c.t} · {c.r} পেয়েছে</T>
            </View>
          </Row>
        ))}
      </Card>
    </ScreenScroll>
  );
}

function Conversation({ c, onClose }: { c: Convo; onClose: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={styles.convoHeader}>
        <Pressable onPress={onClose} hitSlop={6} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </Pressable>
        <Avatar text={c.avatar} bg={c.col} color={colors.ink} />
        <View style={{ flex: 1 }}>
          <Row gap={6}>
            <T weight="b" size={15}>{c.n}</T>
            <MaterialCommunityIcons name={c.pl === 'fb' ? 'facebook' : 'whatsapp'} size={14} color={c.pl === 'fb' ? '#1877F2' : '#25D366'} />
          </Row>
          <T size={12} color={colors.ink2}>
            {c.pl === 'fb' ? 'Facebook' : 'WhatsApp'} · ঢাকা · ৮টি অর্ডার
          </T>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14, gap: 10 }}>
        <Bubble who="other">আপু, মিনি ফ্যান এর দাম কত?</Bubble>
        <Bubble who="me">৳৮৫০ প্রতি পিস। ভাল কোয়ালিটি।</Bubble>
        <Bubble who="other">দাম কমানো যাবে? ১০টা নেব। ৩৫ দিনের মধ্যে বিক্রি করব ইনশাআল্লাহ্‌</Bubble>
        <Row gap={8} style={{ justifyContent: 'center', marginVertical: 8 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border2 }} />
          <T size={12} color={colors.ink2}>সাথী চিন্তা করছে</T>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.border2 }} />
        </Row>
      </ScrollView>

      <View style={{ padding: 12 }}>
        <Card tinted={colors.tealSoft} style={{ padding: 14, borderColor: 'rgba(46,196,182,0.3)', borderWidth: 1 }}>
          <Row gap={8}>
            <SathiBadge />
            <T weight="b" size={13.5} color={colors.tealDark}>সাথীর পরামর্শ</T>
          </Row>
          <T size={14.5} style={{ marginTop: 8, lineHeight: 21 }}>
            ১০ পিসে <T weight="b" size={14.5}>৫% ছাড় (৳৪২.৫০)</T> দিন — এখনও <T weight="b" size={14.5} color={colors.green}>৳৩২০/পিস লাভ</T> থাকবে। করিম ৮ বার অর্ডার দিয়েছেন।
          </T>
          <Row gap={8} style={{ marginTop: 12 }}>
            <Btn kind="teal" label="পাঠান" size="sm" full style={{ flex: 1 }} iconRight={<Ionicons name="checkmark" size={14} color="#fff" />} />
            <Btn kind="greyOutline" label="পরিবর্তন" size="sm" />
          </Row>
        </Card>
      </View>

      <View style={styles.composer}>
        <View style={styles.input}>
          <TextInput placeholder="বার্তা লিখুন…" placeholderTextColor={colors.ink2} style={{ flex: 1, fontFamily: fonts.medium }} />
          <Pressable style={styles.micBtn}>
            <Ionicons name="mic" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Bubble({ who, children }: { who: 'me' | 'other'; children: React.ReactNode }) {
  const me = who === 'me';
  return (
    <View
      style={{
        alignSelf: me ? 'flex-end' : 'flex-start',
        backgroundColor: me ? colors.saffron : '#fff',
        borderColor: colors.border2,
        borderWidth: me ? 0 : 1,
        borderRadius: 16,
        borderBottomRightRadius: me ? 4 : 16,
        borderBottomLeftRadius: !me ? 4 : 16,
        paddingVertical: 10,
        paddingHorizontal: 14,
        maxWidth: '80%',
      }}
    >
      <T color={me ? '#fff' : colors.ink} size={14}>{children}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  platformDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  convoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border2,
    backgroundColor: '#fff',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border2,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
    gap: 4,
  },
  micBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
