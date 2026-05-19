import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { T } from './atoms';

export function PillTabs<T extends string>({
  tabs,
  active,
  onChange,
  style,
}: {
  tabs: { id: T; label: string; count?: number }[];
  active: T;
  onChange: (id: T) => void;
  style?: any;
}) {
  return (
    <View style={[styles.wrap, style]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => onChange(t.id)}
              style={[
                styles.tab,
                isActive ? { backgroundColor: colors.saffron, borderColor: colors.saffron } : null,
              ]}
            >
              <_Label active={isActive} label={t.label} count={t.count} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function _Label({ active, label, count }: { active: boolean; label: string; count?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <T weight={active ? 'b' : 'm'} color={active ? '#fff' : colors.ink2} size={14}>
        {label}
      </T>
      {typeof count === 'number' ? (
        <T weight="b" color={active ? 'rgba(255,255,255,0.85)' : colors.ink2} size={12}>
          {toBn(count)}
        </T>
      ) : null}
    </View>
  );
}

function toBn(n: number) {
  const bn = '০১২৩৪৫৬৭৮৯';
  return String(n).split('').map((c) => bn[parseInt(c, 10)] ?? c).join('');
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 12,
    backgroundColor: colors.bg,
    borderBottomColor: colors.border2,
    borderBottomWidth: 1,
  },
  tab: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
