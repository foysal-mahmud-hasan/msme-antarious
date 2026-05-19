import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useResponsive } from '../components/AppFrame';
import { Avatar, PulseDot, Row, T } from '../components/atoms';
import { AgentLiveScreen, ApprovalsScreen, AutopilotScreen } from '../screens/AgentScreens';
import { FinanceScreen } from '../screens/FinanceScreen';
import { HaatPrepScreen } from '../screens/HaatPrepScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { JourneyScreen } from '../screens/JourneyScreen';
import { LedgerScreen } from '../screens/LedgerScreen';
import { MarketScreen } from '../screens/MarketScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { OfflineHomeScreen } from '../screens/OfflineHomeScreen';
import { POPortalScreen } from '../screens/POPortalScreen';
import { QuickSaleScreen } from '../screens/QuickSaleScreen';
import { SathiChatScreen } from '../screens/SathiChatScreen';
import { colors } from '../theme';

type RouteId = 'home' | 'messages' | 'market' | 'finance' | 'more';
type Overlay =
  | null
  | 'sathi'
  | 'agent'
  | 'autopilot'
  | 'approvals'
  | 'sale'
  | 'haat'
  | 'ledger'
  | 'journey'
  | 'po';

export function DesktopShell() {
  const { user, offline } = useAuth();
  const [route, setRoute] = useState<RouteId>('home');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const { width } = useResponsive();
  const sidebarWidth = width >= 1280 ? 260 : 220;

  const openAgent = () => setOverlay('agent');
  const openApprovals = () => setOverlay('approvals');
  const close = () => setOverlay(null);
  const back = (to: Overlay) => setOverlay(to);

  const items: { id: RouteId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'home', label: 'হোম · Home', icon: 'home-outline' },
    { id: 'messages', label: 'বার্তা · Messages', icon: 'chatbubble-outline' },
    { id: 'market', label: 'বাজার · Market', icon: 'storefront-outline' },
    { id: 'finance', label: 'হিসাব · Finance', icon: 'stats-chart-outline' },
    { id: 'more', label: 'আরও · More', icon: 'ellipsis-horizontal' },
  ];

  return (
    <View style={styles.shell}>
      {/* Sidebar */}
      <View style={[styles.sidebar, { width: sidebarWidth }]}>
        <View style={{ padding: 18, paddingBottom: 12 }}>
          <Row gap={10}>
            <View style={styles.logoTile}>
              <T weight="b" color="#fff" size={20}>উ</T>
            </View>
            <View>
              <T weight="b" size={16}>উদ্যোম</T>
              <T size={10.5} color={colors.ink2}>Uddyom · MSME</T>
            </View>
          </Row>
        </View>

        <View style={{ paddingHorizontal: 10, paddingTop: 6, gap: 2 }}>
          {items.map((it) => {
            const active = route === it.id;
            return (
              <Pressable
                key={it.id}
                onPress={() => setRoute(it.id)}
                style={[styles.navItem, active ? styles.navItemActive : null]}
              >
                <Ionicons name={it.icon} size={18} color={active ? colors.saffron : colors.ink} />
                <T weight={active ? 'b' : 'm'} size={13.5} color={active ? colors.saffron : colors.ink}>
                  {it.label}
                </T>
              </Pressable>
            );
          })}
        </View>

        <View style={{ height: 1, backgroundColor: colors.border2, marginVertical: 14, marginHorizontal: 14 }} />

        <View style={{ paddingHorizontal: 10, gap: 2 }}>
          <Pressable onPress={openAgent} style={styles.navItem}>
            <PulseDot size={8} />
            <T weight="b" size={13} color={colors.tealDark}>সাথী চলছে · Live</T>
          </Pressable>
          <Pressable onPress={openApprovals} style={styles.navItem}>
            <View style={{ position: 'relative' }}>
              <Ionicons name="notifications-outline" size={18} color={colors.ink} />
              <View style={styles.dotBadge} />
            </View>
            <T weight="m" size={13.5}>অনুমোদন · Approvals</T>
            <View style={{ flex: 1 }} />
            <View style={styles.countPill}>
              <T size={11} weight="b" color="#fff">৩</T>
            </View>
          </Pressable>
          <Pressable onPress={() => setOverlay('sathi')} style={styles.navItem}>
            <View style={styles.sathiTile}>
              <T weight="b" color="#fff" size={11}>স</T>
            </View>
            <T weight="m" size={13.5}>সাথী চ্যাট</T>
          </Pressable>
          {user?.hasPOPortal ? (
            <Pressable onPress={() => setOverlay('po')} style={styles.navItem}>
              <Ionicons name="business-outline" size={18} color="#1d4ed8" />
              <T weight="m" size={13.5} color="#1d4ed8">PO পোর্টাল</T>
            </Pressable>
          ) : null}
        </View>

        <View style={{ flex: 1 }} />
        <UserPill />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          {route === 'home' &&
            (offline ? (
              <OfflineHomeScreen
                onOpenAgent={openAgent}
                onOpenApprovals={openApprovals}
                onOpenSale={() => setOverlay('sale')}
                onOpenHaat={() => setOverlay('haat')}
                onOpenLedger={() => setOverlay('ledger')}
                onOpenJourney={() => setOverlay('journey')}
              />
            ) : (
              <HomeScreen onOpenAgent={openAgent} onOpenApprovals={openApprovals} />
            ))}
          {route === 'messages' && <MessagesScreen onOpenAgent={openAgent} onOpenApprovals={openApprovals} />}
          {route === 'market' && <MarketScreen onOpenAgent={openAgent} onOpenApprovals={openApprovals} />}
          {route === 'finance' && <FinanceScreen onOpenAgent={openAgent} onOpenApprovals={openApprovals} />}
          {route === 'more' && <MoreScreen onOpenPOPortal={() => setOverlay('po')} />}
        </View>
      </View>

      {/* Right drawer overlays */}
      <DrawerOverlay open={overlay === 'sathi'} onClose={close}>
        <SathiChatScreen onClose={close} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'agent'} onClose={close} dark>
        <AgentLiveScreen
          onClose={close}
          onOpenAutopilot={() => setOverlay('autopilot')}
          onOpenApprovals={() => setOverlay('approvals')}
        />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'autopilot'} onClose={() => back('agent')}>
        <AutopilotScreen onClose={() => back('agent')} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'approvals'} onClose={close}>
        <ApprovalsScreen onClose={close} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'sale'} onClose={close} width={680}>
        <QuickSaleScreen onClose={close} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'haat'} onClose={close} width={520}>
        <HaatPrepScreen onClose={close} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'ledger'} onClose={close} width={560}>
        <LedgerScreen onClose={close} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'journey'} onClose={close} width={560}>
        <JourneyScreen onClose={close} />
      </DrawerOverlay>

      {/* PO portal: full-screen takeover because it's a different surface */}
      {overlay === 'po' && user?.hasPOPortal ? (
        <View style={StyleSheet.absoluteFill}>
          <POPortalScreen onClose={close} />
        </View>
      ) : null}
    </View>
  );
}

