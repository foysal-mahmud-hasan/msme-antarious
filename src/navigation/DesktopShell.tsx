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

export function DesktopShell({ route, overlay }: Props) {
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

  // Overlays render INLINE in the content area so the sidebar (primary nav)
  // always stays visible — the user is never stranded with just a back button.
  const renderOverlayScreen = () => {
    const close = actions.closeOverlay;
    switch (overlay) {
      case 'sathi': return <SathiChatScreen onClose={close} prefill={actions.overlayPrefill} />;
      case 'agent': return <AgentLiveScreen onClose={close} />;
      case 'autopilot': return <AutopilotScreen onClose={close} />;
      case 'approvals': return <ApprovalsScreen onClose={close} />;
      case 'sale': return <QuickSaleScreen onClose={close} />;
      case 'haat': return <HaatPrepScreen onClose={close} />;
      case 'ledger': return <LedgerScreen onClose={close} />;
      case 'journey': return <JourneyScreen onClose={close} />;
      case 'transaction': return <NewTransactionScreen onClose={close} />;
      case 'order': return <OrderDetailsScreen onClose={close} orderId={actions.overlayPrefill} />;
      case 'pksfReport': return <PKSFReportScreen onClose={close} />;
      case 'newProduct': return <NewProductScreen onClose={close} />;
      case 'newDebt': return <NewDebtScreen onClose={close} />;
      case 'credit': return <CreditScreen onClose={close} />;
      case 'brand': return <BrandScreen onClose={close} />;
      case 'website': return <WebsiteScreen onClose={close} />;
      case 'pricing': return <PricingScreen onClose={close} />;
      case 'upgrade': return <UpgradeSheet onClose={close} feature={actions.overlayPrefill as Feature | undefined} />;
      case 'leads': return <LeadsScreen onClose={close} />;
      case 'insights': return <InsightsScreen onClose={close} />;
      case 'complaints': return <ComplaintsScreen onClose={close} />;
      case 'calendar': return <CalendarScreen onClose={close} />;
      case 'courier': return <CourierScreen onClose={close} />;
      case 'inventory': return <InventoryScreen onClose={close} />;
      case 'trust': return <TrustJourneyScreen onClose={close} />;
      case 'day': return <SathiDayScreen onClose={close} />;
      case 'memory': return <SathiMemoryScreen onClose={close} />;
      case 'lender':
      case 'po': return <LenderPortalScreen onClose={close} />;
      default: return null;
    }
  };

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
                onPress={() => actions.goto(it.id)}
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
          {overlay ? (
            renderOverlayScreen()
          ) : (
            <>
              {route === 'home' && (offline ? <OfflineHomeScreen /> : <HomeScreen />)}
              {route === 'messages' && <MessagesScreen />}
              {route === 'market' && <MarketScreen />}
              {route === 'finance' && <FinanceScreen />}
              {route === 'more' && <MoreScreen />}
            </>
          )}
        </View>
      </View>
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
