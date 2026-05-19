import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
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
import { OfflineHomeScreen } from '../screens/OfflineHomeScreen';
import { POPortalScreen } from '../screens/POPortalScreen';
import { QuickSaleScreen } from '../screens/QuickSaleScreen';
import { SathiChatScreen } from '../screens/SathiChatScreen';
import { colors } from '../theme';

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

const Tab = createBottomTabNavigator();

export function MainTabs() {
  const { offline, user } = useAuth();
  const [overlay, setOverlay] = useState<Overlay>(null);

  const openAgent = () => setOverlay('agent');
  const openApprovals = () => setOverlay('approvals');
  const close = () => setOverlay(null);
  const back = (to: Overlay) => setOverlay(to);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.saffron,
          tabBarInactiveTintColor: colors.ink2,
          tabBarStyle: {
            height: 70,
            paddingBottom: 12,
            paddingTop: 8,
            backgroundColor: '#fff',
            borderTopColor: colors.border2,
          },
          tabBarLabelStyle: {
            fontFamily: 'HindSiliguri_500Medium',
            fontSize: 11,
            marginTop: -4,
          },
        }}
      >
        <Tab.Screen
          name="home"
          options={{
            tabBarLabel: 'হোম',
            tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
          }}
        >
          {() =>
            offline ? (
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
            )
          }
        </Tab.Screen>
        <Tab.Screen
          name="messages"
          options={{
            tabBarLabel: 'বার্তা',
            tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} />,
          }}
        >
          {() => <MessagesScreen onOpenAgent={openAgent} onOpenApprovals={openApprovals} />}
        </Tab.Screen>
        <Tab.Screen
          name="market"
          options={{
            tabBarLabel: 'বাজার',
            tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} />,
          }}
        >
          {() => <MarketScreen onOpenAgent={openAgent} onOpenApprovals={openApprovals} />}
        </Tab.Screen>
        <Tab.Screen
          name="finance"
          options={{
            tabBarLabel: 'হিসাব',
            tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart-outline" size={size} color={color} />,
          }}
        >
          {() => <FinanceScreen onOpenAgent={openAgent} onOpenApprovals={openApprovals} />}
        </Tab.Screen>
        <Tab.Screen
          name="more"
          options={{
            tabBarLabel: 'আরও',
            tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal" size={size} color={color} />,
          }}
        >
          {() => <MoreScreen onOpenPOPortal={() => setOverlay('po')} />}
        </Tab.Screen>
      </Tab.Navigator>

      {overlay === null ? <SathiFAB onPress={() => setOverlay('sathi')} /> : null}

      <Overlay open={overlay === 'sathi'}>
        <SathiChatScreen onClose={close} />
      </Overlay>
      <Overlay open={overlay === 'agent'}>
        <AgentLiveScreen onClose={close} onOpenAutopilot={() => setOverlay('autopilot')} onOpenApprovals={() => setOverlay('approvals')} />
      </Overlay>
      <Overlay open={overlay === 'autopilot'}>
        <AutopilotScreen onClose={() => back('agent')} />
      </Overlay>
      <Overlay open={overlay === 'approvals'}>
        <ApprovalsScreen onClose={() => back(overlay === 'approvals' ? null : 'agent')} />
      </Overlay>
      <Overlay open={overlay === 'sale'}>
        <QuickSaleScreen onClose={close} />
      </Overlay>
      <Overlay open={overlay === 'haat'}>
        <HaatPrepScreen onClose={close} />
      </Overlay>
      <Overlay open={overlay === 'ledger'}>
        <LedgerScreen onClose={close} />
      </Overlay>
      <Overlay open={overlay === 'journey'}>
        <JourneyScreen onClose={close} />
      </Overlay>
      <Overlay open={overlay === 'po' && !!user?.hasPOPortal}>
        <POPortalScreen onClose={close} />
      </Overlay>
    </View>
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
