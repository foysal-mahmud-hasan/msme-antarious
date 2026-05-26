import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { useResponsive } from '../components/AppFrame';
import { LenderPortalScreen } from '../screens/LenderPortalScreen';
import { SathiChatScreen } from '../screens/SathiChatScreen';
import { AppActions, AppActionsProvider, OVERLAY_FEATURE, OverlayName, Route } from '../state/AppActions';
import { useEntitlements } from '../state/EntitlementsStore';
import { colors } from '../theme';
import { DesktopShell } from './DesktopShell';
import { MobileShell } from './MobileShell';

const DEFAULT_SUB_TABS: Record<Route, string> = {
  home: 'today',
  messages: 'inbox',
  market: 'opp',
  finance: 'cash',
  more: '_',
};

export function Shell() {
  const { isDesktop } = useResponsive();
  const { user, signOut } = useAuth();
  const { has } = useEntitlements();

  const [route, setRoute] = useState<Route>('home');
  const [overlay, setOverlay] = useState<OverlayName | null>(null);
  const [overlayPrefill, setOverlayPrefill] = useState<string | undefined>(undefined);
  const [subTabs, setSubTabs] = useState<Record<Route, string>>(DEFAULT_SUB_TABS);

  const lastUserId = useRef<string | null>(user?.id ?? null);
  useEffect(() => {
    if (user?.id !== lastUserId.current) {
      lastUserId.current = user?.id ?? null;
      setOverlay(null);
      setOverlayPrefill(undefined);
      setRoute('home');
    }
  }, [user?.id]);

  const actions: AppActions = useMemo(
    () => ({
      goto: (r, subTab) => {
        setRoute(r);
        if (subTab) {
          setSubTabs((s) => ({ ...s, [r]: subTab }));
        }
        setOverlay(null);
      },
      openOverlay: (name, prefill) => {
        if (name === 'po' && !user?.hasPOPortal) return;
        // Entitlement chokepoint: a locked paid overlay redirects to upsell,
        // pre-targeted to the feature it gates. Defense-in-depth — even an
        // entry point that forgets to gate can't reach a paid surface.
        const required = OVERLAY_FEATURE[name];
        if (required && !has(required)) {
          setOverlay('upgrade');
          setOverlayPrefill(required);
          return;
        }
        setOverlay(name);
        setOverlayPrefill(prefill);
      },
      closeOverlay: () => {
        setOverlay(null);
        setOverlayPrefill(undefined);
      },
      getSubTab: (r) => subTabs[r],
      setSubTab: (r, subTab) => setSubTabs((s) => ({ ...s, [r]: subTab })),
      currentRoute: route,
      currentOverlay: overlay,
      overlayPrefill,
    }),
    [route, overlay, overlayPrefill, subTabs, user?.hasPOPortal, has]
  );

  if (user?.hasPOPortal) {
    return (
      <AppActionsProvider value={actions}>
        <POOnlyShell
          overlay={overlay}
          overlayPrefill={overlayPrefill}
          onSignOut={signOut}
          onCloseOverlay={() => {
            setOverlay(null);
            setOverlayPrefill(undefined);
          }}
        />
      </AppActionsProvider>
    );
  }

  return (
    <AppActionsProvider value={actions}>
      {isDesktop ? (
        <DesktopShell route={route} setRoute={setRoute} overlay={overlay} />
      ) : (
        <MobileShell route={route} setRoute={setRoute} overlay={overlay} />
      )}
    </AppActionsProvider>
  );
}

/* ──────────── PO-only shell ──────────── */

function POOnlyShell({
  overlay,
  overlayPrefill,
  onSignOut,
  onCloseOverlay,
}: {
  overlay: OverlayName | null;
  overlayPrefill: string | undefined;
  onSignOut: () => void;
  onCloseOverlay: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <LenderPortalScreen onClose={onSignOut} />
      <SlideOverlay open={overlay === 'sathi'} onClose={onCloseOverlay}>
        <SathiChatScreen onClose={onCloseOverlay} prefill={overlayPrefill} />
      </SlideOverlay>
    </View>
  );
}

function SlideOverlay({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { isDesktop } = useResponsive();
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

  if (isDesktop) {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents={open ? 'auto' : 'none'}>
        <Pressable onPress={onClose} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(15,23,42,0.45)' }]} />
        <Animated.View
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 440,
            maxWidth: ('100%') as `${number}%`,
            backgroundColor: colors.bg,
            shadowColor: '#000',
            shadowOpacity: 0.25,
            shadowRadius: 28,
            shadowOffset: { width: -8, height: 0 },
            elevation: 16,
            transform: [
              {
                translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [0, 440] }),
              },
            ],
          }}
        >
          {children}
        </Animated.View>
      </View>
    );
  }

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
            translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [0, 600] }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
