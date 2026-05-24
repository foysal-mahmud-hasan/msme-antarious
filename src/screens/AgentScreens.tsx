import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { colors } from '../theme';

/* ──────────────────────────────────────────────────────────────────
 * 1. SATHI LIVE — Agent Command Center
 * ──────────────────────────────────────────────────────────────── */

const NAVY = '#0B1929';
const NAVY2 = '#132237';
const NAVY3 = '#1B304B';

type FeedState = 'done' | 'running' | 'waiting';

type FeedItem = {
  state: FeedState;
  icon: string;
  text: string;
  t: string;
  cta?: 'approve' | 'reorder';
};

const SUB_AGENTS = [
  { e: '💬', l: 'কথা', v: '১৪টি কথোপকথন চলছে', c: colors.teal },
  { e: '📦', l: 'অর্ডার', v: '৩টি প্রক্রিয়াধীন', c: colors.saffron },
  { e: '🔥', l: 'বাজার', v: 'ট্রেন্ড স্ক্যান চলছে', c: '#ef4444' },
  { e: '💰', l: 'হিসাব', v: 'আজকের হিসাব আপডেট', c: colors.green },
  { e: '📊', l: 'রিপোর্ট', v: 'PKSF রিপোর্ট তৈরি', c: '#a78bfa' },
  { e: '🛍️', l: 'পণ্য', v: 'নতুন ক্যাটালগ পাবলিশ', c: '#f472b6' },
];

const FEED: FeedItem[] = [
  { state: 'done', icon: '💬', text: 'করিম সাহেবকে উত্তর দিয়েছি — ৫% ছাড়ে ১০টি মিনি ফ্যান অর্ডার নিশ্চিত', t: '৩ মিনিট আগে' },
  { state: 'done', icon: '🚚', text: 'Pathao-তে ২টি পিকআপ রিকোয়েস্ট দিয়েছি', t: '১২ মিনিট আগে' },
  { state: 'running', icon: '✍️', text: 'নাসরিন বেগমের প্রশ্নের উত্তর লিখছি…', t: 'এখন' },
  { state: 'running', icon: '📊', text: 'এই সপ্তাহের PKSF রিপোর্ট তৈরি করছি…', t: 'এখন' },
  { state: 'waiting', icon: '💰', text: 'রহিম সাহেব ৳৫,০০০ এর বাল্ক অর্ডার দিতে চান — আপনার অনুমোদন দরকার', t: 'অপেক্ষায়', cta: 'approve' },
  { state: 'waiting', icon: '📦', text: 'মিনি ফ্যান রিঅর্ডার — ৳৮,০০০ লাগবে। 1688-এ অর্ডার দেওয়ার আগে নিশ্চিত করুন', t: 'অপেক্ষায়', cta: 'reorder' },
  { state: 'done', icon: '🔥', text: 'প্রতিযোগী Rahim Store-এর দাম কমার সতর্কতা পাঠিয়েছি', t: '১ ঘণ্টা আগে' },
];

const TODAY_SUMMARY = [
  '২৩টি কাস্টমার মেসেজের উত্তর দিয়েছি',
  '৫টি অর্ডার নিশ্চিত ও কুরিয়ারে দিয়েছি',
  '১টি প্রতিযোগীর দাম কমার সতর্কতা পাঠিয়েছি',
  '৩টি নতুন লিড ধরেছি ও স্কোর করেছি',
  '১টি ডেড স্টক ক্লিয়ারেন্স পোস্ট দিয়েছি',
  'সাপ্তাহিক PKSF রিপোর্ট পাঠিয়েছি',
];

