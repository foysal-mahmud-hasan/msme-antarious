import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Row, T } from '../components/atoms';
import { useToast } from '../components/Toast';
import { useProducts } from '../state/ProductsStore';
import { colors, fonts, radius } from '../theme';

const emojis = ['📦', '🌀', '🧴', '👜', '☂️', '💡', '🛢️', '💇', '🧦', '🍯', '👗', '🥥', '🪥', '📚'];

export function NewProductScreen({ onClose }: { onClose: () => void }) {
  const { isDesktop } = useResponsive();
  const { addProduct } = useProducts();
  const toast = useToast();
  const [name, setName] = useState('');
  const [priceText, setPriceText] = useState('');
  const [stockText, setStockText] = useState('');
  const [emoji, setEmoji] = useState('📦');

  const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;
  const stock = parseInt(stockText.replace(/[^0-9]/g, ''), 10) || 0;
  const valid = name.trim().length > 0 && price > 0;

  const submit = () => {
    if (!valid) return;
    const p = addProduct({
      emoji,
      name: name.trim(),
      price,
      stock,
      lowThreshold: Math.max(2, Math.floor(stock * 0.2) || 5),
    });
    toast.show(`${p.emoji} ${p.name} যোগ হয়েছে`, 'success');
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
              <T weight="b" size={16}>নতুন পণ্য</T>
              <T size={12} color={colors.ink2}>ইনভেন্টরিতে যোগ করুন</T>
            </View>
          </Row>
        </View>

        <ScrollView contentContainerStyle={{ padding: isDesktop ? 24 : 16, paddingBottom: 140, alignItems: 'stretch' }} keyboardShouldPersistTaps="handled">
          <View style={{ width: '100%', maxWidth: 540, alignSelf: 'center' }}>
            <T size={12} color={colors.ink2} weight="m" style={{ marginBottom: 8 }}>আইকন বাছুন</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {emojis.map((e) => {
                const active = e === emoji;
                return (
                  <Pressable
                    key={e}
                    onPress={() => setEmoji(e)}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: active ? 2 : 1,
                      borderColor: active ? colors.saffron : colors.border2,
                      backgroundColor: active ? colors.saffronSoft : '#fff',
                    }}
                  >
                    <T size={22}>{e}</T>
                  </Pressable>
                );
              })}
            </View>

            <T size={12} color={colors.ink2} weight="m" style={{ marginTop: 18, marginBottom: 8 }}>পণ্যের নাম</T>
            <View style={inputBox}>
              <Ionicons name="pricetag-outline" size={18} color={colors.ink2} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="যেমন: কুলিং বোতল"
                placeholderTextColor={colors.ink2}
                style={inputStyle}
              />
            </View>

            <Row gap={10} style={{ marginTop: 14 }}>
              <View style={{ flex: 1 }}>
                <T size={12} color={colors.ink2} weight="m" style={{ marginBottom: 8 }}>দাম (৳)</T>
                <View style={inputBox}>
                  <T size={16} color={colors.ink2}>৳</T>
                  <TextInput
                    value={priceText}
                    onChangeText={(t) => setPriceText(t.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    placeholderTextColor={colors.ink2}
                    keyboardType="numeric"
                    inputMode="numeric"
                    style={inputStyle}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <T size={12} color={colors.ink2} weight="m" style={{ marginBottom: 8 }}>মজুদ</T>
                <View style={inputBox}>
                  <Ionicons name="cube-outline" size={18} color={colors.ink2} />
                  <TextInput
                    value={stockText}
                    onChangeText={(t) => setStockText(t.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    placeholderTextColor={colors.ink2}
                    keyboardType="numeric"
                    inputMode="numeric"
                    style={inputStyle}
                  />
                </View>
              </View>
            </Row>
          </View>
        </ScrollView>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 14, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.border2 }}>
          <View style={{ width: '100%', maxWidth: 540, alignSelf: 'center' }}>
            <Btn label="পণ্য যোগ করুন" full disabled={!valid} onPress={submit} iconRight={<Ionicons name="checkmark-circle" size={18} color="#fff" />} />
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
