import React from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { useResponsive } from './AppFrame';
import { colors } from '../theme';

/**
 * Wraps screen scroll content so it stays full-width on mobile but
 * caps to a readable column on desktop with side padding.
 */
export function ScreenScroll({
  children,
  maxWidth = 980,
  contentStyle,
  paddingBottom = 120,
}: {
  children: React.ReactNode;
  maxWidth?: number;
  contentStyle?: StyleProp<ViewStyle>;
  paddingBottom?: number;
}) {
  const { isDesktop, isTablet } = useResponsive();
  const pad = isDesktop ? 32 : 14;
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingHorizontal: pad,
        paddingTop: pad,
        paddingBottom,
        alignItems: 'stretch',
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[{ width: '100%', maxWidth, alignSelf: 'center' }, contentStyle]}>{children}</View>
    </ScrollView>
  );
}

/**
 * 1-col on mobile, N-col on desktop. Children should be self-sized.
 */
export function ResponsiveGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 2 },
  gap = 12,
}: {
  children: React.ReactNode[];
  columns?: { mobile?: number; tablet?: number; desktop?: number };
  gap?: number;
}) {
  const { isDesktop, isTablet } = useResponsive();
  const cols = isDesktop ? columns.desktop ?? 2 : isTablet ? columns.tablet ?? 2 : columns.mobile ?? 1;
  const items = React.Children.toArray(children);

  if (cols === 1) {
    return (
      <View style={{ gap }}>
        {items}
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -gap / 2, marginVertical: -gap / 2 }}>
      {items.map((child, i) => (
        <View
          key={i}
          style={{
            width: `${100 / cols}%`,
            paddingHorizontal: gap / 2,
            paddingVertical: gap / 2,
          }}
        >
          {child as React.ReactElement}
        </View>
      ))}
    </View>
  );
}

export const sectionDivider = {
  height: 1,
  backgroundColor: colors.border2,
  width: '100%' as const,
};
