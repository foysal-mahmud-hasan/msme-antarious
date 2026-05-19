import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsive } from '../components/AppFrame';
import { Btn, Card, Row, T } from '../components/atoms';
import { colors, fonts, radius } from '../theme';
import { demoCredentials, useAuth } from './AuthContext';

export function LoginScreen() {
  const { signIn } = useAuth();
  const { isDesktop } = useResponsive();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    const res = await signIn(username, password);
    setLoading(false);
    if (!res.ok) setError(res.error);
  };

  const quickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDesktop ? '#f8f5ef' : colors.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            isDesktop ? { paddingVertical: 60 } : null,
          ]}
          keyboardShouldPersistTaps="handled"
        >
        <View style={{ width: '100%', maxWidth: 460, alignSelf: 'center' }}>
          <View style={styles.logoWrap}>
            <View style={styles.logoBlock}>
              <T weight="b" color="#fff" size={64}>উ</T>
            </View>
            <T weight="b" size={26} style={{ marginTop: 16 }}>উদ্যোম</T>
            <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>
              Uddyom · MSME ব্যবসায়িক সঙ্গী
            </T>
            <T size={11.5} color={colors.ink2} style={{ marginTop: 2 }}>
              by Antarious × PKSF
            </T>
          </View>

          <Card style={styles.card}>
            <T weight="b" size={18}>লগইন করুন</T>
            <T size={13} color={colors.ink2} style={{ marginTop: 4 }}>
              ইউজারনেম ও পাসওয়ার্ড দিয়ে শুরু করুন
            </T>

            <View style={{ marginTop: 18, gap: 12 }}>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={18} color={colors.ink2} />
                <TextInput
                  placeholder="ইউজারনেম"
                  placeholderTextColor={colors.ink2}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                />
              </View>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.ink2} />
                <TextInput
                  placeholder="পাসওয়ার্ড"
                  placeholderTextColor={colors.ink2}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
              </View>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={colors.coral} />
                <T size={13} color={colors.coral} style={{ flex: 1 }}>{error}</T>
              </View>
            ) : null}

            <Btn
              label="প্রবেশ করুন"
              onPress={onSubmit}
              loading={loading}
              full
              style={{ marginTop: 16 }}
              iconRight={<Ionicons name="arrow-forward" size={18} color="#fff" />}
            />
          </Card>

          <View style={{ marginTop: 22 }}>
            <Row gap={8} style={{ paddingHorizontal: 4, marginBottom: 8 }}>
              <View style={{ height: 1, backgroundColor: colors.border2, flex: 1 }} />
              <T size={11} color={colors.ink2} weight="m">ডেমো অ্যাকাউন্ট</T>
              <View style={{ height: 1, backgroundColor: colors.border2, flex: 1 }} />
            </Row>
            {demoCredentials.map((c) => (
              <Pressable key={c.username} onPress={() => quickLogin(c.username, c.password)} style={styles.demo}>
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 19,
                    backgroundColor: c.username === 'joy' ? '#1d4ed8' : colors.saffron,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <T weight="b" color="#fff" size={15}>
                    {c.username === 'joy' ? 'জ' : 'ফ'}
                  </T>
                </View>
                <View style={{ flex: 1 }}>
                  <T weight="b" size={14}>{c.username}</T>
                  <T size={12} color={colors.ink2}>{c.desc}</T>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.ink2} />
              </Pressable>
            ))}
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 22,
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBlock: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.saffron,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.saffronDark,
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  card: { padding: 18 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    flex: 1,
    fontFamily: fonts.medium,
    color: colors.ink,
    paddingVertical: 14,
    fontSize: 15,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.coralSoft,
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  demo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border2,
    marginBottom: 8,
  },
});
