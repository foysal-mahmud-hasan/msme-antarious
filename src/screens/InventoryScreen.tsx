import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Row, SathiBadge, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { useProducts } from '../state/ProductsStore';
import { colors } from '../theme';

const BN = (n: number) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[+d]);

type Move = { id: string; product: string; qty: number; kind: 'in' | 'out' };

export function InventoryScreen({ onClose }: { onClose: () => void }) {
  const toast = useToast();
  const { products, lowCount, adjustStock } = useProducts();
  const [moves, setMoves] = useState<Move[]>([]);

  const stockValue = products.reduce((s, p) => s + p.price * p.stock, 0);

  const logMove = (product: string, qty: number, kind: 'in' | 'out') =>
    setMoves((prev) => [{ id: 'm-' + Date.now(), product, qty, kind }, ...prev].slice(0, 12));

  const inflow = (id: string, name: string, qty: number) => {
    adjustStock(id, qty);
    logMove(name, qty, 'in');
    toast.show(`${name} — ${BN(qty)} ইউনিট ইনফ্লো যোগ হয়েছে`, 'success');
  };

  const sale = (id: string, name: string) => {
    adjustStock(id, -1);
    logMove(name, 1, 'out');
    toast.show(`${name} — ১টি বিক্রি · স্টক অটো কমেছে`, 'info');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: 14, paddingTop: 6, paddingBottom: 14, borderBottomColor: colors.border2, borderBottomWidth: 1 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={8} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>ইনভেন্টরি</T>
            <T size={12} color={colors.ink2}>ম্যানুয়াল ইনফ্লো · অটো আউটফ্লো</T>
          </View>
        </Row>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ width: '100%', maxWidth: 720, alignSelf: 'center', paddingHorizontal: 16, paddingTop: 16 }}>
          <Row gap={10} style={{ marginBottom: 14 }}>
            <StatBox value={BN(products.length)} label="পণ্য" color={colors.ink} />
            <StatBox value={BN(lowCount)} label="কম স্টক" color={lowCount > 0 ? colors.coral : colors.green} />
            <StatBox value={`৳${BN(stockValue)}`} label="স্টক মূল্য" color={colors.green} />
          </Row>

          <Card tinted={colors.tealSoft} style={{ padding: 12, marginBottom: 14 }}>
            <Row gap={8}>
              <SathiBadge size={18} />
              <T size={12.5} color={colors.ink} style={{ flex: 1 }}>
                <T weight="b" size={12.5}>ইনফ্লো</T> আপনি যোগ করেন; <T weight="b" size={12.5}>আউটফ্লো</T> প্রতিটি বিক্রিতে সাথী স্বয়ংক্রিয়ভাবে কমিয়ে দেয়।
              </T>
            </Row>
          </Card>

          <View style={{ gap: 10 }}>
            {products.map((p) => {
              const low = p.stock <= p.lowThreshold;
              return (
                <Card key={p.id} style={{ padding: 14 }}>
                  <Row gap={12}>
                    <View style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                      <T size={22}>{p.emoji}</T>
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <T weight="b" size={14} numberOfLines={1}>{p.name}</T>
                      <Row gap={6} style={{ marginTop: 2 }}>
                        <T size={12.5} color={colors.ink2}>৳{BN(p.price)}</T>
                        <T size={12.5} color={low ? colors.coral : colors.ink2} weight={low ? 'b' : 'r'}>
                          · স্টক {BN(p.stock)}
                        </T>
                        {low ? (
                          <View style={{ paddingHorizontal: 6, paddingVertical: 1, borderRadius: 5, backgroundColor: colors.coralSoft }}>
                            <T size={9.5} weight="b" color={colors.coral}>কম</T>
                          </View>
                        ) : null}
                      </Row>
                    </View>
                  </Row>
                  <Row gap={8} style={{ marginTop: 10 }}>
                    <ActionBtn label="+ ১০ ইনফ্লো" color={colors.green} onPress={() => inflow(p.id, p.name, 10)} />
                    <ActionBtn label="+ ১" color={colors.teal} onPress={() => inflow(p.id, p.name, 1)} />
                    <ActionBtn label="🛒 বিক্রি (আউট)" color={colors.coral} onPress={() => sale(p.id, p.name)} />
                  </Row>
                </Card>
              );
            })}
          </View>

          {moves.length > 0 && (
            <>
              <T weight="b" size={15} style={{ marginTop: 18, marginBottom: 8 }}>সাম্প্রতিক মুভমেন্ট</T>
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                {moves.map((m, i) => (
                  <Row key={m.id} gap={10} style={{ padding: 12, borderTopWidth: i === 0 ? 0 : 1, borderTopColor: colors.border2 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: m.kind === 'in' ? colors.greenSoft : colors.coralSoft, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={m.kind === 'in' ? 'arrow-down' : 'arrow-up'} size={15} color={m.kind === 'in' ? colors.green : colors.coral} />
                    </View>
                    <T size={13.5} style={{ flex: 1 }} numberOfLines={1}>{m.product}</T>
                    <T weight="b" size={13.5} color={m.kind === 'in' ? colors.green : colors.coral}>
                      {m.kind === 'in' ? '+' : '−'}{BN(m.qty)}
                    </T>
                  </Row>
                ))}
              </Card>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, borderColor: colors.border2, borderWidth: 1, paddingVertical: 10, alignItems: 'center' }}>
      <T weight="b" size={17} color={color}>{value}</T>
      <T size={10.5} color={colors.ink2}>{label}</T>
    </View>
  );
}

function ActionBtn({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: color, backgroundColor: color + '12' }}>
      <T weight="b" size={12} color={color}>{label}</T>
    </Pressable>
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
