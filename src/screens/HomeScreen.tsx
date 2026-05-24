import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useAuth } from '../auth/AuthContext';
import { AppHeader } from '../components/AppHeader';
import { Btn, Card, Chip, Row, SathiBadge, SectionHeader, T } from '../components/atoms';
import { PillTabs } from '../components/PillTabs';
import { ResponsiveGrid, ScreenScroll } from '../components/ScreenContainer';
import { StatPill } from '../components/StatPill';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { colors } from '../theme';

type TodayTab = 'today' | 'weekly';

export function HomeScreen() {
  const { user } = useAuth();
  const actions = useActions();
  const tab = (actions.getSubTab('home') as TodayTab) || 'today';

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
        onAgentPress={() => actions.openOverlay('agent')}
        onNotificationPress={() => actions.openOverlay('approvals')}
        notificationBadge
        avatarText={user?.avatarInitial ?? 'র'}
        avatarColor={user?.avatarColor ?? colors.saffron}
        onAvatarPress={() => actions.goto('more')}
      />
      <PillTabs<TodayTab>
        tabs={[
          { id: 'today', label: 'আজকের খবর' },
          { id: 'weekly', label: 'সাপ্তাহিক পালস' },
        ]}
        active={tab}
        onChange={(t) => actions.setSubTab('home', t)}
      />
      {tab === 'today' ? <HomeToday /> : <HomeWeekly />}
    </View>
  );
}

function HomeToday() {
  const actions = useActions();
  return (
    <ScreenScroll>
      <CreditHero onPress={() => actions.openOverlay('credit')} />
      <View style={{ height: 14 }} />
      <SathiMorningBrief
        onOpenAcc={() => actions.goto('finance')}
        onOpenAgent={() => actions.openOverlay('agent')}
      />
      <View style={{ height: 14 }} />

      <Row gap={12}>
        <StatPill value="৳২,৪০০" label="আজকের আয়" tint={colors.greenSoft} valueColor={colors.green} />
        <StatPill value="৫টি" label="অর্ডার" />
        <StatPill value="৩টি" label="নতুন বার্তা" tint={colors.saffronSoft} valueColor={colors.saffron} />
      </Row>

      <SectionHeader
        title="আজকের ব্রিফিং"
        trailing={
          <Pressable onPress={() => actions.openOverlay('approvals')} hitSlop={6}>
            <T size={13} color={colors.tealDark} weight="b">সব →</T>
          </Pressable>
        }
      />

      <ResponsiveGrid columns={{ mobile: 1, tablet: 2, desktop: 2 }} gap={12}>
        <BriefCardUrgent />
        <BriefCardOpportunity />
        <BriefCardSathiDid />
        <BriefCardStock />
      </ResponsiveGrid>

      <View style={{ height: 14 }} />
      <Pressable onPress={() => actions.openOverlay('lender')}>
        <Card tinted={colors.tealSoft} style={{ padding: 14 }}>
          <Row gap={12}>
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <T size={22}>🏦</T>
            </View>
            <View style={{ flex: 1 }}>
              <T weight="b" size={14}>সাপ্তাহিক রিপোর্ট পাঠানো হয়েছে</T>
              <Row gap={4} style={{ marginTop: 2 }}>
                <T size={12.5} color={colors.ink2}>BRAC মাইক্রোফিন্যান্স · ঋণ স্বাস্থ্য:</T>
                <T size={12.5} weight="b" color={colors.green}>উত্তম</T>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.green }} />
              </Row>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.ink2} />
          </Row>
        </Card>
      </Pressable>

      <SectionHeader title="সাথীর সাথে আরও করুন" />
      <ResponsiveGrid columns={{ mobile: 2, tablet: 2, desktop: 4 }} gap={10}>
        <ExploreTile
          emoji="📊"
          label="অটো হিসাব"
          sub="সব লেনদেন স্বয়ংক্রিয়"
          bg={colors.greenSoft}
          fg={colors.green}
          onPress={() => actions.goto('finance')}
        />
        <ExploreTile
          emoji="🎨"
          label="ব্র্যান্ড স্টুডিও"
          sub="লোগো · রঙ · কণ্ঠ"
          bg={colors.saffronSoft}
          fg={colors.saffronDark}
          badge="Pro"
          onPress={() => actions.openOverlay('brand')}
        />
        <ExploreTile
          emoji="🌐"
          label="ওয়েবসাইট"
          sub="৬টি টেমপ্লেট থেকে বেছে নিন"
          bg="rgba(139,92,246,0.1)"
          fg="#7c3aed"
          badge="Premium"
          onPress={() => actions.openOverlay('website')}
        />
        <ExploreTile
          emoji="💎"
          label="আপগ্রেড"
          sub="আরও ফিচার আনলক করুন"
          bg="rgba(14,165,233,0.1)"
          fg="#0284c7"
          onPress={() => actions.openOverlay('pricing')}
        />
      </ResponsiveGrid>
    </ScreenScroll>
  );
}

