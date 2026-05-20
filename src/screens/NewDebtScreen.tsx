import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Row, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { useDebts } from '../state/DebtsStore';
import { colors, fonts, radius } from '../theme';

export function NewDebtScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  const { addDebt } = useDebts();
  const toast = useToast();
  const [name, setName] = useState('');
  const [amountText, setAmountText] = useState('');
  const [contact, setContact] = useState<'হোয়াটসঅ্যাপ' | 'কল'>('হোয়াটসঅ্যাপ');

  const amount = parseInt(amountText.replace(/[^0-9]/g, ''), 10) || 0;
  const valid = name.trim().length > 0 && amount > 0;

  const submit = () => {
    if (!valid) return;
    const d = addDebt({ name: name.trim(), amount, contact });
    toast.show(`${d.name} · ৳${amount.toLocaleString('en-US')} বাকি যোগ হয়েছে`, 'success');
    onClose();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ backgroundColor: '#fff', padding: 14, borderBottomWidth: 1, borderBottomColor: colors.border2 }}>
          <Row gap={10}>
            <Pressable onPress={onClose} hitSlop={6} style={iconBtn}>
              <Ionicons name={isDesktop ? 'close' : 'arrow-back'} size={20} color={colors.ink} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <T weight="b" size={16}>নতুন বাকি</T>
              <T size={12} color={colors.ink2}>কাস্টমার খাতায় যোগ করুন</T>
            </View>
          </Row>
        </View>

        <ScrollView contentContainerStyle={{ padding: isDesktop ? 24 : 16, paddingBottom: 140, alignItems: 'stretch' }} keyboardShouldPersistTaps="handled">
          <View style={{ width: '100%', maxWidth: 540, alignSelf: 'center' }}>
            <T size={12} color={colors.ink2} weight="m" style={{ marginBottom: 8 }}>কাস্টমারের নাম</T>
            <View style={inputBox}>
              <Ionicons name="person-outline" size={18} color={colors.ink2} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="যেমন: রহিম মিয়া"
                placeholderTextColor={colors.ink2}
                style={inputStyle}
              />
            </View>

            <T size={12} color={colors.ink2} weight="m" style={{ marginTop: 14, marginBottom: 8 }}>বাকি পরিমাণ (৳)</T>
            <View style={[inputBox, { borderColor: colors.coral, borderWidth: 1.5, backgroundColor: colors.coralSoft }]}>
              <T size={20} weight="b" color={colors.coral}>৳</T>
              <TextInput
                value={amountText}
                onChangeText={(t) => setAmountText(t.replace(/[^0-9]/g, ''))}
                placeholder="0"
                placeholderTextColor={colors.ink2}
                keyboardType="numeric"
                inputMode="numeric"
                style={[inputStyle, { fontSize: 22, fontFamily: fonts.bold, color: colors.coral }]}
              />
            </View>

            <T size={12} color={colors.ink2} weight="m" style={{ marginTop: 14, marginBottom: 8 }}>যোগাযোগ মাধ্যম</T>
            <Row gap={10}>
              {(['হোয়াটসঅ্যাপ' as const, 'কল' as const]).map((c) => {
                const active = contact === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setContact(c)}
                    style={{
                      flex: 1,
                      padding: 14,
                      borderRadius: 12,
                      borderWidth: active ? 2 : 1,
                      borderColor: active ? colors.tealDark : colors.border2,
                      backgroundColor: active ? colors.tealSoft : '#fff',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Ionicons
                      name={c === 'হোয়াটসঅ্যাপ' ? 'logo-whatsapp' : 'call-outline'}
                      size={18}
                      color={active ? colors.tealDark : colors.ink}
                    />
                    <T weight="b" size={14} color={active ? colors.tealDark : colors.ink}>{c}</T>
                  </Pressable>
                );
              })}
            </Row>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border2 }}>
          <View style={{ width: '100%', maxWidth: 540, alignSelf: 'center' }}>
            <Btn label="বাকি যোগ করুন" kind="coral" full disabled={!valid} onPress={submit} iconRight={<Ionicons name="checkmark-circle" size={18} color="#fff" />} />
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
