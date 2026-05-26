import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useResponsive } from '../components/AppFrame';
import { Avatar, PulseDot, Row, T } from '../components/atoms';
import { AgentLiveScreen, ApprovalsScreen, AutopilotScreen } from '../screens/AgentScreens';
import { BrandScreen } from '../screens/BrandScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { ComplaintsScreen } from '../screens/ComplaintsScreen';
import { CourierScreen } from '../screens/CourierScreen';
import { CreditScreen } from '../screens/CreditScreen';
import { FinanceScreen } from '../screens/FinanceScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { HaatPrepScreen } from '../screens/HaatPrepScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { JourneyScreen } from '../screens/JourneyScreen';
import { LeadsScreen } from '../screens/LeadsScreen';
import { LedgerScreen } from '../screens/LedgerScreen';
import { MarketScreen } from '../screens/MarketScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { MoreScreen } from '../screens/MoreScreen';
import { NewDebtScreen } from '../screens/NewDebtScreen';
import { NewProductScreen } from '../screens/NewProductScreen';
import { NewTransactionScreen } from '../screens/NewTransactionScreen';
import { OfflineHomeScreen } from '../screens/OfflineHomeScreen';
import { OrderDetailsScreen } from '../screens/OrderDetailsScreen';
import { PKSFReportScreen } from '../screens/PKSFReportScreen';
import { LenderPortalScreen } from '../screens/LenderPortalScreen';
import { PricingScreen } from '../screens/PricingScreen';
import { QuickSaleScreen } from '../screens/QuickSaleScreen';
import { SathiChatScreen } from '../screens/SathiChatScreen';
import { SathiDayScreen } from '../screens/SathiDayScreen';
import { SathiMemoryScreen } from '../screens/SathiMemoryScreen';
import { TrustJourneyScreen } from '../screens/TrustJourneyScreen';
import { UpgradeSheet } from '../screens/UpgradeSheet';
import { WebsiteScreen } from '../screens/WebsiteScreen';
import { Feature } from '../state/entitlements';
import { OverlayName, Route, useActions } from '../state/AppActions';
import { colors } from '../theme';

type Props = {
  route: Route;
  setRoute: (r: Route) => void;
  overlay: OverlayName | null;
};

