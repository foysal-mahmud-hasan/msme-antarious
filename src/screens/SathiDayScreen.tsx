import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Row, SathiBadge, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { colors } from '../theme';

const SLOTS: { t: string; e: string; title: string; sub?: string; items: string[]; hot?: boolean }[] = [
  { t: 'ভোর ৬:০০', e: '🌅', title: 'রাতের সব সামলেছে', items: [
    'রাতের মেসেজের উত্তর দিয়েছি',
    'স্টক লেভেল চেক করেছি',
    'আজকের আবহাওয়া দেখে প্রাসঙ্গিক পণ্য প্রস্তুত করেছি',
  ] },
  { t: 'সকাল ৭:০০', e: '📊', title: 'সাপ্তাহিক পালস', sub: 'রবিবার', items: [
    'সাপ্তাহিক ব্যবসা পালস তৈরি করে পাঠিয়েছি',
    'PKSF রিপোর্ট PO অফিসারকে পাঠিয়েছি',
  ] },
  { t: 'সকাল ৯:০০', e: '📱', title: 'সকালের স্ক্যান', items: [
    'Facebook ও WhatsApp স্ক্যান করেছি',
    'প্রতিযোগীদের নতুন পোস্ট ও দাম চেক করেছি',
    'নতুন লিড ধরেছি ও স্কোর দিয়েছি',
  ] },
  { t: 'দুপুর ১২:০০', e: '📦', title: 'অর্ডার ও কুরিয়ার', items: [
    'সকালের অর্ডারগুলো কুরিয়ারে দিয়েছি',
    'COD কনফার্মেশন কল করেছি',
    'ডেলিভারি স্ট্যাটাস কাস্টমারদের জানিয়েছি',
  ] },
  { t: 'বিকেল ৩:০০', e: '🔍', title: 'বাজার গবেষণা', items: [
    'ট্রেন্ডিং পণ্য স্ক্যান করেছি',
    '1688 ও Alibaba দাম আপডেট করেছি',
    'স্টক রিঅর্ডার দরকার হলে সতর্ক করেছি',
  ] },
  { t: 'সন্ধ্যা ৭:০০', e: '📣', title: 'ব্যস্ততম সময়', hot: true, items: [
    'সন্ধ্যার কাস্টমার পিক হ্যান্ডেল করছি',
    'ফেসবুক পোস্টের এনগেজমেন্ট দেখছি',
    'রাতের অর্ডার ক্যাপচার করছি',
  ] },
  { t: 'রাত ১০:০০', e: '📋', title: 'দিন শেষের হিসাব', items: [
    'আজকের বিক্রির হিসাব সম্পন্ন করেছি',
    'আগামীকালের প্রস্তুতি চেক করেছি',
    'জরুরি বিষয় থাকলে মালিককে নোটিফিকেশন দিয়েছি',
  ] },
  { t: 'রাত ১২:০০', e: '💤', title: 'মালিক ঘুমাচ্ছেন · সাথী জেগে আছে', items: [
    'রাতের মেসেজ সামলাচ্ছি',
    'কাল সকালের জন্য প্রস্তুতি নিচ্ছি',
  ] },
];

export function SathiDayScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#0B1929', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 18 }}>
        <Row gap={10}>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <T weight="b" size={15} color="#fff">সাথীর দিন</T>
          </View>
          <View style={{ width: 40 }} />
        </Row>
        <View style={{ alignItems: 'center', marginTop: 8 }}>
          <T weight="b" size={19} color="#fff" style={{ marginTop: 4 }}>২৪ ঘণ্টা · একদিনের রুটিন</T>
          <T size={12.5} color="rgba(255,255,255,0.8)" style={{ marginTop: 2 }}>আপনি কাজ করেন · ঘুমান · সাথী চলে</T>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, alignItems: 'stretch' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 720 : undefined, alignSelf: 'center', position: 'relative' }}>
          {/* Timeline rail */}
          <View
            style={{
              position: 'absolute',
              left: 50,
              top: 20,
              bottom: 20,
              width: 2,
              backgroundColor: colors.teal,
              opacity: 0.2,
            }}
          />
          {SLOTS.map((s, i) => (
            <Row key={i} gap={12} style={{ marginBottom: 14, alignItems: 'flex-start' }}>
              <View style={{ width: 76, paddingTop: 8, alignItems: 'flex-end' }}>
                <T size={11.5} weight="b" color={colors.ink2}>{s.t}</T>
                {s.sub ? <T size={10} weight="s" color={colors.saffron}>{s.sub}</T> : null}
              </View>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: s.hot ? colors.saffron : colors.tealDark,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: colors.bg,
                  marginTop: 4,
                }}
              >
                <T size={18} color="#fff">{s.e}</T>
              </View>
              <Card
                style={{
                  flex: 1,
                  padding: 12,
                  borderWidth: s.hot ? 2 : 1,
                  borderColor: s.hot ? colors.saffron : colors.border2,
                }}
              >
                <T weight="b" size={14}>{s.title}</T>
                <View style={{ gap: 6, marginTop: 6 }}>
                  {s.items.map((it, j) => (
                    <Row key={j} gap={8} style={{ alignItems: 'flex-start' }}>
                      <SathiBadge size={12} style={{ marginTop: 3 }} />
                      <T size={12.5} color={colors.ink2} style={{ flex: 1, lineHeight: 18 }}>{it}</T>
                    </Row>
                  ))}
                </View>
              </Card>
            </Row>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
