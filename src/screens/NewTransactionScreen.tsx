import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Card, Row, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { TxKind, useTransactions } from '../state/TransactionsStore';
import { colors, fonts, radius } from '../theme';

const quickAmounts = [100, 500, 1000, 2000, 5000];

export function NewTransactionScreen({ onClose }: { onClose: () => void }) {
  const { addTransaction } = useTransactions();
  const toast = useToast();
  const { isDesktop } = useResponsive();
  const [kind, setKind] = useState<TxKind>('income');
  const [amountText, setAmountText] = useState('');
  const [name, setName] = useState('');
  const [counterparty, setCounterparty] = useState('');

  const amount = parseInt(amountText.replace(/[^0-9]/g, ''), 10) || 0;
  const valid = amount > 0 && name.trim().length > 0;

  const submit = () => {
    if (!valid) return;
    addTransaction({
      kind,
      amount,
      name: name.trim(),
      counterparty: counterparty.trim() || (kind === 'income' ? 'গ্রাহক' : 'অন্যান্য'),
    });
    toast.show(
      `${kind === 'income' ? '+' : '-'}৳${amount.toLocaleString('en-US')} ${kind === 'income' ? 'আয়' : 'ব্যয়'} যোগ হয়েছে`,
      'success'
    );
    onClose();
  };

  const accent = kind === 'income' ? colors.green : colors.coral;
  const accentSoft = kind === 'income' ? colors.greenSoft : colors.coralSoft;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ backgroundColor: '#fff', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
          <Row gap={10}>
            <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
              <Ionicons name={isDesktop ? 'close' : 'arrow-back'} size={20} color={colors.ink} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <T weight="b" size={16}>নতুন লেনদেন</T>
              <T size={12} color={colors.ink2}>আয় বা ব্যয় যোগ করুন</T>
            </View>
          </Row>
        </View>

        <ScrollView
          contentContainerStyle={{
            padding: isDesktop ? 28 : 16,
            paddingBottom: 140,
            alignItems: 'stretch',
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: '100%', maxWidth: 560, alignSelf: 'center' }}>
            <T size={12} color={colors.ink2} weight="m" style={{ marginBottom: 8 }}>লেনদেনের ধরন</T>
            <Row gap={10}>
              {([
                { id: 'income' as const, l: 'আয়', e: '⬇️', col: colors.green, soft: colors.greenSoft },
                { id: 'expense' as const, l: 'ব্যয়', e: '⬆️', col: colors.coral, soft: colors.coralSoft },
              ]).map((o) => {
                const active = kind === o.id;
                return (
                  <Pressable
                    key={o.id}
                    onPress={() => setKind(o.id)}
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 14,
                      borderWidth: active ? 2 : 1,
                      borderColor: active ? o.col : colors.border2,
                      backgroundColor: active ? o.soft : '#fff',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <T size={24}>{o.e}</T>
                    <T weight="b" size={15} color={active ? o.col : colors.ink}>{o.l}</T>
                  </Pressable>
                );
              })}
            </Row>

            <T size={12} color={colors.ink2} weight="m" style={{ marginTop: 18, marginBottom: 8 }}>পরিমাণ (৳)</T>
            <Card style={{ padding: 16, borderColor: accent, borderWidth: 1.5, backgroundColor: accentSoft }}>
              <Row gap={6} style={{ alignItems: 'baseline' }}>
                <T weight="b" size={28} color={accent}>৳</T>
                <TextInput
                  value={amountText}
                  onChangeText={(t) => setAmountText(t.replace(/[^0-9]/g, ''))}
                  placeholder="০"
                  placeholderTextColor={colors.ink2}
                  keyboardType="numeric"
                  inputMode="numeric"
                  style={{
                    flex: 1,
                    fontFamily: fonts.bold,
                    fontSize: 32,
                    color: accent,
                    paddingVertical: 4,
                  }}
                />
              </Row>
              <Row gap={6} style={{ marginTop: 12, flexWrap: 'wrap' }}>
                {quickAmounts.map((a) => (
                  <Pressable
                    key={a}
                    onPress={() => setAmountText(String(a))}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 999,
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: colors.border2,
                    }}
                  >
                    <T size={12.5} weight="m" color={colors.ink}>৳{a.toLocaleString('en-US')}</T>
                  </Pressable>
                ))}
              </Row>
            </Card>

            <T size={12} color={colors.ink2} weight="m" style={{ marginTop: 18, marginBottom: 8 }}>
              {kind === 'income' ? 'কী বিক্রি করেছেন?' : 'কী খরচ হয়েছে?'}
            </T>
            <View style={inputBox}>
              <Ionicons name={kind === 'income' ? 'cart-outline' : 'receipt-outline'} size={18} color={colors.ink2} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={kind === 'income' ? 'মিনি ফ্যান × ২' : 'বিদ্যুৎ বিল'}
                placeholderTextColor={colors.ink2}
                style={inputStyle}
              />
            </View>

            <T size={12} color={colors.ink2} weight="m" style={{ marginTop: 14, marginBottom: 8 }}>
              {kind === 'income' ? 'কাস্টমার (ঐচ্ছিক)' : 'উৎস (ঐচ্ছিক)'}
            </T>
            <View style={inputBox}>
              <Ionicons name="person-outline" size={18} color={colors.ink2} />
              <TextInput
                value={counterparty}
                onChangeText={setCounterparty}
                placeholder={kind === 'income' ? 'করিম সাহেব' : 'রহমান ট্রেডার্স'}
                placeholderTextColor={colors.ink2}
                style={inputStyle}
              />
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            padding: 14,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: colors.border2,
          }}
        >
          <View style={{ width: '100%', maxWidth: 560, alignSelf: 'center' }}>
            <Btn
              label="সংরক্ষণ করুন"
              full
              disabled={!valid}
              onPress={submit}
              iconRight={<Ionicons name="checkmark-circle" size={18} color="#fff" />}
              kind={kind === 'income' ? 'teal' : 'coral'}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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

const inputBox = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  gap: 8,
  paddingHorizontal: 14,
  backgroundColor: '#fff',
  borderRadius: radius.md,
  borderWidth: 1,
  borderColor: colors.border,
};

const inputStyle = {
  flex: 1,
  paddingVertical: 12,
  fontFamily: fonts.medium,
  color: colors.ink,
  fontSize: 15,
};
