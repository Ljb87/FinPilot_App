import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/homeStyles';

export default function HomeScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();

  const fetchStats = async () => {
    try {
      const response = await api.get('/portfolio/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Errore nel recupero delle statistiche:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);


  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 40 }} />;
  }

  if (!stats) {
    return <Text style={styles.error}>Errore nel caricamento della dashboard</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📊 Dashboard Finanziaria</Text>

      <View style={styles.card}>
        <Text style={styles.label}>💰 Totale Investito:</Text>
        <Text style={styles.value}>€ {stats.total_invested}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📈 Valore Attuale:</Text>
        <Text style={styles.value}>€ {stats.current_value}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📊 Guadagno/Perdita:</Text>
        <Text style={styles.value}>€ {stats.total_profit_loss}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📉 Performance Media:</Text>
        <Text style={styles.value}>{stats.average_performance_percent}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📦 Numero di Asset:</Text>
        <Text style={styles.value}>{stats.number_of_assets}</Text>
      </View>
    </ScrollView>
  );
}
