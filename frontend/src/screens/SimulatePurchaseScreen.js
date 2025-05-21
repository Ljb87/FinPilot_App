import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import styles from '../styles/simulatePurchaseStyles';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function SimulatePurchaseScreen() {
  const { symbol, name, price } = useLocalSearchParams();
  const [quantity, setQuantity] = useState('');
  const router = useRouter();
  const { token } = useContext(AuthContext);

  const total = quantity ? (parseFloat(price) * parseFloat(quantity)).toFixed(2) : '0.00';

  const handleSimulate = async () => {
    if (!quantity || isNaN(quantity) || parseFloat(quantity) <= 0) {
      Alert.alert('Errore', 'Inserisci una quantità valida');
      return;
    }

    try {
      const response = await api.post(
        '/portfolio/asset',
        {
          symbol,
          asset_type: 'stock', // tipo generico, se usi solo azioni
          quantity: parseFloat(quantity),
          purchase_price: parseFloat(price),
          purchase_date: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Successo', `Acquisto simulato: ${quantity} ${symbol}`);
      router.replace('/portfolio');
    } catch (error) {
      console.error('Errore nella simulazione:', error.response?.data || error.message);
      Alert.alert('Errore', 'Impossibile simulare l’acquisto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulazione Acquisto</Text>
      <Text style={styles.asset}>{name} ({symbol})</Text>
      <Text style={styles.price}>Prezzo per unità: ${price}</Text>

      <TextInput
        style={styles.input}
        placeholder="Quantità da acquistare"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <Text style={styles.total}>
        Totale: <Text style={{ color: '#388E3C', fontWeight: 'bold' }}>${total}</Text>
      </Text>

      <Button title="Simula Acquisto" onPress={handleSimulate} />
    </View>
  );
}
