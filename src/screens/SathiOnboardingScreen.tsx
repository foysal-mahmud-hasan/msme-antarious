import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Row, SathiBadge, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { colors, fonts, radius } from '../theme';

const BIZ_OPTIONS = [
  { e: '🛍️', l: 'কাপড় ও পোশাক' },
  { e: '🍳', l: 'খাবার' },
  { e: '💄', l: 'সৌন্দর্য' },
  { e: '📱', l: 'ইলেকট্রনিক্স' },
  { e: '🏠', l: 'গৃহস্থালি' },
  { e: '🛒', l: 'মুদি দোকান' },
  { e: '✂️', l: 'হস্তশিল্প' },
  { e: '➕', l: 'অন্য' },
];

const PLACE_OPTIONS = [
  { e: '🏪', l: 'দোকান আছে' },
  { e: '🛒', l: 'হাট/বাজারে' },
  { e: '🏠', l: 'বাড়ি থেকে' },
  { e: '📱', l: 'অনলাইনে (FB/WA)' },
];

const LOGO_TILES: { bg: string; dark?: boolean }[] = [
  { bg: colors.saffron },
  { bg: colors.green },
  { bg: colors.teal },
  { bg: '#8B5CF6' },
  { bg: colors.coral },
  { bg: '#1A1A2E' },
  { bg: '#1A1A2E' },
  { bg: '#FAF8F4', dark: true },
  { bg: '#fbbf24' },
];

const CHANNELS = [
  { k: 'fb', e: '📘', l: 'Facebook পেজ', sub: 'মেসেজ + পোস্ট + অর্ডার' },
  { k: 'wa', e: '💬', l: 'WhatsApp Business', sub: 'কাস্টমারের সাথে কথা' },
  { k: 'daraz', e: '🛒', l: 'Daraz', sub: 'অনলাইন বিক্রি' },
  { k: 'shop', e: '🏪', l: 'দোকান/হাট', sub: 'নগদ ও বাকি হিসাব' },
] as const;

const STEP_LABELS = [
  { t: 'পরিচয়', s: 'আপনাকে চিনি' },
  { t: 'ব্যবসা', s: 'কী করেন' },
  { t: 'ব্র্যান্ড', s: 'নাম + লোগো' },
  { t: 'চ্যানেল', s: 'কোথায় বেচেন' },
  { t: 'প্রস্তুত!', s: 'শুরু করি' },
];

type ChatMessage = { from: 'sathi' | 'user'; text: string };

