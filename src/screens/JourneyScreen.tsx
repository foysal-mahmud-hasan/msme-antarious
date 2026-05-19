import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { ScreenScroll } from '../components/ScreenContainer';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { colors } from '../theme';

const steps = [
  { n: 1, t: 'হিসাব লেখা শুরু', d: 'নিয়মিত বিক্রি লিখুন', done: true, e: '📒' },
  { n: 2, t: 'পণ্যের ছবি তুলুন', d: 'অন্তত ১০টি পণ্যের পরিষ্কার ছবি', done: false, current: true, e: '📷' },
  { n: 3, t: 'Facebook পেজ খুলুন', d: 'সাথী আপনাকে সাহায্য করবে', done: false, e: '📘' },
  { n: 4, t: 'WhatsApp Business', d: 'অর্ডার নিন · প্রোডাক্ট ক্যাটালগ', done: false, e: '💬' },
  { n: 5, t: 'অর্ডার ম্যানেজমেন্ট', d: 'Pathao / Steadfast সংযোগ', done: false, e: '🚚' },
  { n: 6, t: 'Daraz / অনলাইন মার্কেটপ্লেস', d: 'বড় বাজারে যান', done: false, e: '🛒' },
];

export function JourneyScreen({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const actions = useActions();
  const [completed, setCompleted] = useState(1);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>ডিজিটাল যাত্রা</T>
            <T size={12} color={colors.ink2}>ধাপে ধাপে অনলাইনে যান</T>
          </View>
          <Chip kind="teal" size={11}>{completed} / ৬</Chip>
        </Row>
      </View>

      <ScreenScroll>
        <Card tinted={colors.tealSoft} style={{ padding: 16, marginBottom: 14 }}>
          <Row gap={8}>
            <SathiBadge />
            <T weight="b" size={14}>সাথীর সাহায্য</T>
          </Row>
          <T size={14} style={{ marginTop: 8, lineHeight: 20 }}>
            ছোট ছোট ধাপে আপনার ব্যবসাকে অনলাইনে নিয়ে যাব। প্রতিটি ধাপে আমি আপনাকে গাইড করব।
          </T>
          <View style={{ height: 10, backgroundColor: '#e4f4f1', borderRadius: 5, marginTop: 14, overflow: 'hidden' }}>
            <View style={{ width: '17%', height: '100%', backgroundColor: colors.tealDark, borderRadius: 5 }} />
          </View>
        </Card>

        {steps.map((s, i) => (
          <Row key={s.n} gap={12} style={{ marginBottom: 12, alignItems: 'flex-start' }}>
            <View style={{ alignItems: 'center', paddingTop: 4 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: s.done ? colors.green : s.current ? colors.tealDark : '#fff',
                  borderWidth: s.done || s.current ? 0 : 1.5,
                  borderColor: colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {s.done ? <Ionicons name="checkmark" size={20} color="#fff" /> : <T weight="b" color={s.current ? '#fff' : colors.ink2}>{s.n}</T>}
              </View>
              {i < steps.length - 1 ? (
                <View style={{ width: 2, flex: 1, backgroundColor: s.done ? colors.green : colors.border2, marginTop: 4, minHeight: 30 }} />
              ) : null}
            </View>
            <Card style={{ flex: 1, padding: 14, opacity: s.done || s.current ? 1 : 0.6, borderColor: s.current ? colors.teal : colors.border2, borderWidth: s.current ? 2 : 1 }}>
              <Row gap={8}>
                <T size={22}>{s.e}</T>
                <View style={{ flex: 1 }}>
                  <T weight="b" size={14.5}>{s.t}</T>
                  <T size={12.5} color={colors.ink2}>{s.d}</T>
                </View>
                {s.done ? <Chip kind="green" size={10}>সম্পন্ন</Chip> : s.current ? <Chip kind="teal" size={10}>চলমান</Chip> : null}
              </Row>
              {s.current ? (
                <Btn
                  kind="teal"
                  label="এখন শুরু করুন"
                  full
                  size="sm"
                  style={{ marginTop: 12 }}
                  iconRight={<Ionicons name="arrow-forward" size={14} color="#fff" />}
                  onPress={() => {
                    toast.show(`"${s.t}" — সাথী আপনাকে গাইড করছে`, 'success');
                    actions.openOverlay('sathi', `${s.t} শুরু করতে চাই`);
                  }}
                />
              ) : null}
            </Card>
          </Row>
        ))}
      </ScreenScroll>
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