export function DesktopShell({ route, setRoute, overlay }: Props) {
  const { user, offline } = useAuth();
  const { width } = useResponsive();
  const actions = useActions();
  const sidebarWidth = width >= 1280 ? 260 : 220;

  const items: { id: Route; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'home', label: 'হোম · Home', icon: 'home-outline' },
    { id: 'messages', label: 'বার্তা · Messages', icon: 'chatbubble-outline' },
    { id: 'market', label: 'বাজার · Market', icon: 'storefront-outline' },
    { id: 'finance', label: 'হিসাব · Finance', icon: 'stats-chart-outline' },
    { id: 'more', label: 'আরও · More', icon: 'ellipsis-horizontal' },
  ];

  return (
    <View style={styles.shell}>
      <View style={[styles.sidebar, { width: sidebarWidth }]}>
        <View style={{ padding: 18, paddingBottom: 12 }}>
          <Row gap={10}>
            <View style={styles.logoTile}>
              <T weight="b" color="#fff" size={20}>আ</T>
            </View>
            <View>
              <T weight="b" size={16}>আরোপণ</T>
              <T size={10.5} color={colors.ink2}>Aropon · MSME</T>
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
          <Pressable onPress={() => actions.openOverlay('agent')} style={styles.navItem}>
            <PulseDot size={8} />
            <T weight="b" size={13} color={colors.tealDark}>সাথী চলছে · Live</T>
          </Pressable>
          <Pressable onPress={() => actions.openOverlay('approvals')} style={styles.navItem}>
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
          <Pressable onPress={() => actions.openOverlay('sathi')} style={styles.navItem}>
            <View style={styles.sathiTile}>
              <T weight="b" color="#fff" size={11}>স</T>
            </View>
            <T weight="m" size={13.5}>সাথী চ্যাট</T>
          </Pressable>
          {user?.hasPOPortal ? (
            <Pressable onPress={() => actions.openOverlay('po')} style={styles.navItem}>
              <Ionicons name="business-outline" size={18} color="#1d4ed8" />
              <T weight="m" size={13.5} color="#1d4ed8">PO পোর্টাল</T>
            </Pressable>
          ) : null}
        </View>

        <View style={{ flex: 1 }} />
        <UserPill />
      </View>

      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          {route === 'home' && (offline ? <OfflineHomeScreen /> : <HomeScreen />)}
          {route === 'messages' && <MessagesScreen />}
          {route === 'market' && <MarketScreen />}
          {route === 'finance' && <FinanceScreen />}
          {route === 'more' && <MoreScreen />}
        </View>
      </View>

      <DrawerOverlay open={overlay === 'sathi'} onClose={actions.closeOverlay}>
        <SathiChatScreen onClose={actions.closeOverlay} prefill={actions.overlayPrefill} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'agent'} onClose={actions.closeOverlay} dark>
        <AgentLiveScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'autopilot'} onClose={actions.closeOverlay}>
        <AutopilotScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'approvals'} onClose={actions.closeOverlay}>
        <ApprovalsScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'sale'} onClose={actions.closeOverlay} width={680}>
        <QuickSaleScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'haat'} onClose={actions.closeOverlay} width={520}>
        <HaatPrepScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'ledger'} onClose={actions.closeOverlay} width={560}>
        <LedgerScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'journey'} onClose={actions.closeOverlay} width={560}>
        <JourneyScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'transaction'} onClose={actions.closeOverlay} width={560}>
        <NewTransactionScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'order'} onClose={actions.closeOverlay} width={680}>
        <OrderDetailsScreen onClose={actions.closeOverlay} orderId={actions.overlayPrefill} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'pksfReport'} onClose={actions.closeOverlay} width={720}>
        <PKSFReportScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'newProduct'} onClose={actions.closeOverlay} width={520}>
        <NewProductScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'newDebt'} onClose={actions.closeOverlay} width={520}>
        <NewDebtScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'credit'} onClose={actions.closeOverlay} width={560}>
        <CreditScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'brand'} onClose={actions.closeOverlay} width={560}>
        <BrandScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'website'} onClose={actions.closeOverlay} width={640}>
        <WebsiteScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'pricing'} onClose={actions.closeOverlay} width={760}>
        <PricingScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'upgrade'} onClose={actions.closeOverlay} width={520}>
        <UpgradeSheet onClose={actions.closeOverlay} feature={actions.overlayPrefill as Feature | undefined} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'leads'} onClose={actions.closeOverlay} width={640}>
        <LeadsScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'insights'} onClose={actions.closeOverlay} width={720}>
        <InsightsScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'complaints'} onClose={actions.closeOverlay} width={640}>
        <ComplaintsScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'calendar'} onClose={actions.closeOverlay} width={640}>
        <CalendarScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'courier'} onClose={actions.closeOverlay} width={620}>
        <CourierScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'inventory'} onClose={actions.closeOverlay} width={680}>
        <InventoryScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'trust'} onClose={actions.closeOverlay} width={560}>
        <TrustJourneyScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'day'} onClose={actions.closeOverlay} width={560}>
        <SathiDayScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>
      <DrawerOverlay open={overlay === 'memory'} onClose={actions.closeOverlay} width={520}>
        <SathiMemoryScreen onClose={actions.closeOverlay} />
      </DrawerOverlay>

      {(overlay === 'lender' || (overlay === 'po' && user?.hasPOPortal)) ? (
        <View style={StyleSheet.absoluteFill}>
          <LenderPortalScreen onClose={actions.closeOverlay} />
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
          maxWidth: ('100%') as `${number}%`,
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
