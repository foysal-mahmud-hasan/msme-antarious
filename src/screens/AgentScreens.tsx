import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card, Chip, PulseDot, Row, SathiBadge, T } from '../components/atoms';
import { colors } from '../theme';

export function AgentLiveScreen({
  onClose,
  onOpenAutopilot,
  onOpenApprovals,
}: {
  onClose: () => void;
  onOpenAutopilot: () => void;
  onOpenApprovals: () => void;
}) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable onPress={onClose} hitSlop={6} style={iconBtnDark}>
          <Ionicons name="chevron-down" size={22} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <T weight="b" color="#fff" size={16}>সাথী লাইভ</T>
          <T size={12} color="#94a3b8">কমান্ড সেন্টার</T>
        </View>
        <Pressable onPress={onOpenAutopilot} style={iconBtnDark} hitSlop={6}>
          <Ionicons name="options-outline" size={20} color="#fff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60, alignItems: 'stretch' }}>
        <View style={{ width: '100%', maxWidth: 560, alignSelf: 'center' }}>
        <View style={{ alignItems: 'center', paddingVertical: 22 }}>
          <View style={{ width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(46,196,182,0.16)', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(46,196,182,0.3)', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 68, height: 68, borderRadius: 34, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center' }}>
                <T weight="b" color="#fff" size={28}>স</T>
              </View>
            </View>
          </View>
          <Row gap={6} style={{ marginTop: 14 }}>
            <PulseDot color={colors.green} />
            <T weight="b" color="#86efac" size={13}>সাথী কাজ করছে</T>
          </Row>
          <T size={12} color="#94a3b8" style={{ marginTop: 4 }}>২৪ ঘ × ৭ দিন · এখন: কাস্টমার বার্তা পর্যবেক্ষণ</T>
        </View>

        <T weight="b" color="#fff" size={14} style={{ marginBottom: 8 }}>এই মুহূর্তে</T>
        <Card style={{ padding: 14, backgroundColor: '#1e293b', borderColor: '#334155', marginBottom: 8 }}>
          <Row gap={8}>
            <PulseDot color={colors.teal} />
            <T weight="b" color="#fff" size={13}>৩টি বার্তার খসড়া তৈরি</T>
          </Row>
          <T size={12} color="#94a3b8" style={{ marginTop: 4 }}>আপনার অনুমোদনের অপেক্ষায়</T>
          <Btn kind="teal" label="অনুমোদন দেখুন" full size="sm" style={{ marginTop: 10 }} onPress={onOpenApprovals} />
        </Card>
        <Card style={{ padding: 14, backgroundColor: '#1e293b', borderColor: '#334155', marginBottom: 8 }}>
          <Row gap={8}>
            <Ionicons name="checkmark-circle" size={16} color={colors.green} />
            <T weight="b" color="#fff" size={13}>২টি অর্ডার নিশ্চিত করা হয়েছে</T>
          </Row>
          <T size={12} color="#94a3b8" style={{ marginTop: 4 }}>৬ মিনিট আগে · Pathao পিকআপ অনুরোধ পাঠানো হয়েছে</T>
        </Card>
        <Card style={{ padding: 14, backgroundColor: '#1e293b', borderColor: '#334155', marginBottom: 8 }}>
          <Row gap={8}>
            <Ionicons name="trending-up" size={16} color={colors.saffron} />
            <T weight="b" color="#fff" size={13}>বাজার পর্যবেক্ষণ</T>
          </Row>
          <T size={12} color="#94a3b8" style={{ marginTop: 4 }}>মিনি ফ্যানের চাহিদা +৪৭% — সুযোগ চিহ্নিত</T>
        </Card>

        <T weight="b" color="#fff" size={14} style={{ marginTop: 18, marginBottom: 8 }}>আজকের অর্জন</T>
        <Row gap={8}>
          <Card style={{ padding: 14, flex: 1, backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <T size={11} color="#94a3b8">বার্তা সামলেছে</T>
            <T weight="b" size={22} color="#fff">২৪</T>
          </Card>
          <Card style={{ padding: 14, flex: 1, backgroundColor: '#1e293b', borderColor: '#334155' }}>
            <T size={11} color="#94a3b8">সময় বাঁচানো</T>
            <T weight="b" size={22} color={colors.teal}>২.৫ ঘ</T>
          </Card>
        </Row>

        <Btn kind="greyOutline" label="অটোপাইলট সেটিংস" full style={{ marginTop: 18, backgroundColor: '#1e293b', borderColor: '#334155' }} onPress={onOpenAutopilot} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function AutopilotScreen({ onClose }: { onClose: () => void }) {
  const [auto, setAuto] = useState({ orders: true, messages: false, restock: false, market: true });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
        <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <T weight="b" size={16}>অটোপাইলট</T>
          <T size={12} color={colors.ink2}>সাথী কী কী একা করতে পারবে</T>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60, alignItems: 'stretch' }}>
        <View style={{ width: '100%', maxWidth: 560, alignSelf: 'center' }}>
        <Card tinted={colors.tealSoft} style={{ padding: 14, marginBottom: 14 }}>
          <Row gap={8}>
            <SathiBadge />
            <T weight="b" size={14}>বিশ্বাস স্তর: ২য় ধাপ</T>
          </Row>
          <T size={13.5} color={colors.ink2} style={{ marginTop: 6 }}>
            সাথী এখন কিছু সিদ্ধান্ত একা নিতে পারে। আপনি প্রতিটি ধাপে নিয়ন্ত্রণ রাখেন।
          </T>
        </Card>

        {[
          { key: 'orders' as const, t: 'অর্ডার নিশ্চিতকরণ', d: '৳২,০০০ পর্যন্ত স্বয়ংক্রিয়', e: '📦' },
          { key: 'messages' as const, t: 'কাস্টমার বার্তার উত্তর', d: 'প্রতিটি উত্তরের আগে অনুমোদন', e: '💬' },
          { key: 'restock' as const, t: 'রিঅর্ডার অর্ডার দেওয়া', d: 'আপনার অনুমোদন লাগবে', e: '🔄' },
          { key: 'market' as const, t: 'বাজার পর্যবেক্ষণ', d: '২৪/৭ স্বয়ংক্রিয়', e: '📈' },
        ].map((it) => (
          <Card key={it.key} style={{ padding: 14, marginBottom: 10 }}>
            <Row gap={12}>
              <T size={26}>{it.e}</T>
              <View style={{ flex: 1 }}>
                <T weight="b" size={14}>{it.t}</T>
                <T size={12.5} color={colors.ink2}>{it.d}</T>
              </View>
              <Switch
                value={auto[it.key]}
                onValueChange={(v) => setAuto((a) => ({ ...a, [it.key]: v }))}
                trackColor={{ true: colors.tealDark, false: '#cbd5e1' }}
                thumbColor="#fff"
              />
            </Row>
          </Card>
        ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function ApprovalsScreen({ onClose }: { onClose: () => void }) {
  const [pending, setPending] = useState([
    { id: 1, who: 'করিম সাহেব', what: '১০ পিসে ৫% ছাড় দেওয়া', kind: 'amber' as const, time: '৩ মি' },
    { id: 2, who: 'সুমাইয়া আক্তার', what: 'অভিযোগের উত্তর পাঠানো', kind: 'coral' as const, time: '১২ মি' },
    { id: 3, who: 'রহমান ট্রেডার্স', what: 'রিঅর্ডার ৳৯,৬০০', kind: 'teal' as const, time: '২২ মি' },
  ]);
  const approve = (id: number) => setPending((p) => p.filter((x) => x.id !== id));
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
        <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <T weight="b" size={16}>অনুমোদন কেন্দ্র</T>
          <T size={12} color={colors.ink2}>{pending.length}টি অপেক্ষমান</T>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60, alignItems: 'stretch' }}>
        <View style={{ width: '100%', maxWidth: 560, alignSelf: 'center' }}>
        {pending.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.greenSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="checkmark-done" size={36} color={colors.green} />
            </View>
            <T weight="b" size={18} style={{ marginTop: 16 }}>সব ক্লিয়ার!</T>
            <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>আপাতত অনুমোদনের অপেক্ষায় কিছু নেই</T>
          </View>
        ) : (
          pending.map((p) => (
            <Card key={p.id} style={{ padding: 16, marginBottom: 10 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Chip kind={p.kind} size={11}>{p.kind === 'coral' ? 'অভিযোগ' : p.kind === 'amber' ? 'মূল্য' : 'অর্ডার'}</Chip>
                <T size={11} color={colors.ink2}>{p.time}</T>
              </Row>
              <T weight="b" size={15} style={{ marginTop: 8 }}>{p.what}</T>
              <T size={13} color={colors.ink2} style={{ marginTop: 2 }}>পক্ষে: {p.who}</T>
              <Row gap={8} style={{ marginTop: 12 }}>
                <Btn kind="teal" label="অনুমোদন" size="sm" full style={{ flex: 1 }} onPress={() => approve(p.id)} iconRight={<Ionicons name="checkmark" size={14} color="#fff" />} />
                <Btn kind="greyOutline" label="সম্পাদনা" size="sm" />
                <Btn kind="coralOutline" label="বাতিল" size="sm" onPress={() => approve(p.id)} />
              </Row>
            </Card>
          ))
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  backgroundColor: '#1e293b',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};
