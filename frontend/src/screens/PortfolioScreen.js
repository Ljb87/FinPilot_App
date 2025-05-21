import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import api from '../services/api';
import styles from '../styles/portfolioStyles';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import EditAssetModal from '../components/EditAssetModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Toast from 'react-native-toast-message';

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const { token, logout } = useContext(AuthContext);
  const router = useRouter();

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/portfolio/me/performance');
      setPortfolio(response.data);
    } catch (error) {
      console.error('Errore nel caricamento del portafoglio:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const handleGoToSuggestedAssets = () => {
    router.push('/suggested-assets');
  };

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
  };

  const handleDelete = (asset) => {
    console.log("🧪 handleDelete chiamato con:", asset);
    setAssetToDelete(asset); // Mostra la modale elegante
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Il mio portafoglio</Text>

      <FlatList
        data={portfolio}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          console.log("📦 Asset renderizzato:", item);
          return (
            <View style={styles.card}>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text>Quantità: {item.quantity}</Text>
              <Text>Prezzo acquisto: {item.purchase_price}</Text>
              <Text>Prezzo attuale: {item.current_price}</Text>
              <Text>Profit/Loss: {item.profit_loss}</Text>
              <Text>Performance: {item.performance_percent}%</Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                  style={{ backgroundColor: '#FFA000', padding: 8, borderRadius: 6 }}
                  onPress={() => handleEdit(item)}
                >
                  <Text style={{ color: 'white' }}>✏️ Modifica</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ backgroundColor: '#D32F2F', padding: 8, borderRadius: 6 }}
                  onPress={() => handleDelete(item)}
                >
                  <Text style={{ color: 'white' }}>🗑️ Elimina</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      <TouchableOpacity
        onPress={handleGoToSuggestedAssets}
        style={{ marginTop: 20, padding: 10, backgroundColor: '#1976D2', borderRadius: 8 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>🔍 Vai a Esplora Asset</Text>
      </TouchableOpacity>

      <View style={{ marginTop: 30 }}>
        <Button title="Logout" onPress={handleLogout} color="#D32F2F" />
      </View>

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
                purchase_date: updatedAsset.purchase_date || new Date().toISOString(),
              };

              console.log("📦 Payload PUT:", JSON.stringify(payload, null, 2));

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
                text1: 'Asset eliminato!',
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
                text2: 'Impossibile eliminare l’asset.',
                position: 'bottom',
              });
            }
          }}
        />
      )}
    </View>
  );
}

