import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Btn, Card, Chip, Row, SathiBadge, T } from '../components/atoms';
import { ScreenScroll } from '../components/ScreenContainer';
import { useToast } from '../components/Toast';
import { toBn } from '../data/strings';
import { useActions } from '../state/AppActions';
import { useDebts } from '../state/DebtsStore';
import { colors } from '../theme';

function kindFor(days: number): 'coral' | 'amber' | 'green' {
  if (days >= 25) return 'coral';
  if (days >= 10) return 'amber';
  return 'green';
}

export function LedgerScreen({ onClose }: { onClose: () => void }) {
  const { debts, total, settleDebt } = useDebts();
  const actions = useActions();
  const toast = useToast();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ backgroundColor: '#fff', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
        <Row gap={10}>
          <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
            <Ionicons name="arrow-back" size={20} color={colors.ink} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <T weight="b" size={16}>কাস্টমার খাতা</T>
            <T size={12} color={colors.ink2}>মোট বাকি: {debts.length} জন</T>
          </View>
          <T weight="b" size={20} color={colors.coral}>৳{toBn(total.toLocaleString('en-US'))}</T>
        </Row>
      </View>

      <ScreenScroll>
        <Card tinted={colors.coralSoft} style={{ padding: 14, marginBottom: 14 }}>
          <Row gap={8}>
            <SathiBadge />
            <T weight="b" size={14}>সাথীর সতর্কতা</T>
          </Row>
          <T size={14} style={{ marginTop: 6, lineHeight: 20 }}>
            <T weight="b">রহিম মিয়া</T> ৩২ দিন ধরে বাকি — মনে করিয়ে দিতে পারেন।
          </T>
          <Btn
            kind="coral"
            label="রহিম মিয়াকে SMS পাঠান"
            full
            size="sm"
            style={{ marginTop: 12 }}
            onPress={() => toast.show('রহিম মিয়াকে অনুস্মারক SMS পাঠানো হয়েছে', 'success')}
          />
        </Card>

        <Card style={{ padding: 4 }}>
          {debts.map((d, i) => {
            const kind = kindFor(d.days);
            return (
              <Pressable
                key={d.id}
                onPress={() => {
                  settleDebt(d.id);
                  toast.show(`${d.name} · ৳${toBn(d.amount.toLocaleString('en-US'))} পরিশোধ চিহ্নিত`, 'success');
                }}
              >
                <Row
                  gap={12}
                  style={{
                    padding: 14,
                    borderTopWidth: i ? 1 : 0,
                    borderTopColor: colors.border2,
                  }}
                >
                  <Avatar text={d.avatarInitial} bg={d.avatarColor} color={colors.ink} />
                  <View style={{ flex: 1 }}>
                    <Row style={{ justifyContent: 'space-between' }}>
                      <T weight="b" size={14.5}>{d.name}</T>
                      <T weight="b" size={14.5} color={kind === 'coral' ? colors.coral : kind === 'amber' ? colors.amber : colors.green}>
                        ৳{toBn(d.amount.toLocaleString('en-US'))}
                      </T>
                    </Row>
                    <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
                      <T size={12} color={colors.ink2}>{toBn(d.days)} দিন · {d.contact}</T>
                      <Chip kind={kind} size={10}>{kind === 'coral' ? 'জরুরি' : kind === 'amber' ? 'খেয়াল রাখুন' : 'সাম্প্রতিক'}</Chip>
                    </Row>
                  </View>
                </Row>
              </Pressable>
            );
          })}
          {debts.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <T size={28}>✅</T>
              <T size={13} color={colors.ink2} style={{ marginTop: 8 }}>কোনো বাকি নেই</T>
            </View>
          ) : null}
        </Card>

        <Btn
          kind="greyOutline"
          label="নতুন বাকি যোগ করুন"
          full
          style={{ marginTop: 14 }}
          iconLeft={<Ionicons name="add" size={16} color={colors.ink2} />}
          onPress={() => actions.openOverlay('newDebt')}
        />
      </ScreenScroll>
    </SafeAreaView>
  );
}

const iconBtn = {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: colors.bg,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};
