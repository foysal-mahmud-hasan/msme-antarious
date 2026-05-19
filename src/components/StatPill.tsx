import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme';
import { T } from './atoms';

export function StatPill({
  value,
  label,
  tint = '#fff',
  valueColor = colors.ink,
}: {
  value: React.ReactNode;
  label: string;
  tint?: string;
  valueColor?: string;
}) {
  return (
    <View
      style={{
        backgroundColor: tint,
        borderColor: tint === '#fff' ? colors.border2 : 'transparent',
        borderWidth: 1,
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'flex-start',
        flex: 1,
      }}
    >
      <T weight="b" size={17} color={valueColor}>{value}</T>
      <T size={11.5} color={colors.ink2} weight="m" style={{ marginTop: 2 }}>{label}</T>
    </View>
  );
}
