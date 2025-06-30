import React, { useContext, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // ✅ import API
import styles from '../styles/welcomeStyles';

export default function WelcomeScreen() {
  const { user, token, setUser } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
        const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("👤 Utente ricevuto in WelcomeScreen:", response.data);

        setUser(response.data);
      } catch (error) {
        console.warn("❗Errore nel caricamento del profilo utente in WelcomeScreen", error);
      }
    };


    fetchUser();
  }, []);

  const handleGoToHome = () => {
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Benvenuto, {user?.name || 'Utente'}!</Text>
      
      <Text style={styles.subtitle}>Il tuo portafoglio è ancora vuoto.</Text>
      
      <Text style={styles.description}>
        Inizia la tua avventura finanziaria! 🚀{'\n\n'}
        Vai nella sezione <Text style={{ fontWeight: 'bold', color: '#1976D2' }}>Consulente-AI</Text> (trovi la tab in basso)
        per scoprire i titoli consigliati e iniziare ad acquistare. 🧠📈{'\n\n'}
        Potrai gestire i tuoi primi investimenti direttamente da lì!
      </Text>

      <Button title="Vai alla Home" onPress={handleGoToHome} />
    </View>
  );
}
