// Schermata che mostra il contenuto del portafoglio con funzioni di modifica
import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View, Text, FlatList, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import api from '../services/api';
import styles from '../styles/portfolioStyles';
import { AuthContext } from '../context/AuthContext';
import { useRouter, useFocusEffect } from 'expo-router';
import EditAssetModal from '../components/EditAssetModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import Toast from 'react-native-toast-message';

const assetNames = {
  MSFT: "Microsoft Corporation",
  AMZN: "Amazon.com Inc.",
  GOOGL: "Alphabet Inc.",
  TSLA: "Tesla, Inc.",
  AAPL: "Apple Inc.",
  BTC: "Bitcoin",
  ETH: "Ethereum",
};

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { token } = useContext(AuthContext);
  const router = useRouter();

  const fetchPortfolio = async () => {
    try {
      const response = await api.get('/portfolio/me/performance');
      setPortfolio(response.data);
      setLastUpdated(new Date());
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
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
  };

  const handleDelete = (asset) => {
    setAssetToDelete(asset);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💼 Il Mio Portafoglio</Text>

      {lastUpdated && (
        <Text style={{ textAlign: 'center', marginBottom: 10, color: '#777' }}>
          🕒 Ultimo aggiornamento: {lastUpdated.toLocaleTimeString()}
        </Text>
      )}

      {portfolio.length === 0 ? (
        <Text style={styles.infoMessage}>
          🚨 Il tuo portafoglio è vuoto! Vai su <Text style={{ fontWeight: 'bold' }}>Consulente-AI</Text> e acquista i tuoi primi asset!
        </Text>
      ) : (
        <>
          <FlatList
            data={portfolio}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.symbol}>
                  <Text style={{ fontWeight: 'bold' }}>{item.symbol}</Text>
                  <Text style={{ fontWeight: '400' }}> – {assetNames[item.symbol]}</Text>
                </Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoTextLabel}>Quantità</Text>
                  <Text style={styles.infoTextValue}>{item.quantity}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoTextLabel}>Prezzo acquisto</Text>
                  <Text style={styles.infoTextValue}>€ {item.purchase_price.toFixed(2)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoTextLabel}>Prezzo attuale</Text>
                  <Text style={styles.infoTextValue}>€ {item.current_price.toFixed(2)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoTextLabel}>Profit/Loss</Text>
                  <Text style={[
                    styles.infoTextValue,
                    { color: item.profit_loss >= 0 ? '#4CAF50' : '#f44336' },
                  ]}>
                    € {item.profit_loss.toFixed(2)}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoTextLabel}>Performance</Text>
                  <Text style={[
                    styles.infoTextValue,
                    { color: item.performance_percent >= 0 ? '#4CAF50' : '#f44336' },
                  ]}>
                    {item.performance_percent.toFixed(2)}%
                  </Text>
                </View>

                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                  <Text style={styles.infoTextLabel}>Acquistato il</Text>
                  <Text style={styles.infoTextValue}>
                    {new Date(item.purchase_date).toLocaleDateString()}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                    <Text style={styles.buttonText}>✏️ Modifica</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.deleteButton, { marginLeft: 8 }]}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.buttonText}>💸 Vendi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <Text style={styles.infoMessage}>
            ℹ️ Vuoi aggiungere altri asset? Vai su <Text style={{ fontWeight: 'bold' }}>Consulente-AI</Text> oppure modifica o vendi quelli esistenti!
          </Text>
        </>
      )}

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
              router.replace('/home');
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
