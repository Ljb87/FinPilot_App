import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { useContext, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message'; // ✅ Import aggiunto

function ProtectedLayout() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const isAuthRoute = segments[0] === 'login' || segments[0] === 'register';

      if (!isAuthenticated && !isAuthRoute) {
        router.replace('/login');
      }

      if (isAuthenticated && isAuthRoute) {
        router.replace('/(drawer)/(tabs)/home');
      }
    }
  }, [segments, isAuthenticated, loading]);

  if (loading) {
    // Spinner mentre carica lo stato di autenticazione
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <>
      <Slot />
      <Toast /> {/* ✅ Toast incluso nel layout */}
    </>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <ProtectedLayout />
    </AuthProvider>
  );
}
