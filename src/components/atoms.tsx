import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { colors, fonts, radius, shadow, spacing } from '../theme';

export function T(props: TextProps & { weight?: 'r' | 'm' | 's' | 'b'; size?: number; color?: string }) {
  const { weight = 'r', size = 14, color = colors.ink, style, ...rest } = props;
  const family =
    weight === 'b' ? fonts.bold : weight === 's' ? fonts.semibold : weight === 'm' ? fonts.medium : fonts.regular;
  return <Text {...rest} style={[{ fontFamily: family, fontSize: size, color }, style]} />;
}

export function Card({
  children,
  style,
  leftBar,
  tinted,
}: ViewProps & { leftBar?: string; tinted?: string }) {
  return (
    <View
      style={[
        styles.card,
        tinted ? { backgroundColor: tinted, borderColor: 'transparent' } : null,
        leftBar ? { borderLeftWidth: 5, borderLeftColor: leftBar } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Chip({
  children,
  kind = 'neutral',
  style,
  size = 13,
}: {
  children: React.ReactNode;
  kind?: 'neutral' | 'saffron' | 'green' | 'teal' | 'coral' | 'amber';
  style?: StyleProp<ViewStyle>;
  size?: number;
}) {
  const map: Record<string, { bg: string; fg: string }> = {
    neutral: { bg: '#F1EBDF', fg: colors.ink },
    saffron: { bg: colors.saffron, fg: '#fff' },
    green: { bg: colors.green, fg: '#fff' },
    teal: { bg: colors.teal, fg: '#fff' },
    coral: { bg: colors.coral, fg: '#fff' },
    amber: { bg: colors.amber, fg: '#fff' },
  };
  const c = map[kind];
  return (
    <View style={[styles.chip, { backgroundColor: c.bg }, style]}>
      <T size={size} weight="s" color={c.fg} style={{ lineHeight: size + 2 }}>
        {children}
      </T>
    </View>
  );
}

export function Btn({
  label,
  onPress,
  kind = 'primary',
  iconRight,
  iconLeft,
  full,
  size = 'lg',
  style,
  disabled,
  loading,
}: {
  label: React.ReactNode;
  onPress?: () => void;
  kind?:
    | 'primary'
    | 'teal'
    | 'coral'
    | 'tealOutline'
    | 'greenOutline'
    | 'amberOutline'
    | 'coralOutline'
    | 'greyOutline';
  iconRight?: React.ReactNode;
  iconLeft?: React.ReactNode;
  full?: boolean;
  size?: 'lg' | 'sm';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  loading?: boolean;
}) {
  const map: Record<string, { bg: string; fg: string; border?: string }> = {
    primary: { bg: colors.saffron, fg: '#fff' },
    teal: { bg: colors.teal, fg: '#fff' },
    coral: { bg: colors.coral, fg: '#fff' },
    tealOutline: { bg: '#fff', fg: colors.tealDark, border: colors.teal },
    greenOutline: { bg: '#fff', fg: colors.green, border: colors.green },
    amberOutline: { bg: '#fff', fg: colors.amber, border: colors.amber },
    coralOutline: { bg: '#fff', fg: colors.coral, border: colors.coral },
    greyOutline: { bg: '#fff', fg: colors.ink2, border: colors.border },
  };
  const c = map[kind];
  const minHeight = size === 'sm' ? 40 : 52;
  const fontSize = size === 'sm' ? 14 : 16;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          minHeight,
          paddingHorizontal: size === 'sm' ? 14 : 18,
          borderRadius: size === 'sm' ? 10 : 12,
          backgroundColor: c.bg,
          borderWidth: c.border ? 1.5 : 0,
          borderColor: c.border,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          opacity: pressed ? 0.85 : disabled ? 0.5 : 1,
          alignSelf: full ? 'stretch' : 'flex-start',
          width: full ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={c.fg} />
      ) : (
        <>
          {iconLeft}
          <T weight="b" size={fontSize} color={c.fg}>
            {label}
          </T>
          {iconRight}
        </>
      )}
    </Pressable>
  );
}

export function SathiBadge({ size = 22, style }: { size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.teal,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.teal,
          shadowOpacity: 0.4,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    >
      <T weight="b" color="#fff" size={size * 0.55}>
        স
      </T>
    </View>
  );
}

export function PulseDot({ color = colors.teal, size = 8 }: { color?: string; size?: number }) {
  const scale = React.useRef(new Animated.Value(0.6)).current;
  const opacity = React.useRef(new Animated.Value(0.5)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.timing(scale, { toValue: 1.8, duration: 1600, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
        Animated.timing(opacity, { toValue: 0, duration: 1600, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity]);
  return (
    <View style={{ width: size, height: size }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: size, backgroundColor: color }} />
      <Animated.View
        style={{
          position: 'absolute',
          left: -size / 2,
          top: -size / 2,
          right: -size / 2,
          bottom: -size / 2,
          borderRadius: size,
          backgroundColor: color,
          opacity,
          transform: [{ scale }],
        }}
      />
    </View>
  );
}

export function Row({ children, style, gap = 8 }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; gap?: number }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

export function Avatar({
  text,
  size = 36,
  bg = '#E8820C',
  color = '#fff',
  style,
}: {
  text: string;
  size?: number;
  bg?: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <T weight="b" color={color} size={size * 0.44}>
        {text}
      </T>
    </View>
  );
}

export function SectionHeader({
  title,
  trailing,
  style,
}: {
  title: string;
  trailing?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 }, style]}>
      <T weight="b" size={15}>{title}</T>
      {trailing ?? null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border2,
    ...shadow.card,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});

export { styles as atomStyles };
