import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // ✅ sostituito useNavigation

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // ✅ router di expo-router

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      if (savedToken) setToken(savedToken);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (newToken) => {
    await AsyncStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    router.replace('/login'); // ✅ redirect con expo-router
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
