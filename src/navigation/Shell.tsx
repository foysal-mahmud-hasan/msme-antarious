import React, { useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useResponsive } from '../components/AppFrame';
import { AppActions, AppActionsProvider, OverlayName, Route } from '../state/AppActions';
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
  const { user } = useAuth();

  const [route, setRoute] = useState<Route>('home');
  const [overlay, setOverlay] = useState<OverlayName | null>(null);
  const [overlayPrefill, setOverlayPrefill] = useState<string | undefined>(undefined);
  const [subTabs, setSubTabs] = useState<Record<Route, string>>(DEFAULT_SUB_TABS);

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
    [route, overlay, overlayPrefill, subTabs, user?.hasPOPortal]
  );

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
