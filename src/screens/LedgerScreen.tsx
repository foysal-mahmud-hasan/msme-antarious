import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { ScreenScroll } from '../components/ScreenContainer';
import { colors } from '../theme';

const debts = [
  { n: 'রহিম মিয়া', amount: 1200, days: 32, phone: 'হোয়াটসঅ্যাপ', color: '#ffb077', avatar: 'র', kind: 'coral' as const },
  { n: 'নাজমা পারভীন', amount: 850, days: 14, phone: 'কল', color: '#f6a8b1', avatar: 'ন', kind: 'amber' as const },
  { n: 'আবুল হোসেন', amount: 1400, days: 8, phone: 'হোয়াটসঅ্যাপ', color: '#a8d4ff', avatar: 'আ', kind: 'green' as const },
  { n: 'সাকিব হাসান', amount: 600, days: 21, phone: 'কল', color: '#c6b8f0', avatar: 'স', kind: 'amber' as const },
  { n: 'হাসিনা বেগম', amount: 480, days: 4, phone: 'হোয়াটসঅ্যাপ', color: '#ffd28a', avatar: 'হ', kind: 'green' as const },
  { n: 'মুনির খান', amount: 220, days: 17, phone: 'কল', color: '#b0e6c5', avatar: 'ম', kind: 'amber' as const },
  { n: 'সুমাইয়া আক্তার', amount: 100, days: 2, phone: 'হোয়াটসঅ্যাপ', color: '#ffd0d0', avatar: 'সু', kind: 'green' as const },
];

export function LedgerScreen({ onClose }: { onClose: () => void }) {
  const total = debts.reduce((s, d) => s + d.amount, 0);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>কাস্টমার খাতা</T>
            <T size={12} color={colors.ink2}>মোট বাকি: {debts.length} জন</T>
          </View>
          <T weight="b" size={20} color={colors.coral}>৳{total.toLocaleString('bn-BD')}</T>
        </Row>
      </View>

      <ScreenScroll>
        <Card tinted={colors.coralSoft} style={{ padding: 14, marginBottom: 14 }}>
          <Row gap={8}>
            <SathiBadge />
            <T weight="b" size={14}>সাথীর সতর্কতা</T>
          </Row>
          <T size={14} style={{ marginTop: 6, lineHeight: 20 }}>
            <T weight="b">রহিম মিয়া</T> ৩২ দিন ধরে বাকি — মনে করিয়ে দিতে পারেন।
          </T>
          <Btn kind="coral" label="রহিম মিয়াকে SMS পাঠান" full size="sm" style={{ marginTop: 12 }} />
        </Card>

        <Card style={{ padding: 4 }}>
          {debts.map((d, i) => (
            <Row
              key={d.n}
              gap={12}
              style={{
                padding: 14,
                borderTopWidth: i ? 1 : 0,
                borderTopColor: colors.border2,
              }}
            >
              <Avatar text={d.avatar} bg={d.color} color={colors.ink} />
              <View style={{ flex: 1 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <T weight="b" size={14.5}>{d.n}</T>
                  <T weight="b" size={14.5} color={d.kind === 'coral' ? colors.coral : d.kind === 'amber' ? colors.amber : colors.green}>
                    ৳{d.amount.toLocaleString('bn-BD')}
                  </T>
                </Row>
                <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
                  <T size={12} color={colors.ink2}>{d.days} দিন · {d.phone}</T>
                  <Chip kind={d.kind} size={10}>{d.kind === 'coral' ? 'জরুরি' : d.kind === 'amber' ? 'খেয়াল রাখুন' : 'সাম্প্রতিক'}</Chip>
                </Row>
              </View>
            </Row>
          ))}
        </Card>

        <Btn kind="greyOutline" label="নতুন বাকি যোগ করুন" full style={{ marginTop: 14 }} iconLeft={<Ionicons name="add" size={16} color={colors.ink2} />} />
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
