import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Avatar, Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { colors } from '../theme';

type Status = 'প্যাকিং' | 'পথে' | 'ডেলিভার্ড' | 'বাতিল';
type Order = {
  id: string;
  cust: string;
  phone: string;
  address: string;
  channel: 'fb' | 'wa';
  total: number;
  paid: number;
  status: Status;
  kind: 'amber' | 'teal' | 'green' | 'coral';
  date: string;
  items: { emoji: string; name: string; qty: number; price: number }[];
  history: { t: string; msg: string }[];
  sathiNote: string;
};

const ORDERS: Order[] = [
  {
    id: 'অর্ডার-৩৪২',
    cust: 'করিম সাহেব',
    phone: '+880 17XX-XXX 432',
    address: 'মোহাম্মদপুর, ঢাকা',
    channel: 'fb',
    total: 2750,
    paid: 0,
    status: 'প্যাকিং',
    kind: 'amber',
    date: 'আজ · ৯:২৪ AM',
    items: [
      { emoji: '🌀', name: 'মিনি ইউএসবি ফ্যান', qty: 2, price: 850 },
      { emoji: '🧴', name: 'কুলিং বোতল', qty: 2, price: 350 },
      { emoji: '👜', name: 'কুলিং কুশন', qty: 1, price: 280 },
    ],
    history: [
      { t: '১১:০৩ AM', msg: 'প্যাকিং শুরু হয়েছে' },
      { t: '১০:২২ AM', msg: 'অর্ডার নিশ্চিত — সাথী' },
      { t: '৯:২৪ AM', msg: 'গ্রাহক বার্তা পাঠিয়েছেন' },
    ],
    sathiNote: 'করিম সাহেব গত ৩ মাসে ৪টি অর্ডার দিয়েছেন — নির্ভরযোগ্য গ্রাহক। প্যাকিং শেষ হলে Pathao বুক করি।',
  },
  {
    id: 'অর্ডার-৩৪১',
    cust: 'নাসরিন বেগম',
    phone: '+880 18XX-XXX 119',
    address: 'খুলনা সদর, খুলনা',
    channel: 'wa',
    total: 850,
    paid: 850,
    status: 'পথে',
    kind: 'teal',
    date: 'গতকাল · ৪:১২ PM',
    items: [{ emoji: '🌀', name: 'মিনি ইউএসবি ফ্যান', qty: 1, price: 850 }],
    history: [
      { t: 'আজ · ৭:১৫ AM', msg: 'Pathao পিকআপ সম্পন্ন' },
      { t: 'গতকাল · ৫:৪০ PM', msg: 'প্যাকেজ প্রস্তুত' },
      { t: 'গতকাল · ৪:১২ PM', msg: 'অর্ডার পেলাম — সাথী' },
    ],
    sathiNote: 'কুরিয়ার ট্র্যাকিং: PT-928374 · আগামীকাল পৌঁছাবে।',
  },
  {
    id: 'অর্ডার-৩৪০',
    cust: 'মুনির খান',
    phone: '+880 17XX-XXX 281',
    address: 'গুলশান, ঢাকা',
    channel: 'fb',
    total: 1600,
    paid: 1600,
    status: 'ডেলিভার্ড',
    kind: 'green',
    date: '২ দিন আগে',
    items: [
      { emoji: '☂️', name: 'ছাতা', qty: 2, price: 450 },
      { emoji: '📦', name: 'প্লাস্টিক বক্স', qty: 1, price: 220 },
      { emoji: '🛢️', name: 'নারিকেল তেল', qty: 3, price: 160 },
    ],
    history: [
      { t: '২ দিন আগে · ৬:১২ PM', msg: 'ডেলিভারি সম্পন্ন ✓' },
      { t: '২ দিন আগে · ২:০০ PM', msg: 'কুরিয়ার নিয়েছে' },
      { t: '৩ দিন আগে', msg: 'অর্ডার গ্রহণ করা হয়েছে' },
    ],
    sathiNote: 'মুনির খান একজন রেগুলার — ৮টি অর্ডার সম্পন্ন। ফলো-আপ মেসেজ পাঠাতে পারেন।',
  },
  {
    id: 'অর্ডার-৩৩৯',
    cust: 'হাসিনা পারভীন',
    phone: '+880 19XX-XXX 547',
    address: 'বরিশাল সদর',
    channel: 'wa',
    total: 350,
    paid: 0,
    status: 'বাতিল',
    kind: 'coral',
    date: '২ দিন আগে',
    items: [{ emoji: '🧴', name: 'কুলিং বোতল', qty: 1, price: 350 }],
    history: [
      { t: '২ দিন আগে · ৩:১১ PM', msg: 'গ্রাহক বাতিল করেছেন' },
      { t: '২ দিন আগে · ২:৪৫ PM', msg: 'রঙ নিয়ে আপত্তি' },
      { t: '২ দিন আগে · ১:০২ PM', msg: 'অর্ডার গ্রহণ' },
    ],
    sathiNote: 'রঙের ছবি আরও পরিষ্কার দিলে এমন বাতিল কমবে।',
  },
];

