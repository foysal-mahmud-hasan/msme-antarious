import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { AppHeader } from '../components/AppHeader';
import { Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { PillTabs } from '../components/PillTabs';
import { ResponsiveGrid, ScreenScroll } from '../components/ScreenContainer';
import { StatPill } from '../components/StatPill';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { colors } from '../theme';

type Tab = 'today' | 'weekly';

export function OfflineHomeScreen() {
  const { user } = useAuth();
  const actions = useActions();
  const toast = useToast();
  const tab = (actions.getSubTab('home') as Tab) || 'today';
  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#1f2937', paddingVertical: 6, alignItems: 'center' }}>
        <Row gap={6}>
          <Ionicons name="cloud-offline" size={12} color="#fbbf24" />
          <T size={11} color="#fbbf24" weight="b">অফলাইন মোড সক্রিয় · সিঙ্ক অপেক্ষমান</T>
        </Row>
      </View>
      <AppHeader
        title={
          <T weight="b" size={22}>
            সুপ্রভাত, {user?.bengaliName ?? 'রহিমা'} 👋
          </T>
        }
        subtitle="সাথী হিসাব রাখছে · অফলাইন মোড"
        showAgentRunning
        onAgentPress={() => actions.openOverlay('agent')}
        onNotificationPress={() => actions.openOverlay('approvals')}
        notificationBadge
        avatarText={user?.avatarInitial ?? 'র'}
        avatarColor={user?.avatarColor ?? colors.saffron}
        onAvatarPress={() => actions.goto('more')}
      />
      <PillTabs<Tab>
        tabs={[
          { id: 'today', label: 'আজকের খবর' },
          { id: 'weekly', label: 'সাপ্তাহিক পালস' },
        ]}
        active={tab}
        onChange={(t) => actions.setSubTab('home', t)}
      />
      <ScreenScroll>
        <Row gap={8}>
          <StatPill value="৳১,৪০০" label="আজ এ পর্যন্ত" tint={colors.greenSoft} valueColor={colors.green} />
          <StatPill value="৭টি" label="বিক্রি" />
          <StatPill value="৳৪,৮৫০" label="বাকি" tint={colors.amberSoft} valueColor={colors.amber} />
        </Row>

        <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 2 }} gap={12}>
          <Card leftBar={colors.saffron} style={{ padding: 16, backgroundColor: '#fff8ec' }}>
            <Row gap={8}>
              <T size={22}>💰</T>
              <Chip kind="saffron">আজকের বিক্রি</Chip>
            </Row>
            <T weight="b" size={17} style={{ marginTop: 8 }}>আজকের বিক্রি লিখুন</T>
            <T size={13.5} color={colors.ink2} style={{ marginTop: 4 }}>
              আজ এখন পর্যন্ত: <T weight="b" color={colors.green}>৳১,৪০০</T> · ৭টি বিক্রি
            </T>
            <Btn label="বিক্রি যোগ করুন" full style={{ marginTop: 14 }} onPress={() => actions.openOverlay('sale')} iconLeft={<Ionicons name="add" size={18} color="#fff" />} />
          </Card>

          <Card leftBar={colors.amber} style={{ padding: 16 }}>
            <Row gap={8}>
              <T size={22}>🛒</T>
              <Chip kind="amber">হাট প্রস্তুতি</Chip>
            </Row>
            <T weight="b" size={17} style={{ marginTop: 8 }}>
              পরের হাট: <T weight="b" size={17} color={colors.amber}>৩ দিন বাকি</T>
            </T>
            <T size={13.5} color={colors.ink2} style={{ marginTop: 4 }}>
              শনিবার · কী নিয়ে যাবেন সাথী মনে করিয়ে দেবে
            </T>
            <Row gap={6} style={{ marginTop: 12 }}>
              {[
                { d: 'বৃহঃ', l: '২ দিন', active: false },
                { d: 'শুক্র', l: '১ দিন', active: false },
                { d: 'শনি', l: 'হাট', active: true },
              ].map((c) => (
                <View
                  key={c.d}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 8,
                    backgroundColor: c.active ? colors.saffron : '#fff',
                    borderWidth: c.active ? 0 : 1,
                    borderColor: colors.border2,
                    borderRadius: 10,
                  }}
                >
                  <T size={11} weight="m" color={c.active ? 'rgba(255,255,255,0.9)' : colors.ink2}>{c.l}</T>
                  <T weight="b" size={13} color={c.active ? '#fff' : colors.ink}>{c.d}</T>
                </View>
              ))}
            </Row>
            <Btn kind="amberOutline" label="প্রস্তুতি দেখুন" full style={{ marginTop: 14 }} onPress={() => actions.openOverlay('haat')} iconRight={<Ionicons name="arrow-forward" size={16} color={colors.amber} />} />
          </Card>

          <Card leftBar={colors.coral} style={{ padding: 16 }}>
            <Row gap={8}>
              <T size={22}>📒</T>
              <Chip kind="coral">বাকি হিসাব</Chip>
            </Row>
            <T weight="b" size={17} style={{ marginTop: 8 }}>
              ৭ জনের কাছে <T weight="b" size={17} color={colors.coral}>৳৪,৮৫০</T> বাকি
            </T>
            <T size={13.5} color={colors.ink2} style={{ marginTop: 4 }}>
              রহিম মিয়া ৩০+ দিন ধরে · মনে করিয়ে দিন
            </T>
            <Btn kind="coralOutline" label="কাস্টমার খাতা" full style={{ marginTop: 14 }} onPress={() => actions.openOverlay('ledger')} iconRight={<Ionicons name="arrow-forward" size={16} color={colors.coral} />} />
          </Card>

          <Card leftBar={colors.teal} style={{ padding: 16, backgroundColor: '#f0fdfa' }}>
            <Row gap={8}>
              <SathiBadge />
              <Chip kind="teal">আপনার ডিজিটাল যাত্রা</Chip>
            </Row>
            <T weight="b" size={17} style={{ marginTop: 8 }}>১ / ৬ ধাপ সম্পন্ন</T>
            <View style={{ height: 10, backgroundColor: '#e4f4f1', borderRadius: 5, marginTop: 12, overflow: 'hidden' }}>
              <View style={{ width: ('17%') as `${number}%`, height: '100%', backgroundColor: colors.teal, borderRadius: 5 }} />
            </View>
            <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
              {[
                { l: '✅ হিসাব', a: true },
                { l: '📷 ছবি', a: false },
                { l: '📘 FB', a: false },
                { l: '💬 WA', a: false },
                { l: '🚚 অর্ডার', a: false },
                { l: '🛒 Daraz', a: false },
              ].map((s) => (
                <T key={s.l} size={10.5} color={colors.ink2} style={{ opacity: s.a ? 1 : 0.5 }}>{s.l}</T>
              ))}
            </Row>
            <T size={13} color={colors.ink2} style={{ marginTop: 14 }}>পরবর্তী পদক্ষেপ:</T>
            <T weight="b" size={15}>প্রথম Facebook পোস্ট দিন</T>
            <Btn kind="teal" label="সাথীর সাহায্য নিন" full style={{ marginTop: 12 }} onPress={() => actions.openOverlay('journey')} iconRight={<Ionicons name="arrow-forward" size={16} color="#fff" />} />
          </Card>
        </ResponsiveGrid>

        <Pressable
          onPress={() => {
            toast.show('PKSF রিপোর্ট তৈরি চলছে — ৩ দিনের মধ্যে পাঠানো হবে', 'info');
          }}
        >
          <Card tinted={colors.tealSoft} style={{ padding: 14, marginTop: 14 }}>
            <Row gap={12}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <T size={22}>🏦</T>
              </View>
              <View style={{ flex: 1 }}>
                <T weight="b" size={14}>এই সপ্তাহের রিপোর্ট তৈরি হচ্ছে ✓</T>
                <T size={12.5} color={colors.ink2}>৪২টি বিক্রি · ৩ দিনের মধ্যে PKSF-কে পাঠানো হবে</T>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.ink2} />
            </Row>
          </Card>
        </Pressable>
      </ScreenScroll>
    </View>
  );
}
