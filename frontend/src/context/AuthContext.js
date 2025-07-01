// Contesto globale per la gestione dell'autenticazione
import React, { createContext, useState, useEffect } from 'react';
import { View, Text } from 'react-native'; // Import di View e Text necessari per visualizzare lo stato di caricamento
import { useRouter } from 'expo-router';
import { saveToken, getToken, deleteToken } from '../services/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedToken = await getToken('token');
        const savedUser = await getToken('user');

        if (savedToken) setToken(savedToken);
        if (savedUser && savedUser !== 'undefined') {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Errore durante il caricamento dei dati da storage:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const login = async (newToken, userData) => {
    await saveToken('token', newToken);
    await saveToken('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    await deleteToken('token');
    await deleteToken('user');
    setToken(null);
    setUser(null);
    router.replace('/login');
  };

  const isAuthenticated = !!token;

  // Durante il caricamento viene mostrato un indicatore con messaggio
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Caricamento...</Text>
      </View>
    );
  }

  return (
      <AuthContext.Provider
      value={{ token, user, login, logout, isAuthenticated, loading, setUser }}
      >

      {children}
    </AuthContext.Provider>
  );
};
