import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/welcomeStyles';

export default function WelcomeScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const handleDiscoverAssets = () => {
    router.replace('/suggested-assets'); // ora reindirizza lì
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Benvenuto, {user?.name || 'Utente'}!</Text>
      <Text style={styles.subtitle}>Il tuo portafoglio è ancora vuoto.</Text>
      <Text style={styles.description}>
        Inizia il tuo percorso simulando il primo investimento. FinPilot ti aiuterà a scegliere l’asset giusto.
      </Text>
      <Button title="Scopri asset suggeriti" onPress={handleDiscoverAssets} />
    </View>
  );
}
