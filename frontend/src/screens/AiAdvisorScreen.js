// Consulente AI che suggerisce nuovi asset da acquistare
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import api from '../services/api';
import styles from '../styles/suggestedAssetsStyles';
import { useRouter, useFocusEffect } from 'expo-router';
import QuantityModal from '../components/QuantityModal';

export default function AiAdvisorScreen() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPortfolioSymbols, setUserPortfolioSymbols] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const router = useRouter();

  const fetchAssets = async () => {
    try {
      const response = await api.get('/suggested-assets');
      setAssets(response.data);
    } catch (error) {
      console.error('Errore nel fetch degli asset suggeriti:', error);
      Alert.alert("Errore", "Impossibile recuperare gli asset suggeriti.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPortfolioSymbols = async () => {
    try {
      const response = await api.get('/portfolio/me');
      const symbols = response.data.assets.map((asset) => asset.symbol);
      setUserPortfolioSymbols(symbols);
    } catch (error) {
      console.error("Errore nel recuperare i simboli dal portafoglio:", error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUserPortfolioSymbols();
    }, [])
  );

  const handleConfirmQuantity = async (quantity) => {
    if (!selectedAsset) return;

    try {
      const today = new Date().toISOString();

      const body = {
        symbol: selectedAsset.symbol,
        quantity: quantity,
        purchase_price: selectedAsset.price,
        asset_type: 'stock',
        purchase_date: today,
      };

      await api.post('/portfolio/asset', body);
      await fetchUserPortfolioSymbols();

      setSelectedAsset(null);
      Alert.alert("✅ Aggiunto", `${selectedAsset.symbol} è stato aggiunto al tuo portafoglio.`);

      setTimeout(() => {
        router.replace('/portfolio');
      }, 800);
    } catch (error) {
      console.error("Errore durante l'aggiunta:", error);
      Alert.alert("Errore", error.response?.data?.detail || "Impossibile aggiungere l’asset.");
    }
  };

  const renderItem = ({ item }) => {
    const isAdded = userPortfolioSymbols.includes(item.symbol);

    return (
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
            {`${item.symbol} – ${item.name}`}
          </Text>
          {item.recommended && (
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>🌟 Consigliato con Previsione AI</Text>
            </View>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoTextLabel}>Prezzo</Text>
          <Text style={styles.infoTextValue}>${item.price}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoTextLabel}>Variazione</Text>
          <Text style={[
            styles.infoTextValue,
            { color: item.change_percent >= 0 ? '#4CAF50' : '#f44336' }
          ]}>
            {item.change_percent}%
          </Text>
        </View>

        <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.infoTextLabel}>📈 Previsione AI</Text>
          <Text style={styles.infoTextValue}>
            {item.forecast_growth > 0 ? '+' : ''}{item.forecast_growth}%
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isAdded && styles.buttonDisabled]}
          onPress={() => setSelectedAsset(item)}
          disabled={isAdded}
        >
          <Text style={[styles.buttonText, isAdded && styles.buttonTextDisabled]}>
            {isAdded ? "Aggiunto ✅" : "Aggiungi al Portafoglio"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🤖 Consulente AI</Text>
      <Text style={styles.subtitle}>
        💡 Basandoci sul tuo profilo, FinPilot ti suggerisce asset su cui investire grazie alla nostra AI.
      </Text>

      <FlatList
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.symbol}
        contentContainerStyle={styles.list}
      />

      <QuantityModal
        visible={!!selectedAsset}
        assetSymbol={selectedAsset?.symbol}
        onClose={() => setSelectedAsset(null)}
        onConfirm={handleConfirmQuantity}
      />
    </View>
  );
}
