import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useResponsive } from '../components/AppFrame';
import { AppHeader } from '../components/AppHeader';
import { Btn, Card, Chip, Row, SathiBadge, SectionHeader, T } from '../components/atoms';
import { PillTabs } from '../components/PillTabs';
import { ResponsiveGrid, ScreenScroll } from '../components/ScreenContainer';
import { StatPill } from '../components/StatPill';
import { colors } from '../theme';

type TodayTab = 'today' | 'weekly';

export function HomeScreen({
  onOpenAgent,
  onOpenApprovals,
}: {
  onOpenAgent: () => void;
  onOpenApprovals: () => void;
}) {
  const { user } = useAuth();
  const [tab, setTab] = useState<TodayTab>('today');

  return (
    <View style={{ flex: 1 }}>
      <AppHeader
        title={
          <T weight="b" size={22}>
            সুপ্রভাত, {user?.bengaliName ?? 'রহিমা'}{' '}
            <T size={22}>👋</T>
          </T>
        }
        subtitle="সাথী আপনার ব্যবসা দেখছে"
        showAgentRunning
        onAgentPress={onOpenAgent}
        onNotificationPress={onOpenApprovals}
        notificationBadge
        avatarText={user?.avatarInitial ?? 'র'}
        avatarColor={user?.avatarColor ?? colors.saffron}
      />
      <PillTabs<TodayTab>
        tabs={[
          { id: 'today', label: 'আজকের খবর' },
          { id: 'weekly', label: 'সাপ্তাহিক পালস' },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === 'today' ? <HomeToday /> : <HomeWeekly />}
    </View>
  );
}

function HomeToday() {
  const { isDesktop } = useResponsive();
  return (
    <ScreenScroll>
      <Row gap={12}>
        <StatPill value="৳২,৪০০" label="আজকের আয়" tint={colors.greenSoft} valueColor={colors.green} />
        <StatPill value="৫টি" label="অর্ডার" />
        <StatPill value="৩টি" label="নতুন বার্তা" tint={colors.saffronSoft} valueColor={colors.saffron} />
      </Row>

      <SectionHeader title="আজকের ব্রিফিং" trailing={<T size={13} color={colors.tealDark} weight="b">সব →</T>} />

      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 2 }} gap={12}>
        <BriefCardUrgent />
        <BriefCardOpportunity />
        <BriefCardSathiDid />
        <BriefCardStock />
      </ResponsiveGrid>

      <View style={{ height: 14 }} />
      <Card tinted={colors.tealSoft} style={{ padding: 14 }}>
        <Row gap={12}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <T size={22}>🏦</T>
          </View>
          <View style={{ flex: 1 }}>
            <T weight="b" size={14}>সাপ্তাহিক PKSF রিপোর্ট পাঠানো হয়েছে</T>
            <Row gap={4} style={{ marginTop: 2 }}>
              <T size={12.5} color={colors.ink2}>আপনার ঋণ স্বাস্থ্য:</T>
              <T size={12.5} weight="b" color={colors.green}>ভালো</T>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green }} />
            </Row>
          </View>
        </Row>
      </Card>
    </ScreenScroll>
  );
}

function BriefCardUrgent() {
  return (
    <Card leftBar={colors.coral} style={{ padding: 16, flex: 1 }}>
      <Row gap={8}>
        <T size={22}>💬</T>
        <Chip kind="coral">জরুরি</Chip>
      </Row>
      <T weight="b" size={17} style={{ marginTop: 8, lineHeight: 24 }}>৩ জন কাস্টমার উত্তরের অপেক্ষায়</T>
      <T size={13.5} color={colors.ink2} style={{ marginTop: 4 }}>সাথী উত্তর দেওয়ার জন্য প্রস্তুত — আপনি শুধু অনুমোদন দিন</T>
      <Btn label="বার্তা দেখুন" full style={{ marginTop: 14 }} iconRight={<Ionicons name="arrow-forward" size={16} color="#fff" />} />
    </Card>
  );
}

function BriefCardOpportunity() {
  return (
    <Card leftBar={colors.green} style={{ padding: 16, flex: 1 }}>
      <Row gap={8}>
        <T size={22}>🔥</T>
        <Chip kind="green">সুযোগ</Chip>
      </Row>
      <T weight="b" size={17} style={{ marginTop: 8 }}>
        মিনি ফ্যানের চাহিদা <T weight="b" size={17} color={colors.green}>+৪৭%</T> বেড়েছে
      </T>
      <T size={13.5} color={colors.ink2} style={{ marginTop: 4 }}>
        এখন আনলে প্রতি পিসে <T size={13.5} weight="b" color={colors.green}>৳৩২০ লাভ</T>
      </T>
      <Row gap={4} style={{ height: 40, marginTop: 14, alignItems: 'flex-end' }}>
        {[10, 12, 14, 11, 18, 22, 30, 38].map((h, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: (`${h * 1.4}%`) as `${number}%`,
              backgroundColor: i >= 5 ? colors.green : '#cfe6d8',
              borderRadius: 3,
              minHeight: 6,
            }}
          />
        ))}
      </Row>
      <Btn kind="greenOutline" label="সুযোগ দেখুন" full style={{ marginTop: 14 }} iconRight={<Ionicons name="arrow-forward" size={16} color={colors.green} />} />
    </Card>
  );
}

function BriefCardSathiDid() {
  return (
    <Card leftBar={colors.teal} style={{ padding: 16, flex: 1 }}>
      <Row gap={8}>
        <SathiBadge />
        <Chip kind="teal">সাথী করেছে</Chip>
      </Row>
      <T weight="b" size={17} style={{ marginTop: 8 }}>২টি অর্ডার নিশ্চিত করা হয়েছে ✅</T>
      <T size={13.5} color={colors.ink2} style={{ marginTop: 4 }}>Pathao-তে পিকআপ রিকোয়েস্ট পাঠানো হয়েছে</T>
      <T size={13.5} color={colors.tealDark} weight="b" style={{ marginTop: 12 }}>অর্ডার দেখুন →</T>
    </Card>
  );
}