function UserPill() {
  const { user, signOut } = useAuth();
  if (!user) return null;
  return (
    <View style={{ padding: 14, borderTopWidth: 1, borderTopColor: colors.border2 }}>
      <Row gap={10}>
        <Avatar text={user.avatarInitial} bg={user.avatarColor} size={36} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <T weight="b" size={13} numberOfLines={1}>{user.bengaliName}</T>
          <T size={11} color={colors.ink2} numberOfLines={1}>@{user.username}</T>
        </View>
        <Pressable onPress={signOut} hitSlop={8}>
          <Ionicons name="log-out-outline" size={18} color={colors.ink2} />
        </Pressable>
      </Row>
    </View>
  );
}

function DrawerOverlay({
  open,
  onClose,
  children,
  width = 440,
  dark,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  dark?: boolean;
}) {
  if (!open) return null;
  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(15,23,42,0.45)' }]} />
      <View
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width,
          maxWidth: '100%',
          backgroundColor: dark ? '#0f172a' : colors.bg,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 28,
          shadowOffset: { width: -8, height: 0 },
          elevation: 16,
        }}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  sidebar: {
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: colors.border2,
  },
  content: { flex: 1, backgroundColor: colors.bg, minWidth: 0 },
  logoTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.saffron,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: colors.saffronSoft,
  },
  sathiTile: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.tealDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
  },
  countPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: colors.coral,
  },
});
