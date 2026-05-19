import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { useResponsive } from './AppFrame';
import { T } from './atoms';

export function SathiFAB({ onPress }: { onPress: () => void }) {
  const { isDesktop } = useResponsive();
  if (isDesktop) return null;
  return (
    <Pressable onPress={onPress} style={styles.fab} hitSlop={6}>
      <View style={styles.badge}>
        <T weight="b" color="#fff" size={14}>স</T>
      </View>
      <T weight="b" color="#fff" size={15}>সাথীকে জিজ্ঞেস করুন</T>
      <Ionicons name="mic" size={18} color="#fff" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: colors.tealDark,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.teal,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  badge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
