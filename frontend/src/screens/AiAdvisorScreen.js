import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import styles from '../styles/suggestedAssetsStyles';
import { useRouter } from 'expo-router';
import QuantityModal from '../components/QuantityModal'; // ✅ nuovo componente

export default function SuggestedAssetsScreen() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedSymbols, setAddedSymbols] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const router = useRouter();

  useEffect(() => {
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

    fetchAssets();
  }, []);

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
      setAddedSymbols((prev) => [...prev, selectedAsset.symbol]);
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
    const isAdded = addedSymbols.includes(item.symbol);

    return (
      <View style={styles.assetContainer}>
        <View style={styles.header}>
          <Text style={styles.assetSymbol}>{item.symbol}</Text>
          {item.recommended && <Text style={styles.recommendedBadge}>★ Consigliato</Text>}
        </View>
        <Text style={styles.assetName}>{item.name}</Text>
        <Text style={styles.assetPrice}>Prezzo: ${item.price}</Text>
        <Text style={[
          styles.assetChange,
          { color: item.change_percent >= 0 ? 'green' : 'red' }
        ]}>
          Variazione: {item.change_percent}%
        </Text>
        <Text style={styles.assetForecast}>
          🔮 Previsione di crescita: {item.forecast_growth}%
        </Text>

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

  if (loading) return <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />;

  return (
  <View style={styles.container}>
    <Text style={styles.title}>Consulente AI</Text>
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