export function SathiOnboardingScreen({
  defaultName,
  onFinish,
  onSkip,
}: {
  defaultName?: string;
  onFinish: (payload: { brandName: string; logoIdx: number; channels: Record<string, boolean> }) => void;
  onSkip?: () => void;
}) {
  const { isDesktop } = useResponsive();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(defaultName ?? '');
  const [biz, setBiz] = useState('');
  const [place, setPlace] = useState('');
  const [brandName, setBrandName] = useState('');
  const [logoIdx, setLogoIdx] = useState(2);
  const [channels, setChannels] = useState<Record<string, boolean>>({ fb: true, wa: true, daraz: false, shop: true });
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
    return () => clearTimeout(t);
  }, [step]);

  const log: ChatMessage[] = [];
  log.push({ from: 'sathi', text: 'আসসালামু আলাইকুম! আমি সাথী 🤝 আপনার ব্যবসার সঙ্গী।' });
  log.push({ from: 'sathi', text: 'আমি আপনার হিসাব রাখব, ব্যবসা পরিচালনায় সাহায্য করব, এবং ক্রেডিট স্কোর তৈরি করব যাতে ঋণ পাওয়া সহজ হয়।' });
  if (step === 1) log.push({ from: 'sathi', text: 'প্রথমে আপনার নাম বলুন তো?' });
  if (step >= 2) {
    log.push({ from: 'user', text: name });
    log.push({ from: 'sathi', text: `${name.split(' ')[0] || 'আপনি'}, কেমন আছেন! 😊 আপনি কী ধরনের ব্যবসা করেন?` });
  }
  if (step >= 3) {
    log.push({ from: 'user', text: biz });
    log.push({ from: 'sathi', text: 'চমৎকার! আপনি কোথায় বেচেন?' });
  }
  if (step >= 4) {
    log.push({ from: 'user', text: place });
    log.push({ from: 'sathi', text: 'এবার আপনার দোকান/ব্যবসার একটা নাম দিই — আর একটা সুন্দর লোগো বানিয়ে দিই।' });
  }
  if (step >= 5) {
    log.push({ from: 'user', text: `${brandName} · লোগো নির্বাচন ✓` });
    log.push({ from: 'sathi', text: 'অসাধারণ! শেষ ধাপ — আপনি কোথায় কোথায় বিক্রি করেন? আমি ওই সব জায়গা যুক্ত করে দেব।' });
  }

  const canProceed1 = name.trim().length > 0;
  const canProceed4 = brandName.trim().length > 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Brand strip */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 6,
          paddingBottom: 12,
          backgroundColor: '#fff',
          borderBottomColor: colors.border2,
          borderBottomWidth: 1,
        }}
      >
        <Row gap={12}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              backgroundColor: colors.saffron,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <T weight="b" color="#fff" size={18}>আ</T>
          </View>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>আরোপণ</T>
            <T size={11} color={colors.ink2}>সাথী আপনাকে সেট আপ করছে…</T>
          </View>
          <Row gap={6} style={{ paddingHorizontal: 8, paddingVertical: 4, backgroundColor: colors.tealSoft, borderRadius: 999 }}>
            <SathiBadge size={16} />
            <T weight="b" size={11} color={colors.tealDark}>সাথী</T>
          </Row>
        </Row>
      </View>

      {/* Step pills */}
      <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 4, backgroundColor: '#fff' }}>
        <Row gap={4}>
          {STEP_LABELS.map((_, i) => (
            <View
              key={i}
              style={{
                flex: i + 1 <= step ? 1.4 : 1,
                height: 5,
                borderRadius: 3,
                backgroundColor: i + 1 <= step ? colors.saffron : '#ece6da',
              }}
            />
          ))}
        </Row>
      </View>
      <Row
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 6,
          paddingBottom: 12,
          backgroundColor: '#fff',
        }}
      >
        <View>
          <T weight="b" size={13}>{STEP_LABELS[step - 1].t}</T>
          <T size={11} color={colors.ink2}>
            {step}/{STEP_LABELS.length} · {STEP_LABELS[step - 1].s}
          </T>
        </View>
        {onSkip && (
          <Pressable onPress={onSkip} hitSlop={8} style={{ paddingHorizontal: 8, paddingVertical: 4 }}>
            <T weight="b" size={12} color={colors.ink2}>এড়িয়ে যান →</T>
          </Pressable>
        )}
      </Row>

      {/* Chat log */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 14,
          paddingTop: 14,
          paddingBottom: 16,
          gap: 10,
          alignSelf: 'center',
          width: '100%',
          maxWidth: isDesktop ? 560 : undefined,
        }}
      >
        {log.map((m, i) => (
          <Bubble key={i} from={m.from} text={m.text} />
        ))}

        {step === 4 && (
          <View style={{ marginTop: 6, padding: 14, backgroundColor: '#fff', borderRadius: 14, borderColor: colors.border2, borderWidth: 1 }}>
            <T size={11} weight="b" color={colors.ink2}>আপনার ব্র্যান্ডের নাম</T>
            <TextInput
              value={brandName}
              onChangeText={setBrandName}
              placeholder="দোকানের নাম"
              placeholderTextColor={colors.ink2}
              style={{
                marginTop: 8,
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontFamily: fonts.semibold,
                fontSize: 15,
                color: colors.ink,
                backgroundColor: colors.bg,
              }}
            />
            <T size={11} weight="b" color={colors.ink2} style={{ marginTop: 14, marginBottom: 8 }}>
              একটা লোগো বেছে নিন — যেকোনো সময় বদলাতে পারবেন
            </T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginVertical: -4 }}>
              {LOGO_TILES.map((lg, i) => (
                <Pressable
                  key={i}
                  onPress={() => setLogoIdx(i)}
                  style={{ width: '33.333%', padding: 4 }}
                >
                  <View
                    style={{
                      aspectRatio: 1,
                      borderRadius: 12,
                      backgroundColor: lg.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: i === logoIdx ? 3 : 1,
                      borderColor: i === logoIdx ? colors.saffron : colors.border2,
                    }}
                  >
                    <T weight="b" size={24} color={lg.dark ? '#1A1A2E' : '#fff'}>
                      {(brandName.trim()[0] || 'আ').toUpperCase()}
                    </T>
                  </View>
                </Pressable>
              ))}
            </View>
            <Row gap={6} style={{ marginTop: 10, alignItems: 'center' }}>
              <SathiBadge size={14} />
              <T size={11} color={colors.ink2} style={{ flex: 1 }}>
                লোগোটা ফেসবুক পোস্ট, WhatsApp DP, প্যাকেজিং — সব জায়গায় ব্যবহার করব
              </T>
            </Row>
          </View>
        )}

        {step === 5 && (
          <View style={{ marginTop: 6, padding: 12, backgroundColor: '#fff', borderRadius: 14, borderColor: colors.border2, borderWidth: 1, gap: 6 }}>
            {CHANNELS.map((c) => {
              const on = channels[c.k];
              return (
                <Pressable
                  key={c.k}
                  onPress={() => setChannels((s) => ({ ...s, [c.k]: !s[c.k] }))}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderRadius: 12,
                    backgroundColor: on ? colors.saffronSoft : 'transparent',
                    borderWidth: 1.5,
                    borderColor: on ? colors.saffron : colors.border2,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <T size={18}>{c.e}</T>
                  </View>
                  <View style={{ flex: 1 }}>
                    <T weight="b" size={14}>{c.l}</T>
                    <T size={11.5} color={colors.ink2}>{c.sub}</T>
                  </View>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: on ? colors.saffron : 'transparent',
                      borderWidth: on ? 0 : 2,
                      borderColor: colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {on && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                </Pressable>
              );
            })}
            <T size={11} color={colors.ink2} style={{ marginTop: 4, paddingHorizontal: 4 }}>
              পরে আরও যোগ করতে পারবেন। যেগুলো নেই, সাথী তৈরি করে দেবে।
            </T>
          </View>
        )}
      </ScrollView>

      {/* Step input bar */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 12,
          paddingBottom: 18,
          backgroundColor: '#fff',
          borderTopColor: colors.border2,
          borderTopWidth: 1,
          alignItems: 'stretch',
        }}
      >
        <View style={{ width: '100%', maxWidth: isDesktop ? 560 : undefined, alignSelf: 'center' }}>
          {step === 1 && (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: colors.bg,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border2,
                  paddingHorizontal: 12,
                }}
              >
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="আপনার নাম লিখুন…"
                  placeholderTextColor={colors.ink2}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    fontFamily: fonts.semibold,
                    fontSize: 15,
                    color: colors.ink,
                  }}
                />
              </View>
              <Btn
                kind="primary"
                label="পরবর্তী →"
                full
                disabled={!canProceed1}
                style={{ marginTop: 10 }}
                onPress={() => canProceed1 && setStep(2)}
              />
            </>
          )}
          {step === 2 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
              {BIZ_OPTIONS.map((o) => (
                <View key={o.l} style={{ width: '50%', padding: 4 }}>
                  <Pressable
                    onPress={() => {
                      setBiz(`${o.e} ${o.l}`);
                      setStep(3);
                    }}
                    style={chipBtn}
                  >
                    <T size={18}>{o.e}</T>
                    <T weight="s" size={14}>{o.l}</T>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
          {step === 3 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
              {PLACE_OPTIONS.map((o) => (
                <View key={o.l} style={{ width: '50%', padding: 4 }}>
                  <Pressable
                    onPress={() => {
                      setPlace(`${o.e} ${o.l}`);
                      setStep(4);
                    }}
                    style={chipBtn}
                  >
                    <T size={18}>{o.e}</T>
                    <T weight="s" size={14}>{o.l}</T>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
          {step === 4 && (
            <Btn
              kind="primary"
              label="পরবর্তী → চ্যানেল যুক্ত করুন"
              full
              disabled={!canProceed4}
              onPress={() => canProceed4 && setStep(5)}
            />
          )}
          {step === 5 && (
            <Btn
              kind="primary"
              label="শুরু করুন 🚀 সাথী প্রস্তুত"
              full
              onPress={() => onFinish({ brandName, logoIdx, channels })}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

function Bubble({ from, text }: ChatMessage) {
  const isUser = from === 'user';
  return (
    <View
      style={{
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 8,
      }}
    >
      {!isUser && <SathiBadge size={22} style={{ marginBottom: 4 }} />}
      <View
        style={{
          maxWidth: '80%',
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 16,
          borderTopLeftRadius: isUser ? 16 : 4,
          borderTopRightRadius: isUser ? 4 : 16,
          backgroundColor: isUser ? colors.saffronSoft : colors.tealSoft,
        }}
      >
        <T size={14} color={colors.ink}>
          {text}
        </T>
      </View>
    </View>
  );
}

const chipBtn = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 8,
  paddingHorizontal: 12,
  paddingVertical: 12,
  backgroundColor: '#fff',
  borderColor: colors.border2,
  borderWidth: 1,
  borderRadius: radius.pill,
};

const ONBOARDED_KEY = (userId: string) => `aropon:onboarded:${userId}`;
const BRAND_KEY = 'aropon:onboarding:brand';
const CHANNELS_KEY = 'aropon:onboarding:channels';

export async function isOnboarded(userId: string): Promise<boolean> {
  const v = await AsyncStorage.getItem(ONBOARDED_KEY(userId));
  return v === '1';
}

export async function markOnboarded(userId: string, payload: { brandName: string; logoIdx: number; channels: Record<string, boolean> }) {
  await AsyncStorage.setItem(ONBOARDED_KEY(userId), '1');
  await AsyncStorage.setItem(BRAND_KEY, JSON.stringify({ brandName: payload.brandName, logoIdx: payload.logoIdx }));
  await AsyncStorage.setItem(CHANNELS_KEY, JSON.stringify(payload.channels));
}

export async function markOnboardedSkipped(userId: string) {
  await AsyncStorage.setItem(ONBOARDED_KEY(userId), '1');
}

export async function readBrand(): Promise<{ brandName: string; logoIdx: number } | null> {
  const raw = await AsyncStorage.getItem(BRAND_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
