// components/EditAssetModal.js
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function EditAssetModal({ visible, onClose, asset, onSave }) {
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (asset) {
      setQuantity(asset.quantity.toString());
    }
  }, [asset]);

  const handleSave = () => {
    onSave({
      ...asset,
      quantity: parseFloat(quantity),
      purchase_date: new Date().toISOString(), // aggiornamento automatico
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Modifica {asset?.symbol}</Text>

          <TextInput
            style={styles.input}
            placeholder="Quantità"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <View style={styles.buttons}>
            <Button title="Annulla" onPress={onClose} />
            <Button title="Salva" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
