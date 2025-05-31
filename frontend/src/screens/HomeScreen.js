import React, { useState, useContext, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/homeStyles';
import { PieChart, LineChart } from 'react-native-chart-kit';

export default function HomeScreen() {
  const [portfolio, setPortfolio] = useState([]);
  const [topAsset, setTopAsset] = useState(null);
  const [worstAsset, setWorstAsset] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await api.get('/portfolio/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(response.data.assets);
    } catch (error) {
      console.error('Errore nel recupero del portafoglio:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopAssetHistory = async () => {
    try {
      const response = await api.get('/portfolio/top-asset/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopAsset(response.data);
    } catch (error) {
      console.error('Errore nel recupero dell’asset migliore:', error);
    }
  };

  const fetchWorstAssetHistory = async () => {
    try {
      const response = await api.get('/portfolio/worst-asset/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorstAsset(response.data);
    } catch (error) {
      console.error('Errore nel recupero dell’asset peggiore:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/portfolio/alerts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAlerts(response.data);
    } catch (error) {
      console.error('Errore nel recupero degli alert:', error);
    }
  };

  const calculateStats = (assets) => {
    let totalInvested = 0;
    let currentValue = 0;

    assets.forEach(asset => {
      const invested = asset.quantity * asset.purchase_price;
      const valueNow = asset.quantity * asset.current_price;
      totalInvested += invested;
      currentValue += valueNow;
    });

    const totalProfitLoss = currentValue - totalInvested;
    const averagePerformance = totalInvested === 0 ? 0 : (totalProfitLoss / totalInvested) * 100;

    return {
      total_invested: totalInvested.toFixed(2),
      current_value: currentValue.toFixed(2),
      total_profit_loss: totalProfitLoss.toFixed(2),
      average_performance_percent: averagePerformance.toFixed(2),
      number_of_assets: assets.length,
    };
  };

  const chartData = portfolio.map((asset, index) => {
    const value = asset.quantity * asset.current_price;
    const colors = ['#F57C00', '#4CAF50', '#1976D2', '#E3D5C5', '#9C27B0', '#FF5722'];
    return {
      name: asset.symbol,
      value: value,
      color: colors[index % colors.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    };
  }).filter(entry => entry.value > 0);

  useFocusEffect(
    useCallback(() => {
      fetchPortfolio();
      fetchTopAssetHistory();
      fetchWorstAssetHistory();
      fetchAlerts();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 40 }} />;
  }

  const stats = calculateStats(portfolio);

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
        <Text style={[
          styles.value,
          { color: stats.total_profit_loss >= 0 ? '#4CAF50' : '#f44336' }
        ]}>
          € {stats.total_profit_loss}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📉 Performance Media:</Text>
        <Text style={[
          styles.value,
          { color: stats.average_performance_percent >= 0 ? '#4CAF50' : '#f44336' }
        ]}>
          {stats.average_performance_percent}%
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📦 Numero di Asset:</Text>
        <Text style={styles.value}>{stats.number_of_assets}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: '#FFF9E5', borderLeftWidth: 5, borderLeftColor: '#F57C00' }]}>
        <Text style={styles.label}>📣 Suggerimenti FinPilot</Text>
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <Text
              key={index}
              style={{
                color: alert.type === 'buy' ? '#4CAF50' : '#f44336',
                marginTop: 4,
              }}
            >
              {alert.type === 'buy' ? '✅ Compra' : '⚠️ Vendi'} {alert.symbol} → {alert.reason}
            </Text>
          ))
        ) : (
          <Text style={{ color: '#777', marginTop: 4 }}>
            💤 Titoli stabili – Nessun suggerimento per il momento.
          </Text>
        )}
      </View>


      {chartData.length > 0 && (
        <>
          <Text style={[styles.title, { marginTop: 30 }]}>📊 Distribuzione per Asset</Text>
          <PieChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            accessor="value"
            backgroundColor="transparent"
            paddingLeft="15"
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              color: () => '#333',
              labelColor: () => '#666',
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </>
      )}

      {(topAsset && topAsset.history.length > 0) || (worstAsset && worstAsset.history.length > 0) ? (
        <>
          <Text style={[styles.title, { marginTop: 30 }]}>🏆 Migliore vs Peggiore (7 giorni)</Text>

          {topAsset && topAsset.history.length > 0 && (
            <>
              <Text style={styles.label}>📈 Migliore – {topAsset.symbol}</Text>
              <LineChart
                data={{
                  labels: topAsset.history.map(h => h.date.slice(5)),
                  datasets: [{ data: topAsset.history.map(h => h.price) }],
                }}
                width={Dimensions.get('window').width - 40}
                height={220}
                yAxisLabel="€"
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 2,
                  color: () => '#4CAF50',
                  labelColor: () => '#666',
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </>
          )}

          {worstAsset && worstAsset.history.length > 0 && (
            <>
              <Text style={styles.label}>📉 Peggiore – {worstAsset.symbol}</Text>
              <LineChart
                data={{
                  labels: worstAsset.history.map(h => h.date.slice(5)),
                  datasets: [{ data: worstAsset.history.map(h => h.price) }],
                }}
                width={Dimensions.get('window').width - 40}
                height={220}
                yAxisLabel="€"
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 2,
                  color: () => '#f44336',
                  labelColor: () => '#666',
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </>
          )}
        </>
      ) : null}
    </ScrollView>
  );
}
