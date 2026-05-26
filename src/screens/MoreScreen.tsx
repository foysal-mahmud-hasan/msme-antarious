import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { Avatar, Card, Chip, Row, T } from '../components/atoms';
import { ScreenScroll } from '../components/ScreenContainer';
import { useToast } from '../components/Toast';
import { useActions } from '../state/AppActions';
import { useEntitlements } from '../state/EntitlementsStore';
import { tierPriceLabel } from '../state/entitlements';
import { colors } from '../theme';

type Lang = 'bn' | 'en' | 'mix';

export function MoreScreen() {
  const { user, signOut, offline, setOffline } = useAuth();
  const actions = useActions();
  const toast = useToast();
  const { tierMeta, addOns } = useEntitlements();
  const [openPanel, setOpenPanel] = useState<'language' | 'security' | null>(null);
  const [lang, setLang] = useState<Lang>('bn');
  const [pin, setPin] = useState(true);
  const [bio, setBio] = useState(false);
  const [autolock, setAutolock] = useState<5 | 15 | 60>(15);
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

        <Pressable onPress={() => actions.openOverlay('pricing')}>
          <Card style={{ padding: 16, marginBottom: 14, borderColor: tierMeta.color, borderWidth: 1.5 }}>
            <Row gap={12}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: tierMeta.color, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="ribbon" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Row gap={6}>
                  <T size={12} color={colors.ink2}>আপনার প্যাকেজ</T>
                  {addOns.size > 0 ? <Chip kind="saffron" size={10}>+{addOns.size} অ্যাড-অন</Chip> : null}
                </Row>
                <T weight="b" size={16} color={tierMeta.color}>{tierMeta.nameBn} · {tierPriceLabel(tierMeta.id)}/মাস</T>
                <T size={12} color={colors.ink2} style={{ marginTop: 2 }}>{tierMeta.tagline}</T>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.ink2} />
            </Row>
          </Card>
        </Pressable>

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
          {([
            { key: 'language' as const, icon: 'language', label: 'ভাষা', sub: lang === 'bn' ? 'বাংলা' : lang === 'en' ? 'English' : 'বাংলা + English' },
            { key: 'backup' as const, icon: 'cloud-upload-outline', label: 'ব্যাকআপ', sub: 'গতকাল সিঙ্ক হয়েছে' },
            { key: 'security' as const, icon: 'shield-checkmark-outline', label: 'নিরাপত্তা', sub: `${pin ? 'PIN চালু' : 'PIN বন্ধ'}${bio ? ' · বায়োমেট্রিক চালু' : ''}` },
            { key: 'help' as const, icon: 'help-circle-outline', label: 'সাহায্য', sub: 'সাথীকে জিজ্ঞেস করুন' },
          ]).map((it, i, arr) => {
            const expanded = openPanel === (it.key as any);
            return (
              <View key={it.key} style={{ borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderBottomColor: colors.border2 }}>
                <Pressable
                  onPress={() => {
                    if (it.key === 'help') {
                      actions.openOverlay('sathi', 'সাহায্য চাই');
                    } else if (it.key === 'backup') {
                      toast.show('ম্যানুয়াল ব্যাকআপ শুরু হয়েছে…', 'success');
                    } else {
                      setOpenPanel(expanded ? null : it.key);
                    }
                  }}
                >
                  <Row gap={12} style={{ padding: 14 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={it.icon as any} size={18} color={colors.ink} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <T weight="s" size={14}>{it.label}</T>
                      <T size={12} color={colors.ink2}>{it.sub}</T>
                    </View>
                    <Ionicons name={expanded ? 'chevron-up' : 'chevron-forward'} size={18} color={colors.ink2} />
                  </Row>
                </Pressable>
                {expanded && it.key === 'language' ? (
                  <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 8 }}>
                    {([
                      { id: 'bn' as const, l: 'বাংলা', d: 'সব লেবেল বাংলায়' },
                      { id: 'en' as const, l: 'English', d: 'All labels in English' },
                      { id: 'mix' as const, l: 'বাংলা + English', d: 'দ্বিভাষিক · Bilingual' },
                    ]).map((opt) => {
                      const active = lang === opt.id;
                      return (
                        <Pressable
                          key={opt.id}
                          onPress={() => {
                            setLang(opt.id);
                            toast.show(`ভাষা পরিবর্তন: ${opt.l}`, 'success');
                          }}
                          style={{
                            padding: 12,
                            borderRadius: 10,
                            borderWidth: active ? 2 : 1,
                            borderColor: active ? colors.tealDark : colors.border2,
                            backgroundColor: active ? colors.tealSoft : '#fff',
                          }}
                        >
                          <Row gap={10}>
                            <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={18} color={active ? colors.tealDark : colors.ink2} />
                            <View style={{ flex: 1 }}>
                              <T weight="b" size={14}>{opt.l}</T>
                              <T size={12} color={colors.ink2}>{opt.d}</T>
                            </View>
                          </Row>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
                {expanded && it.key === 'security' ? (
                  <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 10 }}>
                    <Row style={{ justifyContent: 'space-between', paddingVertical: 8 }}>
                      <View style={{ flex: 1 }}>
                        <T weight="s" size={14}>PIN লক</T>
                        <T size={12} color={colors.ink2}>৪ অঙ্কের কোড দিয়ে অ্যাপ খুলুন</T>
                      </View>
                      <Switch
                        value={pin}
                        onValueChange={(v) => { setPin(v); toast.show(`PIN লক ${v ? 'চালু' : 'বন্ধ'}`, v ? 'success' : 'info'); }}
                        trackColor={{ true: colors.tealDark, false: '#cbd5e1' }}
                        thumbColor="#fff"
                      />
                    </Row>
                    <Row style={{ justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border2 }}>
                      <View style={{ flex: 1 }}>
                        <T weight="s" size={14}>বায়োমেট্রিক</T>
                        <T size={12} color={colors.ink2}>আঙুলের ছাপ / ফেস</T>
                      </View>
                      <Switch
                        value={bio}
                        onValueChange={(v) => { setBio(v); toast.show(`বায়োমেট্রিক ${v ? 'চালু' : 'বন্ধ'}`, v ? 'success' : 'info'); }}
                        trackColor={{ true: colors.tealDark, false: '#cbd5e1' }}
                        thumbColor="#fff"
                      />
                    </Row>
                    <View style={{ paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border2 }}>
                      <T weight="s" size={14}>অটো-লক</T>
                      <Row gap={8} style={{ marginTop: 8 }}>
                        {([5, 15, 60] as const).map((m) => {
                          const active = autolock === m;
                          return (
                            <Pressable
                              key={m}
                              onPress={() => { setAutolock(m); toast.show(`অটো-লক: ${m} মিনিট`, 'info'); }}
                              style={{
                                flex: 1,
                                paddingVertical: 10,
                                borderRadius: 10,
                                alignItems: 'center',
                                borderWidth: active ? 2 : 1,
                                borderColor: active ? colors.tealDark : colors.border2,
                                backgroundColor: active ? colors.tealSoft : '#fff',
                              }}
                            >
                              <T weight="b" size={13} color={active ? colors.tealDark : colors.ink}>{m} মি</T>
                            </Pressable>
                          );
                        })}
                      </Row>
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })}
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
          আরোপণ · v1.0.0 — Antarious × PKSF
        </T>
      </ScreenScroll>
    </View>
  );
}
