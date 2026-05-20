import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { Row, T } from '../components/atoms';
import { SathiFAB } from '../components/SathiFAB';
import { AgentLiveScreen, ApprovalsScreen, AutopilotScreen } from '../screens/AgentScreens';
import { FinanceScreen } from '../screens/FinanceScreen';
import { HaatPrepScreen } from '../screens/HaatPrepScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { JourneyScreen } from '../screens/JourneyScreen';
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
import { POPortalScreen } from '../screens/POPortalScreen';
import { QuickSaleScreen } from '../screens/QuickSaleScreen';
import { SathiChatScreen } from '../screens/SathiChatScreen';
import { OverlayName, Route, useActions } from '../state/AppActions';
import { colors } from '../theme';

type Props = {
  route: Route;
  setRoute: (r: Route) => void;
  overlay: OverlayName | null;
};

export function MobileShell({ route, setRoute, overlay }: Props) {
  const { offline, user } = useAuth();
  const actions = useActions();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {route === 'home' &&
          (offline ? (
            <OfflineHomeScreen />
          ) : (
            <HomeScreen />
          ))}
        {route === 'messages' && <MessagesScreen />}
        {route === 'market' && <MarketScreen />}
        {route === 'finance' && <FinanceScreen />}
        {route === 'more' && <MoreScreen />}
      </View>

      <BottomBar active={route} onChange={setRoute} />
      {overlay === null ? <SathiFAB onPress={() => actions.openOverlay('sathi')} /> : null}

      <Overlay open={overlay === 'sathi'}>
        <SathiChatScreen onClose={actions.closeOverlay} prefill={actions.overlayPrefill} />
      </Overlay>
      <Overlay open={overlay === 'agent'}>
        <AgentLiveScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'autopilot'}>
        <AutopilotScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'approvals'}>
        <ApprovalsScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'sale'}>
        <QuickSaleScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'haat'}>
        <HaatPrepScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'ledger'}>
        <LedgerScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'journey'}>
        <JourneyScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'po' && !!user?.hasPOPortal}>
        <POPortalScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'transaction'}>
        <NewTransactionScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'order'}>
        <OrderDetailsScreen onClose={actions.closeOverlay} orderId={actions.overlayPrefill} />
      </Overlay>
      <Overlay open={overlay === 'pksfReport'}>
        <PKSFReportScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'newProduct'}>
        <NewProductScreen onClose={actions.closeOverlay} />
      </Overlay>
      <Overlay open={overlay === 'newDebt'}>
        <NewDebtScreen onClose={actions.closeOverlay} />
      </Overlay>
    </View>
  );
}

function BottomBar({ active, onChange }: { active: Route; onChange: (r: Route) => void }) {
  const items: { id: Route; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'home', label: 'হোম', icon: 'home-outline' },
    { id: 'messages', label: 'বার্তা', icon: 'chatbubble-outline' },
    { id: 'market', label: 'বাজার', icon: 'storefront-outline' },
    { id: 'finance', label: 'হিসাব', icon: 'stats-chart-outline' },
    { id: 'more', label: 'আরও', icon: 'ellipsis-horizontal' },
  ];
  return (
    <Row style={styles.bar}>
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <Pressable
            key={it.id}
            onPress={() => onChange(it.id)}
            style={styles.item}
            hitSlop={4}
          >
            <Ionicons name={it.icon} size={22} color={isActive ? colors.saffron : colors.ink2} />
            <T size={11} weight={isActive ? 'b' : 'm'} color={isActive ? colors.saffron : colors.ink2} style={{ marginTop: 2 }}>
              {it.label}
            </T>
          </Pressable>
        );
      })}
    </Row>
  );
}

function Overlay({ open, children }: { open: boolean; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(open);
  const slide = useRef(new Animated.Value(open ? 0 : 1)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.timing(slide, {
        toValue: 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      Animated.timing(slide, {
        toValue: 1,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <Animated.View
      pointerEvents={open ? 'auto' : 'none'}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.bg,
        transform: [
          {
            translateY: slide.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 600],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 70,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderTopColor: colors.border2,
    borderTopWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
