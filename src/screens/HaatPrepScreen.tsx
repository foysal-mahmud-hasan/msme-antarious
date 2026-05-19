import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { ScreenScroll } from '../components/ScreenContainer';
import { colors } from '../theme';

export function HaatPrepScreen({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<{ id: string; n: string; q: number; e: string; ok: boolean }[]>([
    { id: '1', n: 'মিনি ফ্যান', q: 20, e: '🌀', ok: true },
    { id: '2', n: 'কুলিং বোতল', q: 30, e: '🧴', ok: true },
    { id: '3', n: 'ছাতা', q: 15, e: '☂️', ok: false },
    { id: '4', n: 'হ্যান্ড ফ্যান', q: 25, e: '💡', ok: true },
    { id: '5', n: 'প্লাস্টিক বক্স', q: 18, e: '📦', ok: false },
  ]);
  const ready = items.filter((i) => i.ok).length;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>হাট প্রস্তুতি</T>
            <T size={12} color={colors.ink2}>শনিবার, ১৬ মে · ৩ দিন বাকি</T>
          </View>
          <Chip kind="amber" size={11}>৩ দিন</Chip>
        </Row>
      </View>

      <ScreenScroll>
        <Card tinted={colors.amberSoft} style={{ padding: 14, marginBottom: 14 }}>
          <Row gap={8}>
            <SathiBadge />
            <T weight="b" size={14}>সাথীর সুপারিশ</T>
          </Row>
          <T size={14} style={{ marginTop: 8, lineHeight: 20 }}>
            গত ৩টি হাটে গড়ে <T weight="b">৳১২,৪০০</T> বিক্রি হয়েছে। মিনি ফ্যান ও কুলিং বোতল দ্রুত শেষ হয়ে যায় — অতিরিক্ত নিয়ে যান।
          </T>
        </Card>

        <Row style={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <T weight="b" size={15}>চেকলিস্ট</T>
          <T size={13} color={colors.green} weight="b">{ready}/{items.length} প্রস্তুত</T>
        </Row>

        <Card style={{ padding: 4 }}>
          {items.map((it, i) => (
            <Pressable
              key={it.id}
              onPress={() => setItems((arr) => arr.map((x) => (x.id === it.id ? { ...x, ok: !x.ok } : x)))}
            >
              <Row gap={12} style={{ padding: 12, borderTopWidth: i ? 1 : 0, borderTopColor: colors.border2 }}>
                <View
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    borderWidth: 2,
                    borderColor: it.ok ? colors.green : colors.border,
                    backgroundColor: it.ok ? colors.green : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {it.ok ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
                </View>
                <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={20}>{it.e}</T>
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="s" size={14} style={{ textDecorationLine: it.ok ? 'line-through' : 'none', color: it.ok ? colors.ink2 : colors.ink }}>{it.n}</T>
                  <T size={12} color={colors.ink2}>{it.q} টি নিতে হবে</T>
                </View>
              </Row>
            </Pressable>
          ))}
        </Card>

        <Card style={{ padding: 16, marginTop: 14 }}>
          <T weight="b" size={14}>প্যাকিং পরামর্শ</T>
          {[
            { t: 'বৃহস্পতিবার রাতে', d: 'পণ্য গণনা · মূল্য ট্যাগ', e: '📋' },
            { t: 'শুক্রবার সন্ধ্যা', d: 'প্যাক · যানবাহন প্রস্তুত', e: '🚚' },
            { t: 'শনিবার ভোর ৫টা', d: 'হাটে রওনা', e: '🌅' },
          ].map((s, i, arr) => (
            <Row key={s.t} gap={12} style={{ paddingVertical: 12, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border2 }}>
              <T size={24}>{s.e}</T>
              <View style={{ flex: 1 }}>
                <T weight="b" size={13}>{s.t}</T>
                <T size={12.5} color={colors.ink2}>{s.d}</T>
              </View>
            </Row>
          ))}
        </Card>

        <Btn kind="amberOutline" label="সাথীকে মনে করিয়ে দিতে বলুন" full style={{ marginTop: 14 }} iconLeft={<Ionicons name="notifications-outline" size={16} color={colors.amber} />} />
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
