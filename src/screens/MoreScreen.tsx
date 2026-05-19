import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { Avatar, Card, Chip, Row, T } from '../components/atoms';
import { ScreenScroll } from '../components/ScreenContainer';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { colors } from '../theme';

export function MoreScreen() {
  const { user, signOut, offline, setOffline } = useAuth();
  const actions = useActions();
  const toast = useToast();
  if (!user) return null;
  return (
    <View style={{ flex: 1 }}>
      <ScreenScroll maxWidth={700}>
        <Card style={{ padding: 18, marginBottom: 14 }}>
          <Row gap={14}>
            <Avatar text={user.avatarInitial} bg={user.avatarColor} size={56} />
            <View style={{ flex: 1 }}>
              <T weight="b" size={18}>{user.bengaliName}</T>
              <T size={13} color={colors.ink2} style={{ marginTop: 2 }}>{user.fullName} · @{user.username}</T>
              <Row gap={6} style={{ marginTop: 6 }}>
                {user.role === 'admin' ? (
                  <Chip kind="teal" size={11}>অ্যাডমিন</Chip>
                ) : (
                  <Chip kind="green" size={11}>সাধারণ ইউজার</Chip>
                )}
                {user.hasPOPortal ? <Chip kind="saffron" size={11}>PO পোর্টাল</Chip> : null}
              </Row>
            </View>
          </Row>
        </Card>

        <Card style={{ padding: 14, marginBottom: 14 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <T weight="b" size={14}>অফলাইন মোড</T>
              <T size={12.5} color={colors.ink2} style={{ marginTop: 2 }}>
                ইন্টারনেট ছাড়াই হাট · বিক্রি · বাকি লিখুন
              </T>
            </View>
            <Switch
              value={offline}
              onValueChange={(v) => {
                setOffline(v);
                toast.show(v ? 'অফলাইন মোড চালু হয়েছে' : 'অনলাইন মোড চালু হয়েছে', 'success');
              }}
              trackColor={{ true: colors.tealDark, false: '#cbd5e1' }}
              thumbColor="#fff"
            />
          </Row>
        </Card>

        {user.hasPOPortal ? (
          <Pressable onPress={() => actions.openOverlay('po')}>
            <Card tinted="#eff6ff" style={{ padding: 16, marginBottom: 14 }}>
              <Row gap={12}>
                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#1d4ed8', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="business" size={22} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="b" size={15}>PKSF PO পোর্টাল</T>
                  <T size={12.5} color={colors.ink2}>৪৮ জন বেনিফিশিয়ারি · ৩১ ঋণ-যোগ্য</T>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.ink2} />
              </Row>
            </Card>
          </Pressable>
        ) : null}

        <T weight="b" size={13} color={colors.ink2} style={{ marginTop: 8, marginBottom: 8, paddingHorizontal: 4 }}>
          সেটিংস
        </T>
        <Card style={{ padding: 0, marginBottom: 14 }}>
          {[
            { icon: 'language', label: 'ভাষা', sub: 'বাংলা · English', msg: 'ভাষা পরিবর্তন শীঘ্রই আসছে' },
            { icon: 'cloud-upload-outline', label: 'ব্যাকআপ', sub: 'গতকাল সিঙ্ক হয়েছে', msg: 'ম্যানুয়াল ব্যাকআপ শুরু হয়েছে' },
            { icon: 'shield-checkmark-outline', label: 'নিরাপত্তা', sub: 'PIN ও বায়োমেট্রিক', msg: 'নিরাপত্তা সেটিংস শীঘ্রই আসছে' },
            { icon: 'help-circle-outline', label: 'সাহায্য', sub: 'সাথীকে জিজ্ঞেস করুন', msg: 'সাথী চ্যাট খুলছে…' },
          ].map((it, i, arr) => (
            <Pressable
              key={it.label}
              onPress={() => {
                if (it.label === 'সাহায্য') {
                  actions.openOverlay('sathi', 'সাহায্য চাই');
                } else {
                  toast.show(it.msg, 'info');
                }
              }}
            >
              <Row
                gap={12}
                style={{
                  padding: 14,
                  borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border2,
                }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={it.icon as any} size={18} color={colors.ink} />
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="s" size={14}>{it.label}</T>
                  <T size={12} color={colors.ink2}>{it.sub}</T>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.ink2} />
              </Row>
            </Pressable>
          ))}
        </Card>

        <Pressable onPress={signOut}>
          <Card style={{ padding: 14, borderColor: colors.coralSoft }}>
            <Row gap={10} style={{ justifyContent: 'center' }}>
              <Ionicons name="log-out-outline" size={18} color={colors.coral} />
              <T weight="b" size={14} color={colors.coral}>সাইন আউট</T>
            </Row>
          </Card>
        </Pressable>

        <T size={11} color={colors.ink2} style={{ textAlign: 'center', marginTop: 18 }}>
          উদ্যোম · v1.0.0 — Antarious × PKSF
        </T>
      </ScreenScroll>
    </View>
  );
}
