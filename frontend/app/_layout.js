import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { useContext, useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native'; // Import di Text per evitare avvisi durante il rendering
import Toast from 'react-native-toast-message';

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
    // Spinner e testo mostrati durante il caricamento per evitare warning
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 12 }}>Caricamento...</Text>
      </View>
    );
  }

  return (
    <>
      <Slot />
      <Toast />
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
