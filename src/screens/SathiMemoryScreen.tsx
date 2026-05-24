import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Row, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { colors } from '../theme';

const KNOWS = [
  { e: '🏷️', l: 'আপনার সব পণ্যের দাম ও স্টক', n: '২৮টি পণ্য ট্র্যাক করছি' },
  { e: '👥', l: 'কোন কাস্টমার কখন কী কিনেছেন', n: '১২৪ জনের ক্রয়ের ইতিহাস' },
  { e: '💬', l: 'কোন মেসেজে আপনি কী উত্তর দিতে পছন্দ করেন', n: '৬৭৮টি কথোপকথন থেকে শিখেছি' },
  { e: '🌦️', l: 'কোন মৌসুমে কোন পণ্য ভালো বিকেছে', n: '১৪ মাসের ঋতু-প্যাটার্ন' },
  { e: '📣', l: 'আপনার সফল ও ব্যর্থ ক্যাম্পেইন', n: '২৩টি ক্যাম্পেইনের রেজাল্ট' },
  { e: '🏭', l: 'কোন সাপ্লায়ার থেকে ভালো পণ্য', n: '৭ জন সাপ্লায়ার রেট করেছি' },
  { e: '🏦', l: 'PKSF ঋণের ইতিহাস ও টার্গেট', n: '২টি ঋণ ট্র্যাকিং · ১টি সফল' },
  { e: '🛒', l: 'আপনার হাটের দিন ও সেরা বিক্রির সময়', n: 'শনিবার দুপুর ১–৩টা সবচেয়ে ব্যস্ত' },
];

export function SathiMemoryScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: colors.tealDark, paddingHorizontal: 14, paddingTop: 6, paddingBottom: 22 }}>
        <Row gap={10}>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <T weight="b" size={15} color="#fff">সাথী জানে</T>
          </View>
          <View style={{ width: 40 }} />
        </Row>
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <T weight="b" size={30} color={colors.tealDark}>স</T>
          </View>
          <T weight="b" size={18} color="#fff" style={{ marginTop: 10 }}>সাথীর স্মৃতি</T>
          <T size={12.5} color="rgba(255,255,255,0.9)" style={{ marginTop: 2 }}>আপনার ব্যবসার ২ মাসের সব তথ্য মনে রেখেছি</T>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, alignItems: 'stretch' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 720 : undefined, alignSelf: 'center' }}>
          <T size={13} color={colors.ink2} style={{ marginBottom: 10, paddingHorizontal: 4 }}>সাথী মনে রাখে:</T>
          <Card style={{ padding: 4 }}>
            {KNOWS.map((k, i) => (
              <Row
                key={i}
                gap={12}
                style={{
                  padding: 12,
                  borderBottomWidth: i < KNOWS.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border2,
                }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.tealSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={20}>{k.e}</T>
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="s" size={13.5} style={{ lineHeight: 18 }}>{k.l}</T>
                  <T size={11.5} weight="s" color={colors.tealDark} style={{ marginTop: 2 }}>{k.n}</T>
                </View>
                <Ionicons name="checkmark" size={18} color={colors.green} />
              </Row>
            ))}
          </Card>

          <Card tinted={colors.greenSoft} style={{ padding: 14, marginTop: 14, alignItems: 'center' }}>
            <T size={14} weight="s" color={colors.green} style={{ fontStyle: 'italic', textAlign: 'center', lineHeight: 22 }}>
              "সাথী যত বেশি সময় কাজ করবে, তত বেশি আপনার ব্যবসা বুঝবে।"
            </T>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
