import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import styles from '../styles/loginStyles';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Errore", "Compila tutti i campi");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Errore", "Le password non coincidono");
      return;
    }

    setIsLoading(true);

    try {
      const jsonData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
      };

      console.log("📨 Invio registrazione:", jsonData);
      await api.post('/auth/register', jsonData);
      console.log("✅ Registrazione riuscita, ora login...");

      const formData = new URLSearchParams();
      formData.append('username', email.trim());
      formData.append('password', password);

      const loginResponse = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = loginResponse.data.access_token;
      console.log("🔐 Token ricevuto:", token);

      await login(token);

      // ⏳ Leggero delay per evitare race condition
      setTimeout(() => {
        router.replace('/welcome');
      }, 100);

    } catch (error) {
      console.error("❌ Errore registrazione:", error);
      Alert.alert("Errore", error.response?.data?.detail || "Registrazione fallita.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrati</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Conferma Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Button
        title={isLoading ? "Registrazione in corso..." : "Registrati"}
        onPress={handleRegister}
        disabled={isLoading}
      />

      <Text style={{ marginTop: 20 }}>
        Hai già un account?
        <Text
          style={{ color: 'blue', textDecorationLine: 'underline' }}
          onPress={() => router.push('/login')}
        >
          {' '}Accedi
        </Text>
      </Text>
    </View>
  );
}