function BriefCardStock() {
  return (
    <Card leftBar={colors.amber} style={{ padding: 16, flex: 1 }}>
      <Row gap={8}>
        <T size={22}>📦</T>
        <Chip kind="amber">স্টক সতর্কতা</Chip>
      </Row>
      <T weight="b" size={17} style={{ marginTop: 8 }}>মিনি ফ্যান মাত্র ৮টি বাকি</T>
      <Row gap={6} style={{ marginTop: 6 }}>
        <SathiBadge size={18} />
        <T size={13} color={colors.ink2}>সাথীর পরামর্শ: এখনই রিঅর্ডার করুন</T>
      </Row>
      <Btn kind="amberOutline" label="রিঅর্ডার করুন" full style={{ marginTop: 14 }} iconRight={<Ionicons name="arrow-forward" size={16} color={colors.amber} />} />
    </Card>
  );
}

function HomeWeekly() {
  const days = ['সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি', 'রবি'];
  const heights = [38, 52, 44, 60, 92, 78, 70];
  const values = [2200, 2400, 2600, 2800, 3000, 3200, 3400];
  return (
    <ScreenScroll>
      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 2 }} gap={14}>
        <Card style={{ padding: 16 }}>
          <Row gap={8}>
            <SathiBadge />
            <T size={13} color={colors.ink2}>সাথীর সাপ্তাহিক সারসংক্ষেপ</T>
          </Row>
          <T size={13} color={colors.ink2} style={{ marginTop: 2 }}>৫ মে – ১১ মে, ২০২৬</T>
          <T weight="b" size={30} style={{ marginTop: 8 }}>৳১৮,৪০০</T>
          <Chip kind="green" style={{ marginTop: 6 }}>▲ গত সপ্তাহের চেয়ে ১৮% বেশি</Chip>

          <Row gap={4} style={{ marginTop: 18, height: 140, alignItems: 'flex-end' }}>
            {days.map((d, i) => (
              <View key={d} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
                <T size={10} color={colors.ink2}>৳{values[i]}</T>
                <View
                  style={{
                    width: 22,
                    height: heights[i],
                    backgroundColor: i === 6 ? colors.saffron : colors.teal,
                    borderRadius: 5,
                    opacity: i === 6 ? 1 : 0.9,
                  }}
                />
                <T size={11} weight={i === 6 ? 'b' : 'r'} color={colors.ink2}>{d}</T>
              </View>
            ))}
          </Row>

          <View style={{ height: 1, backgroundColor: colors.border2, marginVertical: 14 }} />
          <Row gap={8}>
            <View style={{ flex: 1 }}>
              <T weight="b" size={18}>৩২</T>
              <T size={12} color={colors.ink2}>অর্ডার</T>
            </View>
            <View style={{ flex: 1 }}>
              <T weight="b" size={18}>৪৭</T>
              <T size={12} color={colors.ink2}>কাস্টমার</T>
            </View>
            <View style={{ flex: 1 }}>
              <T weight="b" size={18} color={colors.coral}>৳৫,২০০</T>
              <T size={12} color={colors.ink2}>খরচ</T>
            </View>
          </Row>
        </Card>

        <Card style={{ padding: 16 }}>
          <T weight="b" size={15}>PKSF স্কোর ট্রেন্ড</T>
          <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
            <T weight="b" size={32} color={colors.green}>৭২ / ১০০</T>
            <Chip kind="green">▲ +৪</Chip>
          </Row>
          <Row gap={3} style={{ marginTop: 18, height: 60, alignItems: 'flex-end' }}>
            {[20, 23, 28, 30, 36, 40, 50, 60].map((h, i) => (
              <View key={i} style={{ flex: 1, height: h, backgroundColor: i >= 6 ? colors.green : colors.tealSoft, borderRadius: 3 }} />
            ))}
          </Row>
          <Row style={{ justifyContent: 'space-between', marginTop: 6 }}>
            <T size={11} color={colors.ink2}>মার্চ</T>
            <T size={11} color={colors.ink2}>এপ্রিল</T>
            <T size={11} color={colors.ink2}>মে</T>
          </Row>
        </Card>
      </ResponsiveGrid>

      <SectionHeader title="সবচেয়ে বিক্রিত পণ্য" />
      <Card style={{ padding: 4 }}>
        {[
          { e: '🌀', n: 'মিনি ইউএসবি ফ্যান', c: 14, r: '৳১১,২০০' },
          { e: '💡', n: 'রিচার্জেবল হ্যান্ড ফ্যান', c: 9, r: '৳৪,৫০০' },
          { e: '👜', n: 'কুলিং কুশন', c: 6, r: '৳২,৭০০' },
        ].map((p, i, arr) => (
          <Row
            key={i}
            gap={12}
            style={{
              padding: 12,
              borderBottomWidth: i < arr.length - 1 ? 1 : 0,
              borderBottomColor: colors.border2,
            }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: colors.border2, alignItems: 'center', justifyContent: 'center' }}>
              <T size={22}>{p.e}</T>
            </View>
            <View style={{ flex: 1 }}>
              <T weight="s" size={14}>{p.n}</T>
              <T size={12.5} color={colors.ink2}>{p.c} টি বিক্রি</T>
            </View>
            <T weight="b" size={14} color={colors.green}>{p.r}</T>
          </Row>
        ))}
      </Card>
    </ScreenScroll>
  );
}
