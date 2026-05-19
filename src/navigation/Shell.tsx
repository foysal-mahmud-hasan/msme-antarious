import React from 'react';
import { useResponsive } from '../components/AppFrame';
import { DesktopShell } from './DesktopShell';
import { MainTabs } from './MainTabs';

export function Shell() {
  const { isDesktop } = useResponsive();
  return isDesktop ? <DesktopShell /> : <MainTabs />;
}
