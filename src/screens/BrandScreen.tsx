import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { useResponsive } from '../components/AppFrame';
import { useToast } from '../components/Toast';
import { readBrand } from './SathiOnboardingScreen';
import { colors } from '../theme';

const PALETTES = [
  { name: 'উষ্ণ', colors: [colors.saffron, '#FAF8F4', '#1A1A2E', '#fbbf24'] },
  { name: 'সবুজ মাটি', colors: [colors.green, '#FAF8F4', '#1A1A2E', '#fbbf24'] },
  { name: 'নীল আকাশ', colors: ['#0EA5E9', '#FAF8F4', '#0f172a', '#fcd34d'] },
  { name: 'প্রবাল', colors: [colors.coral, '#FFF7F7', '#1A1A2E', '#fbbf24'] },
  { name: 'বেগুনি', colors: ['#8B5CF6', '#FAF8F4', '#1A1A2E', '#22d3ee'] },
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

const SOCIAL_KIT = [
  { e: '📘', l: 'Facebook কভার', sub: '১৬৪০×৮৫৬' },
  { e: '💬', l: 'WhatsApp DP', sub: '৫১২×৫১২' },
  { e: '📸', l: 'IG পোস্ট', sub: '১০৮০×১০৮০' },
  { e: '📦', l: 'প্যাকেজিং', sub: 'PDF' },
];

export function BrandScreen({ onClose, locked = false }: { onClose: () => void; locked?: boolean }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const [brandName, setBrandName] = useState('রহিমা স্টোর');
  const [logoIdx, setLogoIdx] = useState(2);
  const [paletteIdx, setPaletteIdx] = useState(1);
  const tagline = 'মাটি থেকে মানুষ পর্যন্ত';

  useEffect(() => {
    let alive = true;
    readBrand().then((b) => {
      if (alive && b && b.brandName.trim()) {
        setBrandName(b.brandName);
        setLogoIdx(b.logoIdx);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const palette = PALETTES[paletteIdx];
  const logo = LOGO_TILES[logoIdx];
  const glyph = (brandName.trim()[0] || 'আ').toUpperCase();
  const previewIsLight = palette.colors[1] === '#FAF8F4' || palette.colors[1] === '#FFF7F7';
  const previewText = previewIsLight ? '#fff' : palette.colors[2];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 12, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>ব্র্যান্ড স্টুডিও</T>
            <T size={12} color={colors.ink2}>আপনার দোকানের পরিচয় তৈরি করুন</T>
          </View>
          {locked && <Chip kind="saffron">🔒 Pro</Chip>}
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40, alignItems: 'stretch' }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 720 : undefined, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 14 }}>
          {/* Preview */}
          <View
            style={{
              backgroundColor: palette.colors[0],
              borderRadius: 16,
              padding: 18,
              minHeight: 150,
              justifyContent: 'space-between',
              overflow: 'hidden',
              marginBottom: 14,
            }}
          >
            <Row gap={10}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 14,
                  backgroundColor: logo.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <T weight="b" size={22} color={logo.dark ? '#1A1A2E' : '#fff'}>{glyph}</T>
              </View>
              <View>
                <T size={11} color="rgba(255,255,255,0.85)">প্রিভিউ</T>
                <T weight="b" size={20} color="#fff">{brandName}</T>
              </View>
            </Row>
            <T size={13} style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)', marginTop: 28 }}>"{tagline}"</T>
          </View>

          <T weight="b" size={14} style={{ marginTop: 8, marginBottom: 8 }}>লোগো বেছে নিন</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 }}>
            {LOGO_TILES.map((lg, i) => (
              <View key={i} style={{ width: '33.333%', padding: 4 }}>
                <Pressable onPress={() => setLogoIdx(i)}>
                  <View
                    style={{
                      aspectRatio: 1,
                      borderRadius: 14,
                      backgroundColor: lg.bg,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: i === logoIdx ? 3 : 1,
                      borderColor: i === logoIdx ? colors.saffron : colors.border2,
                    }}
                  >
                    <T weight="b" size={26} color={lg.dark ? '#1A1A2E' : '#fff'}>{glyph}</T>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>

          <T weight="b" size={14} style={{ marginTop: 18, marginBottom: 8 }}>রঙের প্যালেট</T>
          <View style={{ gap: 8 }}>
            {PALETTES.map((p, i) => {
              const sel = i === paletteIdx;
              return (
                <Pressable
                  key={p.name}
                  onPress={() => setPaletteIdx(i)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderRadius: 14,
                    backgroundColor: '#fff',
                    borderWidth: sel ? 2 : 1.5,
                    borderColor: sel ? colors.saffron : colors.border2,
                  }}
                >
                  <Row gap={4}>
                    {p.colors.map((c, j) => (
                      <View
                        key={j}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          backgroundColor: c,
                          borderWidth: c === '#FAF8F4' || c === '#FFF7F7' ? 1 : 0,
                          borderColor: colors.border2,
                        }}
                      />
                    ))}
                  </Row>
                  <T weight="s" size={13.5}>{p.name}</T>
                  <View style={{ flex: 1 }} />
                  {sel && <Chip kind="saffron" size={11}>নির্বাচিত</Chip>}
                </Pressable>
              );
            })}
          </View>

          <T weight="b" size={14} style={{ marginTop: 18, marginBottom: 8 }}>
            ব্র্যান্ডের কণ্ঠ <T size={14} color={colors.ink2}>· সাথী তৈরি করেছে</T>
          </T>
          <Card style={{ padding: 14 }}>
            <T size={13.5} style={{ lineHeight: 22 }}>
              <T weight="b" size={13.5}>ব্যক্তিত্ব:</T> উষ্ণ, পরিবারের মতো, বিশ্বাসযোগ্য{'\n'}
              <T weight="b" size={13.5}>সুর:</T> আন্তরিক, সহজ ভাষা, বন্ধুত্বপূর্ণ{'\n'}
              <T weight="b" size={13.5}>ব্যবহার করুন:</T> হাতে তৈরি, নিজস্ব, যত্নে, ভালোবেসে{'\n'}
              <T weight="b" size={13.5}>এড়িয়ে চলুন:</T> অসাধারণ, প্রিমিয়াম, লাক্সারি, এক্সক্লুসিভ
            </T>
          </Card>

          <T weight="b" size={14} style={{ marginTop: 18, marginBottom: 8 }}>সোশ্যাল মিডিয়া কিট</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 }}>
            {SOCIAL_KIT.map((a) => (
              <View key={a.l} style={{ width: '50%', padding: 5 }}>
                <Card style={{ padding: 12 }}>
                  <View style={{ height: 70, borderRadius: 10, backgroundColor: colors.border2, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                    <T size={28}>{a.e}</T>
                  </View>
                  <T weight="s" size={12.5}>{a.l}</T>
                  <T size={11} color={colors.ink2}>{a.sub}</T>
                  <Btn
                    kind="greyOutline"
                    size="sm"
                    label="ডাউনলোড"
                    full
                    style={{ marginTop: 8 }}
                    onPress={() => toast.show(`${a.l} প্রস্তুত হচ্ছে…`, 'info')}
                  />
                </Card>
              </View>
            ))}
          </View>

          <Btn
            kind="primary"
            label="সব মাধ্যমে প্রকাশ করুন"
            full
            style={{ marginTop: 18 }}
            iconRight={<Ionicons name="checkmark" size={16} color="#fff" />}
            onPress={() => toast.show('ব্র্যান্ড আপডেট সব চ্যানেলে পাঠানো হবে…', 'success')}
          />
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
