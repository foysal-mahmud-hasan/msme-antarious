import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { colors } from '../theme';

export function PKSFReportScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  const actions = useActions();
  const toast = useToast();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
            <Ionicons name={isDesktop ? 'close' : 'arrow-back'} size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>বিস্তারিত PKSF রিপোর্ট</T>
            <T size={12} color={colors.ink2}>৫ মে – ১১ মে, ২০২৬</T>
          </View>
          <Pressable onPress={() => toast.show('PDF ডাউনলোড শুরু হয়েছে', 'success')} hitSlop={6} style={iconBtn}>
            <Ionicons name="download-outline" size={18} color={colors.ink} />
          </Pressable>
        </Row>
      </View>

      <ScrollView contentContainerStyle={{ padding: isDesktop ? 24 : 14, paddingBottom: 100, alignItems: 'stretch' }}>
        <View style={{ width: '100%', maxWidth: 760, alignSelf: 'center' }}>
          {/* Score hero */}
          <Card tinted={colors.tealSoft} style={{ padding: 18, marginBottom: 14 }}>
            <Row gap={14} style={{ alignItems: 'center' }}>
              <View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <T size={28}>🏦</T>
              </View>
              <View style={{ flex: 1 }}>
                <T size={12} color={colors.ink2}>সামগ্রিক স্কোর</T>
                <Row gap={6} style={{ alignItems: 'baseline' }}>
                  <T weight="b" size={40} color={colors.green}>৭২০</T>
                  <T size={16} color={colors.ink2}>/ ১০০০</T>
                </Row>
                <Row gap={8}>
                  <Chip kind="green" size={11}>▲ +৪ এই মাসে</Chip>
                  <Chip kind="teal" size={11}>র‍্যাঙ্ক: ২য় কোয়ার্টাইল</Chip>
                </Row>
              </View>
            </Row>
            <View style={{ height: 10, backgroundColor: '#e4f4f1', borderRadius: 5, marginTop: 16, overflow: 'hidden', flexDirection: 'row' }}>
              <View style={{ width: '72%', height: '100%', backgroundColor: colors.tealDark, borderRadius: 5 }} />
            </View>
            <T size={11.5} color={colors.ink2} style={{ marginTop: 6 }}>
              ৫০০-এর উপরে = ঋণ-যোগ্য · ৭০০-এর উপরে = অগ্রাধিকার পাবেন
            </T>
          </Card>

          {/* Component breakdown */}
          <Card style={{ padding: 16, marginBottom: 14 }}>
            <T weight="b" size={14}>স্কোর বিশ্লেষণ</T>
            {[
              { l: 'নিয়মিত আয়', v: 85, w: '২৫%', d: 'গড় মাসিক বিক্রি ৳২৮,৪০০ · স্থির বৃদ্ধি' },
              { l: 'হিসাব রক্ষণ', v: 78, w: '২০%', d: 'দৈনিক লেনদেন লেখা · ৯০% নিয়মিত' },
              { l: 'গ্রাহক বৃদ্ধি', v: 64, w: '২৫%', d: '৩ মাসে ৪৭ → ৫৮ সক্রিয় গ্রাহক' },
              { l: 'ডিজিটাল উপস্থিতি', v: 58, w: '১৫%', d: 'Facebook + WhatsApp সক্রিয় · অনলাইন মার্কেটপ্লেস বাকি' },
              { l: 'সময়মতো পরিশোধ', v: 91, w: '১৫%', d: 'গত ১২ কিস্তির ১২টিই সময়মতো' },
            ].map((m, i, arr) => (
              <View key={m.l} style={{ marginTop: 14, paddingBottom: i === arr.length - 1 ? 0 : 14, borderBottomWidth: i === arr.length - 1 ? 0 : 1, borderBottomColor: colors.border2 }}>
                <Row style={{ justifyContent: 'space-between', marginBottom: 6 }}>
                  <View>
                    <T weight="s" size={13.5}>{m.l}</T>
                    <T size={11.5} color={colors.ink2}>ওজন: {m.w}</T>
                  </View>
                  <T weight="b" size={16} color={m.v >= 70 ? colors.green : m.v >= 60 ? colors.amber : colors.coral}>
                    {m.v}
                  </T>
                </Row>
                <View style={{ height: 6, backgroundColor: colors.border2, borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ width: (`${m.v}%`) as `${number}%`, height: '100%', backgroundColor: m.v >= 70 ? colors.green : m.v >= 60 ? colors.amber : colors.coral }} />
                </View>
                <T size={12} color={colors.ink2} style={{ marginTop: 6 }}>{m.d}</T>
              </View>
            ))}
          </Card>

          {/* Trend */}
          <Card style={{ padding: 16, marginBottom: 14 }}>
            <Row style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <T weight="b" size={14}>৬ মাসের ট্রেন্ড</T>
              <Chip kind="green" size={11}>+৭% YoY</Chip>
            </Row>
            <Row gap={6} style={{ marginTop: 8, height: 110, alignItems: 'flex-end' }}>
              {[
                { m: 'ডিস', v: 540 },
                { m: 'জানু', v: 580 },
                { m: 'ফেব', v: 620 },
                { m: 'মার্চ', v: 650 },
                { m: 'এপ্রি', v: 690 },
                { m: 'মে', v: 720 },
              ].map((b, i, arr) => (
                <View key={b.m} style={{ flex: 1, alignItems: 'center', gap: 4 }}>
                  <T size={10} color={colors.ink2}>{b.v}</T>
                  <View
                    style={{
                      width: 20,
                      height: (b.v - 500) * 0.25,
                      backgroundColor: i === arr.length - 1 ? colors.green : colors.teal,
                      borderRadius: 4,
                      opacity: i === arr.length - 1 ? 1 : 0.85,
                    }}
                  />
                  <T size={11} weight={i === arr.length - 1 ? 'b' : 'r'} color={colors.ink2}>{b.m}</T>
                </View>
              ))}
            </Row>
          </Card>

          {/* Loan eligibility */}
          <Card tinted={colors.greenSoft} style={{ padding: 16, marginBottom: 14 }}>
            <Row gap={8}>
              <Ionicons name="checkmark-circle" size={22} color={colors.green} />
              <T weight="b" size={15} color={colors.green}>ঋণ-যোগ্যতা: অনুমোদিত</T>
            </Row>
            <Row gap={10} style={{ marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <T size={11} color={colors.ink2}>সর্বোচ্চ বরাদ্দ</T>
                <T weight="b" size={20} color={colors.green}>৳৫০,০০০</T>
              </View>
              <View style={{ flex: 1 }}>
                <T size={11} color={colors.ink2}>মেয়াদ</T>
                <T weight="b" size={20}>১২ মাস</T>
              </View>
              <View style={{ flex: 1 }}>
                <T size={11} color={colors.ink2}>সম্ভাব্য সুদ</T>
                <T weight="b" size={20}>৯%</T>
              </View>
            </Row>
            <T size={12.5} color={colors.ink2} style={{ marginTop: 10 }}>
              PO অফিসার <T weight="b">মাসুদ রানা</T> চূড়ান্ত অনুমোদন দেবেন। আপনার রিপোর্ট পাঠানো হয়েছে।
            </T>
          </Card>

          {/* Action plan */}
          <Card style={{ padding: 16, marginBottom: 14 }}>
            <Row gap={8}>
              <SathiBadge />
              <T weight="b" size={14}>স্কোর বাড়ানোর জন্য করণীয়</T>
            </Row>
            {[
              { e: '📷', t: 'অন্তত ১০টি পণ্যের ছবি তুলুন', sub: 'ডিজিটাল উপস্থিতি +৮ পয়েন্ট' },
              { e: '🛒', t: 'Daraz / Foodi-তে অ্যাকাউন্ট খুলুন', sub: 'গ্রাহক বৃদ্ধি +১০ পয়েন্ট' },
              { e: '📒', t: 'প্রতিদিন বিক্রি লিখুন (৭ দিন স্ট্রিক)', sub: 'হিসাব রক্ষণ +৫ পয়েন্ট' },
            ].map((s, i, arr) => (
              <Row
                key={s.t}
                gap={12}
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: colors.border2,
                }}
              >
                <T size={22}>{s.e}</T>
                <View style={{ flex: 1 }}>
                  <T weight="s" size={13.5}>{s.t}</T>
                  <T size={12} color={colors.green}>{s.sub}</T>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.ink2} />
              </Row>
            ))}
          </Card>

          <Row gap={8}>
            <Btn
              kind="teal"
              full
              style={{ flex: 1 }}
              label="সাথীকে জিজ্ঞেস করুন"
              onPress={() => actions.openOverlay('sathi', 'আমার PKSF রিপোর্ট বিশ্লেষণ করো')}
              iconRight={<Ionicons name="arrow-forward" size={16} color="#fff" />}
            />
            <Btn
              kind="greyOutline"
              label="PDF"
              onPress={() => toast.show('PDF ডাউনলোড শুরু হয়েছে', 'success')}
              iconLeft={<Ionicons name="download-outline" size={16} color={colors.ink2} />}
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
