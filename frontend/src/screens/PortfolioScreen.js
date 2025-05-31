import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import api from '../services/api';
import styles from '../styles/portfolioStyles';
import { AuthContext } from '../context/AuthContext';
import { useRouter, useFocusEffect } from 'expo-router';
import EditAssetModal from '../components/EditAssetModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Toast from 'react-native-toast-message';

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [menuVisibleAssetId, setMenuVisibleAssetId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);


  const { token } = useContext(AuthContext);
  const router = useRouter();

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/portfolio/me/performance');
      // console.log("🎯 Dati ricevuti dal backend:", JSON.stringify(response.data, null, 2));
      setPortfolio(response.data);
      setLastUpdated(new Date()); // ⏱️ aggiorna data
    } catch (error) {
      console.error('Errore nel caricamento del portafoglio:', error);
    } finally {
      setLoading(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      fetchPortfolio();
    }, [])
  );

   useEffect(() => {
    const interval = setInterval(() => {
      fetchPortfolio();
    }, 30000); // ogni 30 secondi

    return () => clearInterval(interval); // pulizia
  }, []);

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    setMenuVisibleAssetId(null);
  };

  const handleDelete = (asset) => {
    setAssetToDelete(asset);
    setMenuVisibleAssetId(null);
  };

  const handleGoToSuggestedAssets = () => {
    router.push('/suggested-assets');
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Il mio portafoglio</Text>

        {lastUpdated && (
          <Text style={{ textAlign: 'center', marginBottom: 10, color: '#777' }}>
            🕒 Ultimo aggiornamento: {lastUpdated.toLocaleTimeString()}
          </Text>
        )}


      <FlatList
        data={portfolio}
        keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.symbol}>{item.symbol}</Text>
                  <Text>Quantità: {item.quantity}</Text>
                  <Text>Prezzo acquisto: €{item.purchase_price}</Text>
                  <Text>Prezzo attuale: €{item.current_price}</Text>
                  <Text>Profit/Loss: €{item.profit_loss}</Text>
                  <Text>Performance: {item.performance_percent}%</Text>
                  <Text>Acquistato il: {new Date(item.purchase_date).toLocaleDateString()}</Text>
                </View>

                <View style={styles.buttonColumn}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                    <Text style={styles.buttonText}>✏️ Modifica</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item)}>
                    <Text style={styles.buttonText}>💸 Vendi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

      />

      <TouchableOpacity
        onPress={handleGoToSuggestedAssets}
        style={styles.exploreButton}
      >
        <Text style={styles.exploreText}>🔍 Vai a Esplora Asset</Text>
      </TouchableOpacity>

      {selectedAsset && (
        <EditAssetModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSave={async (updatedAsset) => {
            try {
              const fullAsset = portfolio.find(a => a.id === updatedAsset.id);

              const payload = {
                asset_type: fullAsset?.asset_type || "stock",
                symbol: fullAsset.symbol,
                quantity: updatedAsset.quantity,
                purchase_price: fullAsset.purchase_price,
                purchase_date:
                  updatedAsset.purchase_date && !isNaN(new Date(updatedAsset.purchase_date))
                    ? updatedAsset.purchase_date
                    : new Date().toISOString(),
              };


              await api.put(`/portfolio/asset/${updatedAsset.id}`, payload);

              Toast.show({
                type: 'success',
                text1: 'Asset aggiornato!',
                text2: `${payload.symbol} aggiornato con successo.`,
                position: 'bottom',
              });

              fetchPortfolio();
              setSelectedAsset(null);
            } catch (error) {
              console.error("❌ Errore nell'aggiornamento dell'asset:", error);
              alert("Errore: impossibile aggiornare l’asset.");
            }
          }}
        />
      )}

      {assetToDelete && (
        <ConfirmDeleteModal
          visible={!!assetToDelete}
          assetSymbol={assetToDelete.symbol}
          onCancel={() => setAssetToDelete(null)}
          onConfirm={async () => {
            try {
              await api.delete(`/portfolio/asset/${assetToDelete.id}`);
              Toast.show({
                type: 'success',
                text1: 'Asset venduto!',
                text2: `${assetToDelete.symbol} è stato rimosso dal portafoglio.`,
                position: 'bottom',
              });
              setAssetToDelete(null);
              fetchPortfolio();
            } catch (error) {
              console.error("❌ Errore durante l'eliminazione:", error);
              Toast.show({
                type: 'error',
                text1: 'Errore',
                text2: 'Impossibile vendere l’asset.',
                position: 'bottom',
              });
            }
          }}
        />
      )}
    </View>
  );
}
