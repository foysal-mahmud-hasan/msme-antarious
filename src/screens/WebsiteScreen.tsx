import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { useToast } from '../components/Toast';
import { colors } from '../theme';

type Template = {
  id: number;
  name: string;
  bg: string;
  accent: string;
  text: string;
  popular?: boolean;
  darkAccent?: boolean;
};

const TEMPLATES: Template[] = [
  { id: 0, name: 'মিনিমাল', bg: '#FAF8F4', accent: '#1A1A2E', text: '#1A1A2E' },
  { id: 1, name: 'উষ্ণ মাটি', popular: true, bg: '#FAF8F4', accent: colors.saffron, text: '#1A1A2E' },
  { id: 2, name: 'সবুজ', bg: '#f0f8f0', accent: colors.green, text: '#1A1A2E' },
  { id: 3, name: 'বোল্ড ডার্ক', bg: '#0f172a', accent: '#fbbf24', text: '#f9fafb', darkAccent: true },
  { id: 4, name: 'প্যাস্টেল', bg: '#fef3c7', accent: '#7c2d12', text: '#1A1A2E' },
  { id: 5, name: 'মার্কেট', bg: '#fff', accent: colors.coral, text: '#1A1A2E' },
];

function TemplatePreview({ t, large }: { t: Template; large: boolean }) {
  const padX = large ? 16 : 9;
  const padY = large ? 14 : 7;
  return (
    <View style={{ backgroundColor: t.bg, flex: 1, overflow: 'hidden' }}>
      <View style={{ paddingHorizontal: padX, paddingVertical: padY, flexDirection: 'row', alignItems: 'center', borderBottomColor: t.accent + '22', borderBottomWidth: 1 }}>
        <View style={{ width: large ? 24 : 12, height: large ? 24 : 12, borderRadius: large ? 6 : 3, backgroundColor: t.accent, marginRight: large ? 8 : 4 }} />
        <T weight="b" size={large ? 14 : 7} color={t.text}>রহিমা স্টোর</T>
        <View style={{ flex: 1 }} />
        <Row gap={large ? 10 : 5}>
          {['হোম', 'পণ্য', 'যোগাযোগ'].map((n) => (
            <T key={n} size={large ? 9.5 : 5} color={t.text} style={{ opacity: 0.7 }}>{n}</T>
          ))}
        </Row>
      </View>

      <View style={{ flex: 1, paddingHorizontal: padX, paddingVertical: large ? 24 : 12, justifyContent: 'center' }}>
        <T weight="b" size={large ? 22 : 11} color={t.text} style={{ lineHeight: large ? 26 : 13 }}>
          মাটি থেকে{'\n'}
          <T weight="b" size={large ? 22 : 11} color={t.accent}>মানুষ পর্যন্ত</T>
        </T>
        <T size={large ? 11 : 5.5} color={t.text} style={{ opacity: 0.7, marginTop: large ? 8 : 4, lineHeight: large ? 16 : 8 }}>
          আমাদের নিজস্ব কারিগরের হাতে তৈরি · বাংলাদেশের সবচেয়ে বিশ্বস্ত
        </T>
        <Row gap={large ? 6 : 3} style={{ marginTop: large ? 14 : 6 }}>
          <View style={{ paddingHorizontal: large ? 14 : 7, paddingVertical: large ? 7 : 3, backgroundColor: t.accent, borderRadius: large ? 8 : 3 }}>
            <T weight="b" size={large ? 11 : 5.5} color={t.darkAccent ? t.text : '#fff'}>অর্ডার দিন</T>
          </View>
          <View style={{ paddingHorizontal: large ? 14 : 7, paddingVertical: large ? 7 : 3, borderColor: t.accent, borderWidth: large ? 1.5 : 1, borderRadius: large ? 8 : 3 }}>
            <T weight="s" size={large ? 11 : 5.5} color={t.accent}>আরও দেখুন</T>
          </View>
        </Row>
      </View>

      <View style={{ paddingHorizontal: padX, paddingBottom: padY }}>
        <Row gap={large ? 7 : 3}>
          {['🌀', '🧴', '📦'].map((e) => (
            <View
              key={e}
              style={{
                flex: 1,
                aspectRatio: 1,
                backgroundColor: t.darkAccent ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                borderRadius: large ? 8 : 3,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <T size={large ? 24 : 12}>{e}</T>
            </View>
          ))}
        </Row>
      </View>
    </View>
  );
}

export function WebsiteScreen({ onClose, locked = true }: { onClose: () => void; locked?: boolean }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const [sel, setSel] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);

  if (previewMode) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1f2937' }}>
        <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 10 }}>
          <Row gap={10}>
            <Pressable onPress={() => setPreviewMode(false)} hitSlop={8} style={iconBtn}>
              <Ionicons name="arrow-back" size={20} color={colors.ink} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <T weight="b" size={14}>{TEMPLATES[sel].name} প্রিভিউ</T>
              <T size={11} color={colors.ink2}>রহিমা-স্টোর.কম</T>
            </View>
            <Btn kind="primary" size="sm" label="প্রকাশ করুন" onPress={() => toast.show('Premium-এ আপগ্রেড করুন →', 'info')} />
          </Row>
        </View>
        <View style={{ flex: 1, padding: 14, backgroundColor: '#1f2937' }}>
          <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden' }}>
            <TemplatePreview t={TEMPLATES[sel]} large />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 12, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>ওয়েবসাইট</T>
            <T size={12} color={colors.ink2}>একটা টেমপ্লেট বেছে নিন · সাথী বানিয়ে দেবে</T>
          </View>
          {locked && <Chip kind="saffron">🔒 Premium</Chip>}
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40, alignItems: 'stretch' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 720 : undefined, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 14 }}>
          {locked && (
            <Card style={{ padding: 14, backgroundColor: '#1A1A2E', borderColor: 'transparent', marginBottom: 14 }}>
              <Row gap={10}>
                <T size={28}>✨</T>
                <View style={{ flex: 1 }}>
                  <T weight="b" size={14} color="#fff">Premium ফিচার</T>
                  <T size={12} color="rgba(255,255,255,0.85)" style={{ marginTop: 1 }}>৯৯৯ টাকা/মাস — সব টেমপ্লেট আনলক</T>
                </View>
                <Btn kind="primary" size="sm" label="আপগ্রেড" onPress={() => toast.show('Pricing স্ক্রিনে যান →', 'info')} />
              </Row>
            </Card>
          )}

          <Card tinted={colors.tealSoft} style={{ padding: 12, marginBottom: 14 }}>
            <Row gap={8}>
              <SathiBadge />
              <T size={13} color={colors.tealDark} style={{ flex: 1 }}>
                আপনার পণ্য, ছবি, যোগাযোগ — সব আমি স্বয়ংক্রিয় বসিয়ে দেব। শুধু টেমপ্লেট বেছে দিন।
              </T>
            </Row>
          </Card>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 }}>
            {TEMPLATES.map((t) => (
              <View key={t.id} style={{ width: '50%', padding: 6 }}>
                <Pressable onPress={() => setSel(t.id)}>
                  <View
                    style={{
                      borderRadius: 14,
                      overflow: 'hidden',
                      borderWidth: t.id === sel ? 2.5 : 1,
                      borderColor: t.id === sel ? colors.saffron : colors.border2,
                      backgroundColor: '#fff',
                    }}
                  >
                    <View style={{ height: 180 }}>
                      <TemplatePreview t={t} large={false} />
                    </View>
                    <View style={{ padding: 10, borderTopColor: colors.border2, borderTopWidth: 1, backgroundColor: '#fff' }}>
                      <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <T weight="b" size={12.5}>{t.name}</T>
                        {t.popular && <Chip kind="saffron" size={10}>জনপ্রিয়</Chip>}
                      </Row>
                    </View>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>

          <Row gap={8} style={{ marginTop: 18 }}>
            <Btn kind="greyOutline" label="👁 প্রিভিউ" full onPress={() => setPreviewMode(true)} />
            <Btn
              kind="primary"
              label="এই টেমপ্লেট চাই"
              full
              disabled={locked}
              onPress={() => toast.show('সাথী আপনার ওয়েবসাইট তৈরি করছে…', 'success')}
            />
          </Row>
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
