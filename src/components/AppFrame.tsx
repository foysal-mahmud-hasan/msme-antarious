import React, { createContext, useContext, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { colors } from '../theme';

export const BP = {
  tablet: 720,
  desktop: 1024,
  wide: 1400,
};

export type ResponsiveInfo = {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
};

const Ctx = createContext<ResponsiveInfo>({
  width: 360,
  height: 800,
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  isWide: false,
});

export const useResponsive = () => useContext(Ctx);

export function AppFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const info = useMemo<ResponsiveInfo>(() => {
    const isDesktop = width >= BP.desktop;
    const isTablet = !isDesktop && width >= BP.tablet;
    const isMobile = !isDesktop && !isTablet;
    return {
      width,
      height,
      isMobile,
      isTablet,
      isDesktop,
      isWide: width >= BP.wide,
    };
  }, [width, height]);

  return (
    <Ctx.Provider value={info}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>{children}</View>
    </Ctx.Provider>
  );
}