export function AgentLiveScreen({ onClose }: { onClose: () => void }) {
  const actions = useActions();
  const { isDesktop } = useResponsive();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: NAVY }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 18, borderBottomColor: 'rgba(255,255,255,0.06)', borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtnDark}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <T weight="b" size={15} color="#fff">সাথী লাইভ</T>
            <T size={11.5} color="rgba(255,255,255,0.55)">Agent Command Center</T>
          </View>
          <Pressable onPress={() => actions.openOverlay('autopilot')} hitSlop={8} style={iconBtnDark}>
            <Ionicons name="options-outline" size={20} color="#fff" />
          </Pressable>
        </Row>

        <View style={{ alignItems: 'center', marginTop: 14 }}>
          <BreathingOrb />
          <T weight="b" size={19} color="#fff" style={{ marginTop: 10 }}>সাথী এখন কাজ করছে</T>
          <Row gap={4}>
            <T size={13} color="rgba(255,255,255,0.65)">আপনার হয়ে</T>
            <T size={13} weight="b" color={colors.teal}>৬টি কাজ</T>
            <T size={13} color="rgba(255,255,255,0.65)">চলছে এই মুহূর্তে</T>
          </Row>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14, paddingBottom: 40, alignItems: 'stretch' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 720 : undefined, alignSelf: 'center' }}>
          {/* Sub-agents grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginBottom: 14 }}>
            {SUB_AGENTS.map((a) => (
              <View key={a.l} style={{ width: '50%', padding: 4 }}>
                <View style={{ backgroundColor: NAVY2, borderRadius: 12, padding: 10, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1 }}>
                  <Row gap={6}>
                    <T size={16}>{a.e}</T>
                    <T weight="b" size={12} color="#fff">{a.l} Agent</T>
                    <View style={{ flex: 1 }} />
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: a.c }} />
                  </Row>
                  <T size={11.5} color="rgba(255,255,255,0.65)" style={{ marginTop: 4 }}>{a.v}</T>
                </View>
              </View>
            ))}
          </View>

          <Row style={{ justifyContent: 'space-between', marginBottom: 10 }}>
            <T weight="b" size={13} color="#fff">লাইভ অ্যাক্টিভিটি</T>
            <T size={11.5} color="rgba(255,255,255,0.5)">রিয়েল-টাইম</T>
          </Row>

          <View style={{ backgroundColor: NAVY2, borderRadius: 14, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, overflow: 'hidden' }}>
            {FEED.map((f, i) => {
              const col = f.state === 'done' ? '#22c55e' : f.state === 'running' ? colors.teal : '#f59e0b';
              const label = f.state === 'done' ? 'সম্পন্ন' : f.state === 'running' ? 'চলছে' : 'অপেক্ষা করছি';
              return (
                <View
                  key={i}
                  style={{
                    padding: 12,
                    borderBottomWidth: i < FEED.length - 1 ? 1 : 0,
                    borderBottomColor: 'rgba(255,255,255,0.05)',
                    flexDirection: 'row',
                    gap: 10,
                  }}
                >
                  <View style={{ alignItems: 'center', paddingTop: 3, gap: 4 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: col }} />
                    <T size={18}>{f.icon}</T>
                  </View>
                  <View style={{ flex: 1 }}>
                    <T weight="b" size={11} color={col} style={{ textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</T>
                    <T size={13.5} color="#fff" style={{ marginTop: 3, lineHeight: 19 }}>{f.text}</T>
                    <T size={11} color="rgba(255,255,255,0.45)" style={{ marginTop: 4 }}>{f.t}</T>
                    {f.cta === 'approve' && (
                      <Row gap={6} style={{ marginTop: 8 }}>
                        <Pressable
                          onPress={() => actions.openOverlay('approvals')}
                          style={{ flex: 1, padding: 8, borderRadius: 8, backgroundColor: colors.green, alignItems: 'center' }}
                        >
                          <T weight="b" size={12.5} color="#fff">✓ অনুমোদন করুন</T>
                        </Pressable>
                        <Pressable
                          onPress={() => actions.openOverlay('approvals')}
                          style={{ padding: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        >
                          <T weight="s" size={12.5} color="#fff">দেখুন</T>
                        </Pressable>
                      </Row>
                    )}
                    {f.cta === 'reorder' && (
                      <Row gap={6} style={{ marginTop: 8 }}>
                        <Pressable
                          onPress={() => actions.openOverlay('approvals')}
                          style={{ flex: 1, padding: 8, borderRadius: 8, backgroundColor: colors.saffron, alignItems: 'center' }}
                        >
                          <T weight="b" size={12.5} color="#fff">হ্যাঁ, দাও</T>
                        </Pressable>
                        <Pressable
                          onPress={() => actions.openOverlay('approvals')}
                          style={{ padding: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        >
                          <T weight="s" size={12.5} color="#fff">পরে</T>
                        </Pressable>
                      </Row>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Today's autonomous summary */}
          <View style={{ marginTop: 18, backgroundColor: NAVY2, borderRadius: 14, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, padding: 14 }}>
            <Row gap={8}>
              <T size={18}>🤖</T>
              <T weight="b" size={13} color="#fff">আজ সাথী আপনার হয়ে করেছে</T>
            </Row>
            <View style={{ gap: 7, marginTop: 10 }}>
              {TODAY_SUMMARY.map((t, i) => (
                <Row key={i} gap={8}>
                  <Ionicons name="checkmark" size={14} color="#22c55e" />
                  <T size={13} color="rgba(255,255,255,0.85)" style={{ flex: 1 }}>{t}</T>
                </Row>
              ))}
            </View>
            <View style={{ marginTop: 12, padding: 10, backgroundColor: 'rgba(34,197,94,0.12)', borderRadius: 10, alignItems: 'center' }}>
              <T size={12.5} color="#86efac">
                🎉 আপনাকে মাত্র <T weight="b" size={12.5} color="#86efac">২টি সিদ্ধান্ত</T> নিতে হয়েছে আজ
              </T>
            </View>
          </View>

          {/* Bottom 3-tile grid + memory link */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginTop: 14 }}>
            {[
              { l: 'অনুমোদন কেন্দ্র', e: '🔔', n: 3, fn: () => actions.openOverlay('approvals') },
              { l: 'বিশ্বাস স্তর', e: '🎯', n: null, fn: () => actions.openOverlay('trust') },
              { l: 'দিনের সময়সূচি', e: '⏱', n: null, fn: () => actions.openOverlay('day') },
            ].map((x) => (
              <View key={x.l} style={{ width: '33.333%', padding: 4 }}>
                <Pressable
                  onPress={x.fn}
                  style={{
                    padding: 12,
                    backgroundColor: NAVY3,
                    borderColor: 'rgba(255,255,255,0.08)',
                    borderWidth: 1,
                    borderRadius: 12,
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <T size={22}>{x.e}</T>
                  <T size={11.5} color="#fff" style={{ marginTop: 4 }}>{x.l}</T>
                  {x.n != null && (
                    <View style={{ position: 'absolute', top: 6, right: 6, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, backgroundColor: colors.coral }}>
                      <T weight="b" size={10} color="#fff">{x.n}</T>
                    </View>
                  )}
                </Pressable>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => actions.openOverlay('memory')}
            style={{
              marginTop: 8,
              padding: 12,
              backgroundColor: 'rgba(46,196,182,0.12)',
              borderColor: 'rgba(46,196,182,0.3)',
              borderWidth: 1,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <T weight="b" size={13} color={colors.teal}>🧠 সাথী আপনার সম্পর্কে কী জানে দেখুন →</T>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BreathingOrb() {
  const scale1 = useRef(new Animated.Value(0.85)).current;
  const opacity1 = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale1, { toValue: 1.15, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(scale1, { toValue: 0.85, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ]),
        Animated.sequence([
          Animated.timing(opacity1, { toValue: 0.95, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(opacity1, { toValue: 0.6, duration: 1800, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale1, opacity1]);

  return (
    <View style={{ width: 96, height: 96, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: 'rgba(46,196,182,0.25)',
          opacity: opacity1,
          transform: [{ scale: scale1 }],
        }}
      />
      <Animated.View
        style={{
          position: 'absolute',
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: 'rgba(46,196,182,0.45)',
          opacity: opacity1,
          transform: [{ scale: scale1 }],
        }}
      />
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.teal,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <T weight="b" size={28} color="#fff">স</T>
      </View>
    </View>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * 2. AUTOPILOT
 * ──────────────────────────────────────────────────────────────── */

type ToggleKey =
  | 'autoReply' | 'autoOrder' | 'bigOrder' | 'codCall'
  | 'autoPost' | 'autoBoost' | 'campaignSuggest' | 'campaignSend'
  | 'stockAlert' | 'autoReorder' | 'trendShow'
  | 'weekReport' | 'summary';

type ToggleItem = { k: ToggleKey; l: string; note?: string; money?: boolean; locked?: boolean };

const SECTIONS: { title: string; items: ToggleItem[] }[] = [
  {
    title: 'কাস্টমার সেবা',
    items: [
      { k: 'autoReply', l: 'কাস্টমারদের স্বয়ংক্রিয় উত্তর দাও' },
      { k: 'autoOrder', l: 'সাধারণ প্রশ্নের অর্ডার নিজেই নাও' },
      { k: 'bigOrder', l: '৳৩,০০০+ এর বড় অর্ডারে আমাকে জিজ্ঞেস করো', money: true },
      { k: 'codCall', l: 'COD নিশ্চিতকরণ কল দাও' },
    ],
  },
  {
    title: 'পণ্য ও মার্কেটিং',
    items: [
      { k: 'autoPost', l: 'Facebook-এ নতুন পণ্যের পোস্ট দাও' },
      { k: 'autoBoost', l: 'আমার হয়ে বুস্ট করো', money: true },
      { k: 'campaignSuggest', l: 'মৌসুমী ক্যাম্পেইনের পরামর্শ দাও' },
      { k: 'campaignSend', l: 'ক্যাম্পেইন নিজেই পাঠাও' },
    ],
  },
  {
    title: 'সোর্সিং ও ইনভেন্টরি',
    items: [
      { k: 'stockAlert', l: 'স্টক কম হলে সতর্ক করো' },
      { k: 'autoReorder', l: 'নিজেই রিঅর্ডার করো', money: true },
      { k: 'trendShow', l: 'নতুন ট্রেন্ডিং পণ্য দেখাও' },
    ],
  },
  {
    title: 'PKSF ও হিসাব',
    items: [
      { k: 'weekReport', l: 'সাপ্তাহিক PKSF রিপোর্ট পাঠাও', note: 'বন্ধ করা যাবে না — সব টিয়ারে বাধ্যতামূলক', locked: true },
      { k: 'summary', l: 'হিসাবের সারসংক্ষেপ পাঠাও' },
    ],
  },
];

export function AutopilotScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const [state, setState] = useState<Record<ToggleKey, boolean>>({
    autoReply: true, autoOrder: true, bigOrder: false, codCall: true,
    autoPost: true, autoBoost: false, campaignSuggest: true, campaignSend: false,
    stockAlert: true, autoReorder: false, trendShow: true,
    weekReport: true, summary: true,
  });

  const toggle = (k: ToggleKey, item: ToggleItem) => {
    if (item.locked) {
      toast.show(item.note ?? 'এই অপশন বন্ধ করা যাবে না', 'info');
      return;
    }
    setState((s) => ({ ...s, [k]: !s[k] }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 12, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>অটোপাইলট নিয়ন্ত্রণ</T>
            <T size={12} color={colors.ink2}>সাথী কী নিজে করবে, কী জিজ্ঞেস করবে</T>
          </View>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, alignItems: 'stretch' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 640 : undefined, alignSelf: 'center' }}>
          <Card style={{ backgroundColor: colors.tealDark, borderColor: 'transparent', padding: 16, marginBottom: 18 }}>
            <T size={12} color="rgba(255,255,255,0.85)" weight="s">সাথীর স্বায়ত্তশাসন স্তর</T>
            <Row gap={6} style={{ alignItems: 'baseline', marginTop: 4 }}>
              <T weight="b" size={22} color="#fff">বিশ্বস্ত</T>
              <T size={13} color="rgba(255,255,255,0.9)">· ফেজ ২</T>
            </Row>
            <T size={12} color="rgba(255,255,255,0.9)" style={{ marginTop: 2 }}>২ মাস ধরে ব্যবহার করছেন</T>
            <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 4, marginTop: 12, overflow: 'hidden' }}>
              <View style={{ width: '55%', height: '100%', backgroundColor: '#fff', borderRadius: 4 }} />
            </View>
            <Row style={{ justifyContent: 'space-between', marginTop: 6 }}>
              <T size={10.5} color="rgba(255,255,255,0.85)">নতুন</T>
              <T size={10.5} weight="b" color="#fff">বিশ্বস্ত</T>
              <T size={10.5} color="rgba(255,255,255,0.85)">ব্যবস্থাপক</T>
              <T size={10.5} color="rgba(255,255,255,0.85)">অংশীদার</T>
            </Row>
            <T size={11.5} color="rgba(255,255,255,0.85)" style={{ marginTop: 10, fontStyle: 'italic' }}>"বেশি ব্যবহার করলে সাথী আরও বুদ্ধিমান হবে"</T>
          </Card>

          {SECTIONS.map((sec) => (
            <View key={sec.title} style={{ marginBottom: 18 }}>
              <T weight="b" size={12} color={colors.ink2} style={{ marginBottom: 8, paddingHorizontal: 4, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                {sec.title}
              </T>
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                {sec.items.map((it, i) => (
                  <View
                    key={it.k}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderBottomWidth: i < sec.items.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border2,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <T size={14} weight="s">{it.l}</T>
                      {it.note ? <T size={11.5} color={colors.ink2} style={{ marginTop: 2 }}>{it.note}</T> : null}
                      {it.money ? <T size={11} color={colors.coral} weight="s" style={{ marginTop: 2 }}>💰 টাকা সংক্রান্ত</T> : null}
                    </View>
                    <Toggle on={state[it.k]} locked={!!it.locked} onPress={() => toggle(it.k, it)} />
                  </View>
                ))}
              </Card>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Toggle({ on, locked, onPress }: { on: boolean; locked?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        backgroundColor: on ? colors.teal : '#d8d0c0',
        justifyContent: 'center',
        opacity: locked ? 0.6 : 1,
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 23 : 3,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: '#fff',
        }}
      />
    </Pressable>
  );
}

/* ──────────────────────────────────────────────────────────────────
 * 3. APPROVALS
 * ──────────────────────────────────────────────────────────────── */

type ApprovalKind = 'money' | 'order' | 'campaign' | 'digital';

type Approval = {
  id: number;
  kind: ApprovalKind;
};

export function ApprovalsScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const [items, setItems] = useState<Approval[]>([
    { id: 1, kind: 'money' },
    { id: 2, kind: 'order' },
    { id: 3, kind: 'campaign' },
    { id: 4, kind: 'digital' },
  ]);

  const resolve = (id: number, msg: string, kind: 'success' | 'info' = 'success') => {
    setItems((p) => p.filter((x) => x.id !== id));
    toast.show(msg, kind);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 12, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>অনুমোদন কেন্দ্র</T>
            <T size={12} color={colors.ink2}>আপনার সিদ্ধান্ত দরকার · {items.length}টি</T>
          </View>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, alignItems: 'stretch' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 640 : undefined, alignSelf: 'center' }}>
          {items.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 60 }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="checkmark-done" size={36} color={colors.green} />
              </View>
              <T weight="b" size={18} style={{ marginTop: 16 }}>সব ক্লিয়ার!</T>
              <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>আপাতত অনুমোদনের অপেক্ষায় কিছু নেই</T>
            </View>
          ) : (
            <>
              <Card tinted={colors.tealSoft} style={{ padding: 12, marginBottom: 14 }}>
                <Row gap={8}>
                  <SathiBadge />
                  <T size={13} color={colors.tealDark} style={{ flex: 1 }}>৩০ সেকেন্ডে শেষ করুন — বাকি সব আমি সামলাচ্ছি</T>
                </Row>
              </Card>

              {items.map((it) => {
                if (it.kind === 'money') return <MoneyDecisionCard key={it.id} onApprove={() => resolve(it.id, 'অনুমোদিত: মিনি ফ্যান রিঅর্ডার')} onDefer={() => resolve(it.id, 'পরে দেখা হবে', 'info')} />;
                if (it.kind === 'order') return <LargeOrderCard key={it.id} onAccept={() => resolve(it.id, 'অর্ডার গৃহীত')} onReject={() => resolve(it.id, 'অর্ডার বাতিল', 'info')} onPeek={() => toast.show('কাস্টমার প্রোফাইল আসছে…', 'info')} />;
                if (it.kind === 'campaign') return <CampaignCard key={it.id} onSend={() => resolve(it.id, 'ক্যাম্পেইন ৩৮৫ জনকে পাঠানো হচ্ছে…')} onEdit={() => toast.show('মেসেজ এডিট করুন…', 'info')} />;
                return <DigitalStepCard key={it.id} onPost={() => resolve(it.id, 'Facebook পোস্ট প্রকাশিত')} onPeek={() => toast.show('পোস্ট প্রিভিউ…', 'info')} />;
              })}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MoneyDecisionCard({ onApprove, onDefer }: { onApprove: () => void; onDefer: () => void }) {
  return (
    <Card leftBar={colors.coral} style={{ padding: 16, marginBottom: 12 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Chip kind="coral">💰 টাকা সিদ্ধান্ত</Chip>
        <T weight="b" size={11.5} color={colors.coral}>৩ দিনে শেষ</T>
      </Row>
      <T weight="b" size={16} style={{ marginTop: 8 }}>মিনি ফ্যান — রিঅর্ডার</T>
      <T weight="b" size={24} style={{ marginTop: 4 }}>৳১২,০০০</T>
      <T size={12.5} color={colors.ink2}>৪৮ ইউনিট × ৳২৫০ · 1688 সাপ্লায়ার</T>
      <View style={{ backgroundColor: colors.tealSoft, borderRadius: 10, padding: 10, marginTop: 12, flexDirection: 'row', gap: 8 }}>
        <SathiBadge />
        <T size={13} color={colors.ink} style={{ flex: 1, lineHeight: 19 }}>"৮টি বাকি। ৩ দিনে শেষ হবে। China থেকে আসতে ৩৫ দিন। এখন না দিলে স্টক আউট।"</T>
      </View>
      <Row gap={8} style={{ marginTop: 12 }}>
        <Btn kind="primary" size="sm" label="✓ অনুমোদন করি" full onPress={onApprove} style={{ backgroundColor: colors.green }} />
        <Btn kind="greyOutline" size="sm" label="⏸ পরে করব" full onPress={onDefer} />
      </Row>
    </Card>
  );
}

function LargeOrderCard({ onAccept, onReject, onPeek }: { onAccept: () => void; onReject: () => void; onPeek: () => void }) {
  return (
    <Card leftBar={colors.amber} style={{ padding: 16, marginBottom: 12 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Chip kind="amber">📦 বড় অর্ডার</Chip>
        <T weight="b" size={11.5} color={colors.amber}>২ ঘণ্টায় শেষ</T>
      </Row>
      <Row gap={10} style={{ marginTop: 10 }}>
        <Avatar text="র" bg="#a8d4ff" />
        <View style={{ flex: 1 }}>
          <T weight="b" size={15}>রহিম সাহেব</T>
          <T size={12} color={colors.ink2}>ময়মনসিংহ · নতুন কাস্টমার</T>
        </View>
        <T weight="b" size={18} color={colors.amber}>৳৮,৫০০</T>
      </Row>
      <T size={13} style={{ marginTop: 10 }}>২০টি মিনি ফ্যান · COD পেমেন্ট</T>
      <View style={{ backgroundColor: colors.tealSoft, borderRadius: 10, padding: 10, marginTop: 10, flexDirection: 'row', gap: 8 }}>
        <SathiBadge />
        <T size={13} style={{ flex: 1, lineHeight: 19 }}>"এই কাস্টমার নতুন। আগে কখনো অর্ডার দেননি। সাবধান থাকা ভালো।"</T>
      </View>
      <Row gap={6} style={{ marginTop: 12 }}>
        <Btn kind="primary" size="sm" label="✅ নিই" full style={{ backgroundColor: colors.green }} onPress={onAccept} />
        <Btn kind="coralOutline" size="sm" label="❌ না নিই" full onPress={onReject} />
        <Btn kind="greyOutline" size="sm" label="👁 দেখি" full onPress={onPeek} />
      </Row>
    </Card>
  );
}

function CampaignCard({ onSend, onEdit }: { onSend: () => void; onEdit: () => void }) {
  return (
    <Card leftBar={colors.teal} style={{ padding: 16, marginBottom: 12 }}>
      <Chip kind="teal">📣 ক্যাম্পেইন</Chip>
      <T weight="b" size={16} style={{ marginTop: 8 }}>ঈদ ক্যাম্পেইন পাঠাই?</T>
      <T size={12.5} color={colors.ink2} style={{ marginTop: 2 }}>৩৮৫ জন কাস্টমারকে WhatsApp মেসেজ</T>
      <View style={{ backgroundColor: colors.bg, borderRadius: 10, padding: 12, marginTop: 10, borderColor: colors.border2, borderStyle: 'dashed', borderWidth: 1 }}>
        <T size={11.5} weight="s" color={colors.ink2} style={{ marginBottom: 4 }}>মেসেজ প্রিভিউ</T>
        <T size={13} style={{ lineHeight: 20 }}>
          আসসালামু আলাইকুম! 🌙{'\n'}
          ঈদ মোবারক! আমাদের নতুন কালেকশনে <T weight="b" size={13}>২০% ছাড়</T> পাচ্ছেন। মিনি ফ্যান, ছাতা, ও আরও পণ্য। অর্ডার দিতে রিপ্লাই দিন। — রহিমা স্টোর
        </T>
      </View>
      <Row gap={8} style={{ marginTop: 12 }}>
        <Btn kind="teal" size="sm" label="✅ পাঠাও" full onPress={onSend} />
        <Btn kind="greyOutline" size="sm" label="✏️ পরিবর্তন" full onPress={onEdit} />
      </Row>
    </Card>
  );
}

function DigitalStepCard({ onPost, onPeek }: { onPost: () => void; onPeek: () => void }) {
  return (
    <Card leftBar={colors.green} style={{ padding: 16, marginBottom: 12 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Chip kind="green">📷 ডিজিটাল ধাপ</Chip>
        <SathiBadge />
      </Row>
      <T weight="b" size={16} style={{ marginTop: 8 }}>প্রথম Facebook পোস্ট দেওয়ার সময়</T>
      <T size={12.5} color={colors.ink2} style={{ marginTop: 2 }}>আমি ছবি ও ক্যাপশন তৈরি করে রেখেছি। শুধু অনুমোদন দিন।</T>
      <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, marginTop: 10, borderColor: colors.border2, borderWidth: 1 }}>
        <Row gap={8}>
          <Avatar text="র" size={32} />
          <View>
            <T weight="b" size={12.5}>রহিমা স্টোর</T>
            <T size={10.5} color={colors.ink2}>এখনই · 🌍</T>
          </View>
        </Row>
        <T size={12.5} style={{ marginTop: 8, lineHeight: 18 }}>🌀 গরমে আরাম — মিনি ফ্যান মাত্র ৳৮৫০! রিচার্জেবল, USB চার্জিং, ১২ ঘণ্টা ব্যাকআপ। মেসেজ দিন অর্ডারের জন্য।</T>
        <View style={{ height: 110, marginTop: 8, borderRadius: 8, backgroundColor: colors.border2, alignItems: 'center', justifyContent: 'center' }}>
          <T size={32}>🌀</T>
        </View>
      </View>
      <Row gap={8} style={{ marginTop: 12 }}>
        <Btn kind="primary" size="sm" label="✅ পোস্ট করো" full style={{ backgroundColor: colors.green }} onPress={onPost} />
        <Btn kind="greyOutline" size="sm" label="👁 দেখি আগে" full onPress={onPeek} />
      </Row>
    </Card>
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

const iconBtnDark = {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: 'rgba(255,255,255,0.08)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};
