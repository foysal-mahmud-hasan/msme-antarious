import React, { createContext, useContext } from 'react';

export type Route = 'home' | 'messages' | 'market' | 'finance' | 'more';

export type OverlayName =
  | 'sathi'
  | 'agent'
  | 'autopilot'
  | 'approvals'
  | 'sale'
  | 'haat'
  | 'ledger'
  | 'journey'
  | 'po'
  | 'transaction'
  | 'order'
  | 'pksfReport'
  | 'newProduct'
  | 'newDebt';

export type AppActions = {
  /** Switch to a top-level tab, optionally setting its sub-tab. Closes any open overlay. */
  goto: (route: Route, subTab?: string) => void;
  /** Open a modal/overlay (Sathi chat, Agent live, PO Portal, etc.). */
  openOverlay: (name: OverlayName, prefill?: string) => void;
  /** Close the active overlay. */
  closeOverlay: () => void;
  /** Get the current sub-tab id for a route (used by screens that have inner pill tabs). */
  getSubTab: (route: Route) => string | undefined;
  /** Set the sub-tab for a route. */
  setSubTab: (route: Route, subTab: string) => void;
  /** Current route (read-only). */
  currentRoute: Route;
  /** Currently open overlay name (or null). */
  currentOverlay: OverlayName | null;
  /** Optional prefill payload passed to overlays (e.g. Sathi chat seed prompt). */
  overlayPrefill?: string;
};

const noop = () => {};

const Ctx = createContext<AppActions>({
  goto: noop,
  openOverlay: noop,
  closeOverlay: noop,
  getSubTab: () => undefined,
  setSubTab: noop,
  currentRoute: 'home',
  currentOverlay: null,
});

export const AppActionsProvider = Ctx.Provider;
export const useActions = () => useContext(Ctx);
