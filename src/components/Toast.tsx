import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { useResponsive } from './AppFrame';
import { Row, T } from './atoms';

export type ToastKind = 'info' | 'success' | 'warn' | 'error';

type ToastItem = {
  id: number;
  text: string;
  kind: ToastKind;
};

type ToastCtx = {
  show: (text: string, kind?: ToastKind) => void;
};

const Ctx = createContext<ToastCtx>({ show: () => {} });

export const useToast = () => useContext(Ctx);

let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const show = useCallback((text: string, kind: ToastKind = 'success') => {
    const id = nextId++;
    setItems((prev) => [...prev, { id, text, kind }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 2400);
  }, []);
  const value = useMemo(() => ({ show }), [show]);
  return (
    <Ctx.Provider value={value}>
      {children}
      <ToastStack items={items} />
    </Ctx.Provider>
  );
}

function ToastStack({ items }: { items: ToastItem[] }) {
  const { isDesktop } = useResponsive();
  return (
    <View
      pointerEvents="none"
      style={[
        styles.stack,
        isDesktop ? { right: 20, left: 'auto', alignItems: 'flex-end' } : { left: 16, right: 16, alignItems: 'center' },
      ]}
    >
      {items.map((t) => (
        <ToastView key={t.id} item={t} />
      ))}
    </View>
  );
}

function ToastView({ item }: { item: ToastItem }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
      Animated.delay(2000),
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [anim]);

  const palette: Record<ToastKind, { bg: string; fg: string; icon: keyof typeof Ionicons.glyphMap }> = {
    success: { bg: '#1e293b', fg: '#86efac', icon: 'checkmark-circle' },
    info: { bg: '#1e293b', fg: '#7dd3fc', icon: 'information-circle' },
    warn: { bg: '#78350f', fg: '#fde68a', icon: 'warning' },
    error: { bg: '#7f1d1d', fg: '#fecaca', icon: 'alert-circle' },
  };
  const p = palette[item.kind];

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: p.bg,
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
            },
          ],
        },
      ]}
    >
      <Row gap={10}>
        <Ionicons name={p.icon} size={18} color={p.fg} />
        <T color="#fff" size={13.5} weight="m" style={{ flexShrink: 1 }}>
          {item.text}
        </T>
      </Row>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stack: {
    position: 'absolute',
    bottom: 100,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    maxWidth: 420,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});