function CreditHero({ onPress }: { onPress: () => void }) {
  const score = 720;
  const max = 1000;
  const radius = 40;
  const C = 2 * Math.PI * radius;
  const offset = C * (1 - score / max);
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor: '#2d1b3d',
          borderRadius: 22,
          padding: 18,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -40,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: 'rgba(232,130,12,0.18)',
          }}
        />
        <Row gap={14}>
          <View style={{ width: 80, height: 80 }}>
            <Svg width={80} height={80} viewBox="0 0 100 100">
              <Defs>
                <LinearGradient id="homeRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor={colors.saffron} />
                  <Stop offset="100%" stopColor="#22c55e" />
                </LinearGradient>
              </Defs>
              <Circle cx="50" cy="50" r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth={7} fill="none" />
              <Circle
                cx="50"
                cy="50"
                r={radius}
                stroke="url(#homeRing)"
                strokeWidth={7}
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${C}, ${C}`}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
              />
            </Svg>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
              <T weight="b" color="#fff" size={22}>৭২০</T>
              <T size={9} color="rgba(255,255,255,0.7)">/ ১০০০</T>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <T size={10.5} color="rgba(255,255,255,0.7)" weight="b">আরোপণ ক্রেডিট স্কোর</T>
            <T weight="b" size={18} color="#fff" style={{ marginTop: 2 }}>উত্তম স্তর · ঋণ-যোগ্য</T>
            <Row gap={8} style={{ marginTop: 8 }}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: colors.green }}>
                <T weight="b" size={11} color="#fff">▲ +৪০ এ মাসে</T>
              </View>
              <T size={11} color="rgba(255,255,255,0.8)">লক্ষ্য ৮৫০</T>
            </Row>
          </View>
          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.6)" />
        </Row>
      </View>
    </Pressable>
  );
}

function SathiMorningBrief({ onOpenAcc, onOpenAgent }: { onOpenAcc: () => void; onOpenAgent: () => void }) {
  return (
    <Card tinted={colors.tealSoft} style={{ padding: 14 }}>
      <Row gap={8} style={{ alignItems: 'center' }}>
        <SathiBadge size={28} />
        <View style={{ flex: 1 }}>
          <T weight="b" size={14} color={colors.tealDark}>সাথীর সকালের ব্রিফ</T>
          <T size={11} color={colors.ink2}>সকাল ৮:৪১ · আজই আপডেট</T>
        </View>
        <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: colors.green }}>
          <T weight="b" size={10} color="#fff">● সক্রিয়</T>
        </View>
      </Row>
      <T size={13.5} color={colors.ink} style={{ marginTop: 8, lineHeight: 22 }}>
        সুপ্রভাত! 🌅 আজ এখন পর্যন্ত{' '}
        <T weight="b" color={colors.green} size={13.5}>৭টি লেনদেন</T> ধরেছি (৳২,৪০০ আয়)। গতকাল ক্রেডিট স্কোর{' '}
        <T weight="b" color={colors.green} size={13.5}>+৪</T> বেড়েছে। ৩টি কাস্টমার মেসেজের অপেক্ষায় — উত্তর তৈরি আছে।
      </T>
      <Row gap={8} style={{ marginTop: 12 }}>
        <Btn kind="primary" size="sm" label="📊 আজকের হিসাব" onPress={onOpenAcc} />
        <Btn kind="greyOutline" size="sm" label="সাথীর সাথে কথা →" onPress={onOpenAgent} />
      </Row>
    </Card>
  );
}

function ExploreTile({
  emoji,
  label,
  sub,
  bg,
  fg,
  badge,
  onPress,
}: {
  emoji: string;
  label: string;
  sub: string;
  bg: string;
  fg: string;
  badge?: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ flex: 1 }}>
      <Card tinted={bg} style={{ padding: 14, minHeight: 96 }}>
        <T size={26}>{emoji}</T>
        <T weight="b" size={14} color={fg} style={{ marginTop: 6 }}>{label}</T>
        <T size={11.5} color={colors.ink2} style={{ marginTop: 2 }}>{sub}</T>
        {badge ? (
          <View
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 6,
              backgroundColor: '#1A1A2E',
            }}
          >
            <T weight="b" size={9} color="#fff">{badge}</T>
          </View>
        ) : null}
      </Card>
    </Pressable>
  );
}

function BriefCardUrgent() {
  const actions = useActions();
  return (
    <Card leftBar={colors.coral} style={{ padding: 16, flex: 1 }}>
      <Row gap={8}>
        <T size={22}>💬</T>
        <Chip kind="coral">জরুরি</Chip>
      </Row>
      <T weight="b" size={17} style={{ marginTop: 8, lineHeight: 24 }}>৩ জন কাস্টমার উত্তরের অপেক্ষায়</T>
      <T size={13.5} color={colors.ink2} style={{ marginTop: 4 }}>সাথী উত্তর দেওয়ার জন্য প্রস্তুত — আপনি শুধু অনুমোদন দিন</T>
      <Btn
        label="বার্তা দেখুন"
        full
        style={{ marginTop: 14 }}
        onPress={() => actions.goto('messages', 'inbox')}
        iconRight={<Ionicons name="arrow-forward" size={16} color="#fff" />}
      />
    </Card>
  );
}

function BriefCardOpportunity() {
  const actions = useActions();
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
      <Btn
        kind="greenOutline"
        label="সুযোগ দেখুন"
        full
        style={{ marginTop: 14 }}
        onPress={() => actions.goto('market', 'opp')}
        iconRight={<Ionicons name="arrow-forward" size={16} color={colors.green} />}
      />
    </Card>
  );
}

function BriefCardSathiDid() {
  const actions = useActions();
  return (
    <Card leftBar={colors.teal} style={{ padding: 16, flex: 1 }}>
      <Row gap={8}>
        <SathiBadge />
        <Chip kind="teal">সাথী করেছে</Chip>
      </Row>
      <T weight="b" size={17} style={{ marginTop: 8 }}>২টি অর্ডার নিশ্চিত করা হয়েছে ✅</T>
      <T size={13.5} color={colors.ink2} style={{ marginTop: 4 }}>Pathao-তে পিকআপ রিকোয়েস্ট পাঠানো হয়েছে</T>
      <Pressable onPress={() => actions.goto('messages', 'orders')} style={{ marginTop: 12 }} hitSlop={6}>
        <T size={13.5} color={colors.tealDark} weight="b">অর্ডার দেখুন →</T>
      </Pressable>
    </Card>
  );
}

function BriefCardStock() {
  const actions = useActions();
  const toast = useToast();
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
      <Btn
        kind="amberOutline"
        label="রিঅর্ডার করুন"
        full
        style={{ marginTop: 14 }}
        onPress={() => {
          toast.show('সাথীকে জিজ্ঞেস করুন — রহমান ট্রেডার্স থেকে রিঅর্ডার সাজানো হচ্ছে…', 'success');
          actions.openOverlay('sathi', 'রিঅর্ডার করব কী?');
        }}
        iconRight={<Ionicons name="arrow-forward" size={16} color={colors.amber} />}
      />
    </Card>
  );
}

function HomeWeekly() {
  const actions = useActions();
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

        <Pressable onPress={() => actions.goto('finance', 'pksf')}>
          <Card style={{ padding: 16 }}>
            <Row style={{ justifyContent: 'space-between' }}>
              <T weight="b" size={15}>PKSF স্কোর ট্রেন্ড</T>
              <Ionicons name="open-outline" size={16} color={colors.ink2} />
            </Row>
            <Row style={{ justifyContent: 'space-between', marginTop: 8 }}>
              <T weight="b" size={32} color={colors.green}>৭২০ / ১০০০</T>
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
        </Pressable>
      </ResponsiveGrid>

      <SectionHeader title="সবচেয়ে বিক্রিত পণ্য" />
      <Card style={{ padding: 4 }}>
        {[
          { e: '🌀', n: 'মিনি ইউএসবি ফ্যান', c: 14, r: '৳১১,২০০' },
          { e: '💡', n: 'রিচার্জেবল হ্যান্ড ফ্যান', c: 9, r: '৳৪,৫০০' },
          { e: '👜', n: 'কুলিং কুশন', c: 6, r: '৳২,৭০০' },
        ].map((p, i, arr) => (
          <Pressable key={i} onPress={() => actions.goto('finance', 'inv')}>
            <Row
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
          </Pressable>
        ))}
      </Card>
    </ScreenScroll>
  );
}
