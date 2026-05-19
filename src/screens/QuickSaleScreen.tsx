import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Card, Row, T } from '../components/atoms';
import { colors, fonts, radius } from '../theme';

const products = [
  { id: 'fan', e: '🌀', n: 'মিনি ফ্যান', p: 850 },
  { id: 'clip', e: '💇', n: 'চুলের ক্লিপ', p: 120 },
  { id: 'bottle', e: '🧴', n: 'কুলিং বোতল', p: 350 },
  { id: 'box', e: '📦', n: 'প্লাস্টিক বক্স', p: 220 },
  { id: 'oil', e: '🛢️', n: 'নারিকেল তেল', p: 180 },
  { id: 'umb', e: '☂️', n: 'ছাতা', p: 450 },
];

export function QuickSaleScreen({ onClose }: { onClose: () => void }) {
  const [cart, setCart] = useState<Record<string, number>>({ fan: 2, clip: 5 });
  const [pay, setPay] = useState<'cash' | 'credit' | 'mfs'>('cash');
  const [creditName, setCreditName] = useState('রহিম মিয়া');
  const [done, setDone] = useState(false);
  const { isDesktop } = useResponsive();
  const productCols = isDesktop ? 3 : 2;

  const total = products.reduce((s, p) => s + (cart[p.id] || 0) * p.p, 0);

  if (done) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.greenSoft }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Ionicons name="checkmark" size={64} color="#fff" />
          </View>
          <T weight="b" size={26}>বিক্রি সংরক্ষিত হয়েছে</T>
          <T size={14} color={colors.ink2} style={{ marginTop: 8, textAlign: 'center' }}>
            সাথী হিসাবে যোগ করেছে · ইন্টারনেট এলে সিঙ্ক হবে
          </T>
          <T weight="b" size={40} color={colors.green} style={{ marginTop: 24 }}>
            ৳{total.toLocaleString('bn-BD')}
          </T>
          <Btn label="শেষ" full style={{ marginTop: 32, alignSelf: 'stretch' }} onPress={onClose} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>আজকের বিক্রি</T>
            <T size={12} color={colors.ink2}>সোমবার, ১১ মে ২০২৬</T>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <T size={11} color={colors.ink2}>চলমান মোট</T>
            <T weight="b" size={20} color={colors.green}>৳{total.toLocaleString('bn-BD')}</T>
          </View>
        </Row>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: isDesktop ? 28 : 14,
          paddingBottom: 220,
          alignItems: 'stretch',
        }}
      >
        <View style={{ width: '100%', maxWidth: 760, alignSelf: 'center' }}>
        <T size={13} color={colors.ink2} style={{ marginBottom: 8 }}>
          পণ্য চাপুন — সংখ্যা বাড়বে · দীর্ঘ চাপ = কম
        </T>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {products.map((p) => {
            const q = cart[p.id] || 0;
            return (
              <Pressable
                key={p.id}
                onPress={() => setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }))}
                onLongPress={() => setCart((c) => ({ ...c, [p.id]: Math.max(0, (c[p.id] || 0) - 1) }))}
                style={{
                  width: productCols === 3 ? '31.5%' : '48%',
                  padding: 12,
                  borderRadius: 14,
                  borderWidth: q > 0 ? 2 : 1,
                  borderColor: q > 0 ? colors.saffron : colors.border2,
                  backgroundColor: q > 0 ? colors.saffronSoft : '#fff',
                  position: 'relative',
                }}
              >
                <View style={{ height: 56, backgroundColor: colors.border2, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                  <T size={28}>{p.e}</T>
                </View>
                <T weight="b" size={14}>{p.n}</T>
                <T size={12} color={colors.ink2}>৳{p.p}</T>
                {q > 0 ? (
                  <View
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      minWidth: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: colors.saffron,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: 8,
                    }}
                  >
                    <T weight="b" color="#fff" size={13}>×{q}</T>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        <Btn
          kind="greyOutline"
          label="নতুন পণ্য যোগ করুন"
          full
          style={{ marginTop: 12 }}
          iconLeft={<Ionicons name="add" size={16} color={colors.ink2} />}
        />

        <Card style={{ padding: 16, marginTop: 18 }}>
          <Row style={{ justifyContent: 'space-between', marginBottom: 10 }}>
            <T weight="b" size={15}>মোট</T>
            <T weight="b" size={24} color={colors.green}>৳{total.toLocaleString('bn-BD')}</T>
          </Row>
          <T size={12} color={colors.ink2} style={{ marginBottom: 8 }}>পেমেন্ট</T>
          <Row gap={6}>
            {[
              { id: 'cash' as const, l: 'নগদ', e: '💵' },
              { id: 'credit' as const, l: 'বাকি', e: '📒' },
              { id: 'mfs' as const, l: 'bKash/Nagad', e: '📱' },
            ].map((o) => (
              <Pressable
                key={o.id}
                onPress={() => setPay(o.id)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 10,
                  borderWidth: pay === o.id ? 2 : 1,
                  borderColor: pay === o.id ? colors.saffron : colors.border2,
                  backgroundColor: pay === o.id ? colors.saffronSoft : '#fff',
                  alignItems: 'center',
                }}
              >
                <T size={18}>{o.e}</T>
                <T weight="s" size={12.5} style={{ marginTop: 2 }}>{o.l}</T>
              </Pressable>
            ))}
          </Row>
          {pay === 'credit' ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginTop: 10,
                paddingHorizontal: 14,
                backgroundColor: '#fff',
                borderRadius: radius.md,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Ionicons name="person-outline" size={16} color={colors.ink2} />
              <TextInput
                value={creditName}
                onChangeText={setCreditName}
                placeholder="কার কাছে?"
                placeholderTextColor={colors.ink2}
                style={{ flex: 1, paddingVertical: 12, fontFamily: fonts.medium, color: colors.ink }}
              />
            </View>
          ) : null}
        </Card>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border2 }}>
        <View style={{ width: '100%', maxWidth: 760, alignSelf: 'center' }}>
          <Btn label="বিক্রি সংরক্ষণ করুন" full onPress={() => setDone(true)} iconRight={<Ionicons name="checkmark-circle" size={18} color="#fff" />} />
        </View>
      </View>
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
