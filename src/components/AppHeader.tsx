import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme';
import { useResponsive } from './AppFrame';
import { Avatar, PulseDot, Row, T } from './atoms';

export function AppHeader({
  title,
  subtitle,
  onNotificationPress,
  onAgentPress,
  notificationBadge,
  showAgentRunning,
  avatarText = 'র',
  avatarColor = colors.saffron,
  onAvatarPress,
}: {
  title: React.ReactNode;
  subtitle?: string;
  onNotificationPress?: () => void;
  onAgentPress?: () => void;
  notificationBadge?: boolean;
  showAgentRunning?: boolean;
  avatarText?: string;
  avatarColor?: string;
  onAvatarPress?: () => void;
}) {
  const { isDesktop } = useResponsive();
  return (
    <View style={[styles.wrap, isDesktop ? styles.wrapDesktop : null]}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <T weight="b" size={isDesktop ? 26 : 22} style={{ lineHeight: isDesktop ? 32 : 30 }}>
          {title}
        </T>
        {subtitle ? (
          <Row gap={6} style={{ marginTop: 4 }}>
            <PulseDot />
            <T color={colors.ink2} size={isDesktop ? 13.5 : 12.5} weight="m">
              {subtitle}
            </T>
          </Row>
        ) : null}
      </View>
      {/* Right-cluster (notification, avatar) is only shown on mobile; the sidebar handles these on desktop */}
      {!isDesktop ? (
        <Row gap={8} style={{ flexShrink: 0 }}>
          {showAgentRunning ? (
            <Pressable onPress={onAgentPress} hitSlop={6} style={styles.iconBtn}>
              <PulseDot size={8} />
            </Pressable>
          ) : null}
          <Pressable onPress={onNotificationPress} hitSlop={6} style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={colors.ink} />
            {notificationBadge ? <View style={styles.dotBadge} /> : null}
          </Pressable>
          <Pressable onPress={onAvatarPress}>
            <Avatar text={avatarText} bg={avatarColor} />
          </Pressable>
        </Row>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },
  wrapDesktop: {
    paddingHorizontal: 32,
    paddingTop: 26,
    paddingBottom: 14,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border2,
  },
  dotBadge: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.coral,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
});
