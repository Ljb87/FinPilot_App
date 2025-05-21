import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../services/api';
import styles from '../styles/loginStyles';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMessage('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;

      if (access_token) {
        await login(access_token);
        console.log('✅ Token ricevuto e salvato:', access_token);
      } else {
        setErrorMessage('Token non ricevuto dal server');
      }

    } catch (error) {
      console.error('❌ Errore di login:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        setErrorMessage('Email o password errati');
      } else if (error.response?.status === 422) {
        setErrorMessage('Compila correttamente tutti i campi');
      } else {
        setErrorMessage('Errore di rete. Riprova più tardi');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorMessage('');
        }}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrorMessage('');
        }}
      />

      <Button title="Accedi" onPress={handleLogin} />

      {errorMessage !== '' && (
        <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>
      )}

      <Text style={{ marginTop: 20 }}>
        Non hai un account?
        <Text
          style={{ color: 'blue', textDecorationLine: 'underline' }}
          onPress={() => router.push('/register')}
        >
          {' '}Registrati
        </Text>
      </Text>
    </View>
  );
}

