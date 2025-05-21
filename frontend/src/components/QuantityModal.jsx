// frontend/src/components/QuantityModal.jsx
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function QuantityModal({ visible, onClose, onConfirm, assetSymbol }) {
  const [quantity, setQuantity] = useState('');

  const handleConfirm = () => {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      alert("Inserisci una quantità valida.");
      return;
    }
    onConfirm(qty);
    setQuantity('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Quante azioni di {assetSymbol}?</Text>
          <TextInput
            style={styles.input}
            placeholder="Es. 5"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <View style={styles.buttons}>
            <Button title="Annulla" onPress={onClose} color="red" />
            <Button title="Conferma" onPress={handleConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000088',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
