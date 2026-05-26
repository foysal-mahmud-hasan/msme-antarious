import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Card, Row, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { colors } from '../theme';

const BN = (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

type Courier = { id: string; name: string; emoji: string; rate: string; connected: boolean };
type ShipStatus = 'pickup' | 'transit' | 'delivered';
const SHIP_META: Record<ShipStatus, { label: string; color: string }> = {
  pickup: { label: 'পিকআপ অপেক্ষায়', color: colors.amber },
  transit: { label: 'পথে আছে', color: colors.teal },
  delivered: { label: 'ডেলিভার্ড', color: colors.green },
};

const INIT_COURIERS: Courier[] = [
  { id: 'pathao', name: 'Pathao Courier', emoji: '🛵', rate: '৳৬০ থেকে', connected: true },
  { id: 'steadfast', name: 'Steadfast', emoji: '📦', rate: '৳৭০ থেকে', connected: false },
  { id: 'redx', name: 'RedX', emoji: '🚚', rate: '৳৬৫ থেকে', connected: false },
  { id: 'paperfly', name: 'Paperfly', emoji: '✈️', rate: '৳৮০ থেকে', connected: false },
];

const SHIPMENTS: { id: string; customer: string; address: string; status: ShipStatus; courier: string }[] = [
  { id: 'PA-48213', customer: 'করিম সাহেব', address: 'ধানমন্ডি, ঢাকা', status: 'transit', courier: 'Pathao' },
  { id: 'PA-48198', customer: 'সুমাইয়া আক্তার', address: 'আগ্রাবাদ, চট্টগ্রাম', status: 'pickup', courier: 'Pathao' },
  { id: 'PA-48155', customer: 'নাজমা বেগম', address: 'বোয়ালিয়া, রাজশাহী', status: 'delivered', courier: 'Pathao' },
];

export function CourierScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  const toast = useToast();
  const [couriers, setCouriers] = useState(INIT_COURIERS);

  const toggle = (id: string) =>
    setCouriers((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const connected = !c.connected;
        toast.show(`${c.name} ${connected ? 'সংযুক্ত হয়েছে' : 'বিচ্ছিন্ন হয়েছে'}`, connected ? 'success' : 'info');
        return { ...c, connected };
      })
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 14, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>কুরিয়ার ইন্টিগ্রেশন</T>
            <T size={12} color={colors.ink2}>সংযোগ · পিকআপ · ট্র্যাকিং</T>
          </View>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: isDesktop ? 640 : undefined, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
          <Btn
            kind="primary"
            label="📦 নতুন পিকআপ বুক করুন"
            full
            style={{ marginBottom: 16 }}
            onPress={() => toast.show('পিকআপ রিকোয়েস্ট পাঠানো হয়েছে — সাথী বাকিটা সামলাচ্ছে', 'success')}
          />

          <T weight="b" size={15} style={{ marginBottom: 8 }}>সংযুক্ত কুরিয়ার</T>
          <Card style={{ padding: 0, marginBottom: 16, overflow: 'hidden' }}>
            {couriers.map((c, i) => (
              <Row key={c.id} gap={12} style={{ padding: 14, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border2 }}>
                <View style={{ width: 42, height: 42, borderRadius: 11, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={22}>{c.emoji}</T>
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="b" size={14}>{c.name}</T>
                  <T size={12} color={colors.ink2}>ডেলিভারি চার্জ {c.rate}</T>
                </View>
                <Btn
                  kind={c.connected ? 'greenOutline' : 'greyOutline'}
                  size="sm"
                  label={c.connected ? '✓ সংযুক্ত' : 'সংযুক্ত করুন'}
                  onPress={() => toggle(c.id)}
                />
              </Row>
            ))}
          </Card>

          <T weight="b" size={15} style={{ marginBottom: 8 }}>সক্রিয় শিপমেন্ট</T>
          <View style={{ gap: 10 }}>
            {SHIPMENTS.map((s) => {
              const m = SHIP_META[s.status];
              return (
                <Card key={s.id} leftBar={m.color} style={{ padding: 14 }}>
                  <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <T weight="b" size={14}>{s.customer}</T>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: m.color }}>
                      <T weight="b" size={10.5} color="#fff">{m.label}</T>
                    </View>
                  </Row>
                  <T size={12.5} color={colors.ink2} style={{ marginTop: 3 }}>{s.address}</T>
                  <Row gap={6} style={{ marginTop: 6 }}>
                    <Ionicons name="cube-outline" size={14} color={colors.ink2} />
                    <T size={12} color={colors.ink2}>{s.courier} · ট্র্যাকিং {s.id}</T>
                  </Row>
                </Card>
              );
            })}
          </View>
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