export function getOrder(id?: string): Order {
  if (!id) return ORDERS[0];
  return ORDERS.find((o) => o.id === id) ?? ORDERS[0];
}

export function OrderDetailsScreen({ onClose, orderId }: { onClose: () => void; orderId?: string }) {
  const { isDesktop } = useResponsive();
  const actions = useActions();
  const toast = useToast();
  const [order, setOrder] = useState<Order>(() => getOrder(orderId));

  const advance = () => {
    const flow: Status[] = ['প্যাকিং', 'পথে', 'ডেলিভার্ড'];
    const idx = flow.indexOf(order.status);
    if (idx < 0 || idx >= flow.length - 1) return;
    const nextStatus = flow[idx + 1];
    const nextKind: Order['kind'] = nextStatus === 'পথে' ? 'teal' : 'green';
    const stampedHistory = [
      { t: 'এইমাত্র', msg: nextStatus === 'পথে' ? 'কুরিয়ারের কাছে হস্তান্তর' : 'ডেলিভারি সম্পন্ন ✓' },
      ...order.history,
    ];
    setOrder({ ...order, status: nextStatus, kind: nextKind, history: stampedHistory });
    toast.show(`${order.id} — ${nextStatus}`, 'success');
  };

  const subtotal = order.items.reduce((s, it) => s + it.qty * it.price, 0);
  const due = Math.max(0, order.total - order.paid);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
            <Ionicons name={isDesktop ? 'close' : 'arrow-back'} size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>{order.id}</T>
            <T size={12} color={colors.ink2}>{order.date}</T>
          </View>
          <Chip kind={order.kind} size={11}>{order.status}</Chip>
        </Row>
      </View>

      <ScrollView contentContainerStyle={{ padding: isDesktop ? 24 : 14, paddingBottom: 130, alignItems: 'stretch' }}>
        <View style={{ width: '100%', maxWidth: 720, alignSelf: 'center' }}>
          <Card style={{ padding: 16, marginBottom: 12 }}>
            <Row gap={12}>
              <Avatar text={order.cust[0]} bg={colors.saffronSoft} color={colors.saffron} size={44} />
              <View style={{ flex: 1 }}>
                <Row gap={6}>
                  <T weight="b" size={15}>{order.cust}</T>
                  <MaterialCommunityIcons
                    name={order.channel === 'fb' ? 'facebook' : 'whatsapp'}
                    size={14}
                    color={order.channel === 'fb' ? '#1877F2' : '#25D366'}
                  />
                </Row>
                <T size={12.5} color={colors.ink2}>{order.phone}</T>
                <T size={12.5} color={colors.ink2}>{order.address}</T>
              </View>
            </Row>
            <Row gap={8} style={{ marginTop: 12 }}>
              <Btn
                kind="tealOutline"
                size="sm"
                label="বার্তা পাঠান"
                full
                style={{ flex: 1 }}
                onPress={() => {
                  toast.show(`${order.cust}-কে বার্তা পাঠানোর জন্য প্রস্তুত`, 'info');
                  actions.goto('messages', 'inbox');
                  onClose();
                }}
                iconLeft={<Ionicons name="chatbubble-outline" size={14} color={colors.tealDark} />}
              />
              <Btn
                kind="greyOutline"
                size="sm"
                label="কল করুন"
                full
                style={{ flex: 1 }}
                onPress={() => toast.show(`${order.phone}-এ কল হচ্ছে…`, 'info')}
                iconLeft={<Ionicons name="call-outline" size={14} color={colors.ink2} />}
              />
            </Row>
          </Card>

          <Card style={{ padding: 4, marginBottom: 12 }}>
            <View style={{ padding: 12 }}>
              <T weight="b" size={14}>পণ্য ({order.items.length})</T>
            </View>
            {order.items.map((it, i) => (
              <Row
                key={i}
                gap={12}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.border2,
                }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <T size={22}>{it.emoji}</T>
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="s" size={14}>{it.name}</T>
                  <T size={12} color={colors.ink2}>৳{it.price} × {it.qty}</T>
                </View>
                <T weight="b" size={14}>৳{(it.qty * it.price).toLocaleString('en-US')}</T>
              </Row>
            ))}
            <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: colors.border2 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <T size={13} color={colors.ink2}>সাব-টোটাল</T>
                <T weight="s" size={13}>৳{subtotal.toLocaleString('en-US')}</T>
              </Row>
              <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
                <T size={13} color={colors.ink2}>পেইড</T>
                <T weight="s" size={13} color={colors.green}>৳{order.paid.toLocaleString('en-US')}</T>
              </Row>
              <Row style={{ justifyContent: 'space-between', marginTop: 6 }}>
                <T weight="b" size={15}>মোট</T>
                <T weight="b" size={18} color={due > 0 ? colors.coral : colors.green}>
                  ৳{order.total.toLocaleString('en-US')}{due > 0 ? ` (বাকি ৳${due})` : ''}
                </T>
              </Row>
            </View>
          </Card>

          <Card tinted={colors.tealSoft} style={{ padding: 14, marginBottom: 12 }}>
            <Row gap={8}>
              <SathiBadge />
              <T weight="b" size={14} color={colors.tealDark}>সাথীর নোট</T>
            </Row>
            <T size={13.5} style={{ marginTop: 6, lineHeight: 20 }}>{order.sathiNote}</T>
          </Card>

          <Card style={{ padding: 14, marginBottom: 12 }}>
            <T weight="b" size={14}>টাইমলাইন</T>
            <View style={{ marginTop: 10 }}>
              {order.history.map((h, i) => (
                <Row key={i} gap={10} style={{ marginTop: i === 0 ? 0 : 10, alignItems: 'flex-start' }}>
                  <View style={{ alignItems: 'center' }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: i === 0 ? colors.green : colors.border,
                        marginTop: 4,
                      }}
                    />
                    {i < order.history.length - 1 ? (
                      <View style={{ width: 1.5, flex: 1, backgroundColor: colors.border2, minHeight: 18, marginTop: 2 }} />
                    ) : null}
                  </View>
                  <View style={{ flex: 1, paddingBottom: 4 }}>
                    <T weight="s" size={13}>{h.msg}</T>
                    <T size={11.5} color={colors.ink2}>{h.t}</T>
                  </View>
                </Row>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          padding: 12,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: colors.border2,
        }}
      >
        <View style={{ width: '100%', maxWidth: 720, alignSelf: 'center' }}>
          {order.status === 'ডেলিভার্ড' ? (
            <Btn
              kind="tealOutline"
              full
              label="রসিদ পাঠান"
              onPress={() => toast.show(`${order.cust}-কে রসিদ পাঠানো হয়েছে`, 'success')}
              iconLeft={<Ionicons name="receipt-outline" size={16} color={colors.tealDark} />}
            />
          ) : order.status === 'বাতিল' ? (
            <Btn
              kind="greyOutline"
              full
              label="বন্ধ করুন"
              onPress={onClose}
            />
          ) : (
            <Row gap={8}>
              <Btn
                kind="teal"
                full
                style={{ flex: 1 }}
                label={order.status === 'প্যাকিং' ? 'কুরিয়ারে দিন' : 'ডেলিভার্ড চিহ্নিত করুন'}
                onPress={advance}
                iconRight={<Ionicons name="arrow-forward" size={16} color="#fff" />}
              />
              <Btn
                kind="coralOutline"
                label="বাতিল"
                onPress={() => {
                  setOrder({ ...order, status: 'বাতিল', kind: 'coral', history: [{ t: 'এইমাত্র', msg: 'অর্ডার বাতিল হয়েছে' }, ...order.history] });
                  toast.show(`${order.id} বাতিল হয়েছে`, 'warn');
                }}
              />
            </Row>
          )}
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
