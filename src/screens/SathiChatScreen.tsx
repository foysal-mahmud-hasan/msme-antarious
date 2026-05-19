import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { colors, fonts } from '../theme';

type Msg = {
  id: string;
  who: 'me' | 'sathi';
  text: string;
  card?: 'order-summary' | 'reorder' | null;
};

const initial: Msg[] = [
  { id: '1', who: 'sathi', text: 'সালামালাইকুম রহিমা আপু! 😊 আজ কেমন আছেন?' },
  { id: '2', who: 'sathi', text: 'আজকের সারসংক্ষেপ দিচ্ছি — ৫টি অর্ডার এসেছে · ৩টি বার্তা অপেক্ষায় · মিনি ফ্যান কম স্টকে।' },
];

const quickPrompts = [
  'আজকের বিক্রি কেমন?',
  'কাকে কত বাকি?',
  'কী রিঅর্ডার করব?',
  'রিপোর্ট তৈরি করো',
];

export function SathiChatScreen({ onClose, prefill }: { onClose: () => void; prefill?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [draft, setDraft] = useState('');
  const scroll = useRef<ScrollView>(null);
  const toast = useToast();

  useEffect(() => {
    scroll.current?.scrollToEnd({ animated: true });
  }, [msgs]);

  useEffect(() => {
    if (prefill && prefill.trim()) {
      const t = setTimeout(() => send(prefill), 220);
      return () => clearTimeout(t);
    }
  }, [prefill]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: 'm' + Date.now(), who: 'me', text };
    setMsgs((m) => [...m, userMsg]);
    setDraft('');
    setTimeout(() => {
      let reply: Msg = { id: 'r' + Date.now(), who: 'sathi', text: 'বুঝেছি, একটু দেখি…' };
      const low = text.toLowerCase();
      if (text.includes('বিক্রি') || low.includes('sale')) {
        reply = {
          id: 'r' + Date.now(),
          who: 'sathi',
          text: 'আজকের বিক্রি ৳২,৪০০ — ৫টি অর্ডার। মিনি ফ্যান সবচেয়ে বেশি বিক্রি হয়েছে।',
          card: 'order-summary',
        };
      } else if (text.includes('বাকি') || text.includes('খাতা')) {
        reply = {
          id: 'r' + Date.now(),
          who: 'sathi',
          text: '৭ জনের কাছে মোট ৳৪,৮৫০ বাকি। রহিম মিয়া সবচেয়ে পুরনো (৩২ দিন)। মনে করিয়ে দিতে SMS পাঠাতে পারি?',
        };
      } else if (text.includes('রিঅর্ডার') || text.includes('স্টক')) {
        reply = {
          id: 'r' + Date.now(),
          who: 'sathi',
          text: 'মিনি ফ্যান (৮টি বাকি) ও ছাতা (৬টি বাকি) রিঅর্ডার দরকার। রহমান ট্রেডার্স থেকে ৳৪৮০-তে পাওয়া যাচ্ছে।',
          card: 'reorder',
        };
      } else if (text.includes('রিপোর্ট')) {
        reply = {
          id: 'r' + Date.now(),
          who: 'sathi',
          text: 'সাপ্তাহিক রিপোর্ট তৈরি করছি — ৩ দিনের মধ্যে PKSF-কে পাঠানো হবে।',
        };
      }
      setMsgs((m) => [...m, reply]);
    }, 900);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable onPress={onClose} hitSlop={6} style={styles.iconBtn}>
            <Ionicons name="chevron-down" size={22} color={colors.ink} />
          </Pressable>
          <SathiBadge size={36} />
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>সাথী</T>
            <Row gap={4}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.green }} />
              <T size={12} color={colors.ink2}>সবসময় শুনছে</T>
            </Row>
          </View>
          <Pressable
            hitSlop={6}
            style={styles.iconBtn}
            onPress={() => {
              setMsgs(initial);
              toast.show('চ্যাট রিসেট করা হয়েছে', 'info');
            }}
          >
            <Ionicons name="refresh" size={18} color={colors.ink} />
          </Pressable>
        </View>

        <ScrollView
          ref={scroll}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 14, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {msgs.map((m) => (
            <View key={m.id} style={{ alignSelf: m.who === 'me' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
              {m.who === 'sathi' ? (
                <Row gap={6} style={{ marginBottom: 4 }}>
                  <SathiBadge size={20} />
                  <T size={11.5} color={colors.tealDark} weight="b">সাথী</T>
                </Row>
              ) : null}
              <View
                style={{
                  backgroundColor: m.who === 'me' ? colors.saffron : '#fff',
                  borderColor: colors.border2,
                  borderWidth: m.who === 'me' ? 0 : 1,
                  borderRadius: 16,
                  borderBottomRightRadius: m.who === 'me' ? 4 : 16,
                  borderBottomLeftRadius: m.who === 'sathi' ? 4 : 16,
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                }}
              >
                <T color={m.who === 'me' ? '#fff' : colors.ink} size={14.5}>
                  {m.text}
                </T>
              </View>
              {m.card === 'order-summary' ? <SummaryCard /> : null}
              {m.card === 'reorder' ? <ReorderCard /> : null}
            </View>
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, gap: 8, paddingBottom: 8 }}>
          {quickPrompts.map((p) => (
            <Pressable key={p} onPress={() => send(p)} style={styles.quick}>
              <T size={12.5} weight="m" color={colors.tealDark}>{p}</T>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.composer}>
          <View style={styles.input}>
            <TextInput
              placeholder="সাথীকে জিজ্ঞেস করুন…"
              placeholderTextColor={colors.ink2}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => send(draft)}
              style={{ flex: 1, fontFamily: fonts.medium, color: colors.ink, paddingVertical: 12 }}
              returnKeyType="send"
            />
            {draft.trim() ? (
              <Pressable onPress={() => send(draft)} style={styles.sendBtn}>
                <Ionicons name="send" size={18} color="#fff" />
              </Pressable>
            ) : (
              <Pressable style={styles.sendBtn}>
                <Ionicons name="mic" size={20} color="#fff" />
              </Pressable>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SummaryCard() {
  return (
    <Card style={{ padding: 14, marginTop: 10 }}>
      <T weight="b" size={13}>আজকের সারাংশ</T>
      <Row style={{ marginTop: 8 }} gap={8}>
        <View style={{ flex: 1 }}>
          <T size={11} color={colors.ink2}>আয়</T>
          <T weight="b" size={16} color={colors.green}>৳২,৪০০</T>
        </View>
        <View style={{ flex: 1 }}>
          <T size={11} color={colors.ink2}>অর্ডার</T>
          <T weight="b" size={16}>৫টি</T>
        </View>
        <View style={{ flex: 1 }}>
          <T size={11} color={colors.ink2}>সেরা পণ্য</T>
          <T weight="b" size={13}>মিনি ফ্যান</T>
        </View>
      </Row>
    </Card>
  );
}

function ReorderCard() {
  return (
    <Card style={{ padding: 14, marginTop: 10 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <T weight="b" size={13}>রিঅর্ডার সুপারিশ</T>
        <Chip kind="amber" size={10}>২টি</Chip>
      </Row>
      <Row gap={10} style={{ marginTop: 10 }}>
        <T size={22}>🌀</T>
        <View style={{ flex: 1 }}>
          <T weight="s" size={13}>মিনি ফ্যান</T>
          <T size={11} color={colors.ink2}>রহমান ট্রেডার্স · ৳৪৮০ × ২০ টি</T>
        </View>
        <T weight="b" size={13}>৳৯,৬০০</T>
      </Row>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
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
  quick: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: colors.tealSoft,
    borderWidth: 1,
    borderColor: 'rgba(46,196,182,0.3)',
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
    gap: 4,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
