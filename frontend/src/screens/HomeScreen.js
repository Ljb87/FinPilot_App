import React, { useState, useContext, useCallback } from 'react';
import { View, Text, ActivityIndicator, ScrollView, useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await api.get('/portfolio/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const assets = response.data.assets;
      setPortfolio(assets);

      if (assets.length === 0) {
        setTopAsset(null);
        setWorstAsset(null);
      }
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
      //console.error('Errore nel recupero dell’asset migliore:', error);
    }
  };

  const fetchWorstAssetHistory = async () => {
    try {
      const response = await api.get('/portfolio/worst-asset/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorstAsset(response.data);
    } catch (error) {
      //console.error('Errore nel recupero dell’asset peggiore:', error);
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
    const colors = ['#FFB74D', '#81C784', '#64B5F6', '#D7CCC8', '#BA68C8', '#4DD0E1'];
    return {
      name: asset.symbol,
      value: value,
      color: colors[index % colors.length],
      legendFontColor: '#444',
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

      {/* 📭 Messaggio visibile solo se il portafoglio è vuoto */}
      {portfolio.length === 0 && (
        <View style={[styles.card, { backgroundColor: '#fff3cd', borderColor: '#ffeeba' }]}>
          <Text style={{ color: '#856404', textAlign: 'center' }}>
            📭 Il tuo portafoglio è vuoto. Vai su <Text style={{ fontWeight: 'bold' }}>Consulente-AI</Text> per acquistare il tuo primo asset!
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>💼 Riepilogo Investimento</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoTextLabel}>Totale Investito</Text>
          <Text style={styles.infoTextValue}>€ {stats.total_invested}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoTextLabel}>Valore Attuale</Text>
          <Text style={styles.infoTextValue}>€ {stats.current_value}</Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoTextLabel}>Guadagno</Text>
          <Text style={[
            styles.infoTextValue,
            { color: stats.total_profit_loss >= 0 ? '#4CAF50' : '#f44336' }
          ]}>
            € {stats.total_profit_loss}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📊 Performance Generale</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoTextLabel}>Media</Text>
          <Text style={[
            styles.infoTextValue,
            { color: stats.average_performance_percent >= 0 ? '#4CAF50' : '#f44336' }
          ]}>
            {stats.average_performance_percent}%
          </Text>
        </View>
        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoTextLabel}>Asset in Portafoglio</Text>
          <Text style={styles.infoTextValue}>{stats.number_of_assets}</Text>
        </View>
      </View>

      {chartData.length > 0 && (
        <>
          <Text style={styles.sectionDivider}>📈 Distribuzione per Asset</Text>
          <View style={styles.graphContainer}>
            <PieChart
              data={chartData}
              width={width - 40}
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
          </View>
        </>
      )}

      {/* 🏆 Migliore vs Peggiore */}
      {portfolio.length > 1 ? (
        (topAsset?.history?.length > 0 || worstAsset?.history?.length > 0) && (
          <>
            <Text style={styles.sectionDivider}>🏆 Migliore vs Peggiore (7 giorni)</Text>

            {/* ℹ️ Messaggio se topAsset e worstAsset coincidono */}
            {topAsset?.symbol && worstAsset?.symbol && topAsset.symbol === worstAsset.symbol && (
              <View style={[styles.card, { backgroundColor: '#e3f2fd', borderColor: '#90caf9' }]}>
                <Text style={{ color: '#0d47a1', textAlign: 'center' }}>
                  ℹ️ Al momento il miglior e il peggior asset coincidono ({topAsset.symbol}) perché è disponibile uno storico solo per questo asset.
                  Aggiungi più asset o attendi qualche giorno per una panoramica più completa.
                </Text>
              </View>
            )}

            {topAsset?.history?.length > 0 && (
              <>
                <Text style={styles.label}>📈 Migliore – {topAsset.symbol}</Text>
                <View style={styles.graphContainer}>
                  <LineChart
                    data={{
                      labels: topAsset.history.map(h => h.date.slice(5)),
                      datasets: [{ data: topAsset.history.map(h => h.price) }],
                    }}
                    width={width - 48}
                    height={220}
                    yAxisLabel="€"
                    paddingLeft="15"
                    chartConfig={{
                      backgroundColor: '#fff',
                      backgroundGradientFrom: '#fff',
                      backgroundGradientTo: '#fff',
                      decimalPlaces: 2,
                      color: () => '#4CAF50',
                      labelColor: () => '#666',
                    }}
                    bezier
                    style={{ marginVertical: 8, borderRadius: 16, marginRight: 30 }}
                  />
                </View>
              </>
            )}

            {worstAsset?.history?.length > 0 && (
              <>
                <Text style={styles.label}>📉 Peggiore – {worstAsset.symbol}</Text>
                <View style={styles.graphContainer}>
                  <LineChart
                    data={{
                      labels: worstAsset.history.map(h => h.date.slice(5)),
                      datasets: [{ data: worstAsset.history.map(h => h.price) }],
                    }}
                    width={width - 48}
                    height={220}
                    yAxisLabel="€"
                    paddingLeft="15"
                    chartConfig={{
                      backgroundColor: '#fff',
                      backgroundGradientFrom: '#fff',
                      backgroundGradientTo: '#fff',
                      decimalPlaces: 2,
                      color: () => '#f44336',
                      labelColor: () => '#666',
                    }}
                    bezier
                    style={{ marginVertical: 8, borderRadius: 16, marginRight: 30 }}
                  />
                </View>
              </>
            )}
          </>
        )
      ) : (
        topAsset?.history?.length > 0 && (
          <>
            <Text style={styles.sectionDivider}>📈 Andamento dell’asset</Text>
            <Text style={styles.label}>{topAsset.symbol}</Text>
            <View style={styles.graphContainer}>
              <LineChart
                data={{
                  labels: topAsset.history.map(h => h.date.slice(5)),
                  datasets: [{ data: topAsset.history.map(h => h.price) }],
                }}
                width={width - 48}
                height={220}
                yAxisLabel="€"
                paddingLeft="15"
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 2,
                  color: () => '#4CAF50',
                  labelColor: () => '#666',
                }}
                bezier
                style={{ marginVertical: 8, borderRadius: 16, marginRight: 30 }}
              />
            </View>
          </>
        )
      )}

    </ScrollView>
  );
}
