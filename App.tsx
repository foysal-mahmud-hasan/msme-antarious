import {
  HindSiliguri_400Regular,
  HindSiliguri_500Medium,
  HindSiliguri_600SemiBold,
  HindSiliguri_700Bold,
} from '@expo-google-fonts/hind-siliguri';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/auth/AuthContext';
import { LoginScreen } from './src/auth/LoginScreen';
import { AppFrame } from './src/components/AppFrame';
import { T } from './src/components/atoms';
import { ToastProvider } from './src/components/Toast';
import { Shell } from './src/navigation/Shell';
import {
  SathiOnboardingScreen,
  isOnboarded,
  markOnboarded,
  markOnboardedSkipped,
} from './src/screens/SathiOnboardingScreen';
import { DebtsProvider } from './src/state/DebtsStore';
import { EntitlementsProvider } from './src/state/EntitlementsStore';
import { LeadsProvider } from './src/state/LeadsStore';
import { ProductsProvider } from './src/state/ProductsStore';
import { TransactionsProvider } from './src/state/TransactionsStore';
import { colors } from './src/theme';

function Gate() {
  const { user, loading } = useAuth();
  const [checkingOnboard, setCheckingOnboard] = React.useState(true);
  const [needsOnboarding, setNeedsOnboarding] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!user || user.hasPOPortal) {
        if (alive) {
          setNeedsOnboarding(false);
          setCheckingOnboard(false);
        }
        return;
      }
      setCheckingOnboard(true);
      const done = await isOnboarded(user.id);
      if (alive) {
        setNeedsOnboarding(!done);
        setCheckingOnboard(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [user?.id]);

  if (loading || (user && checkingOnboard)) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: colors.saffron,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <T weight="b" color="#fff" size={48}>আ</T>
        </View>
        <ActivityIndicator color={colors.saffron} />
      </View>
    );
  }
  if (!user) return <LoginScreen />;
  if (needsOnboarding) {
    return (
      <SathiOnboardingScreen
        defaultName={user.bengaliName}
        onFinish={async (payload) => {
          await markOnboarded(user.id, payload);
          setNeedsOnboarding(false);
        }}
        onSkip={async () => {
          await markOnboardedSkipped(user.id);
          setNeedsOnboarding(false);
        }}
      />
    );
  }
  return <Shell />;
}

export default function App() {
  const [loaded] = useFonts({
    HindSiliguri_400Regular,
    HindSiliguri_500Medium,
    HindSiliguri_600SemiBold,
    HindSiliguri_700Bold,
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.saffron} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AppFrame>
        <ToastProvider>
          <AuthProvider>
            <EntitlementsProvider>
              <TransactionsProvider>
                <ProductsProvider>
                  <DebtsProvider>
                    <LeadsProvider>
                      <Gate />
                    </LeadsProvider>
                  </DebtsProvider>
                </ProductsProvider>
              </TransactionsProvider>
            </EntitlementsProvider>
          </AuthProvider>
        </ToastProvider>
      </AppFrame>
    </SafeAreaProvider>
  );
}
