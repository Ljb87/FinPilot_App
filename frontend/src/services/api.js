import axios from 'axios';
import { router } from 'expo-router';
import { Alert, Platform } from 'react-native';
import { deleteToken, getToken } from './storage';

let isRedirecting = false;

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Intercettore per aggiungere il token a ogni richiesta
api.interceptors.request.use(
  async (config) => {
    const token = await getToken('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔐 Intercettore globale per gestire errori 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      console.warn('🔐 Token scaduto o non valido. Logout automatico.');
      isRedirecting = true;

      await deleteToken('token');

      // ✅ Mostra un messaggio all'utente solo una volta
      if (Platform.OS === 'web') {
        alert("Sessione scaduta. Verrai reindirizzato al login.");
      } else {
        Alert.alert("Sessione scaduta", "Per favore, accedi di nuovo.");
      }

      // ✅ Evita redirect multipli
      if (router?.pathname !== '/login') {
        router.replace('/login');
      }

      // 🔁 Reset del flag dopo un po', per eventuali futuri logout
      setTimeout(() => {
        isRedirecting = false;
      }, 3000);
    }

    return Promise.reject(error);
  }
);

export default api;

