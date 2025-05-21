import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

export default function ConfirmDeleteModal({ visible, assetSymbol, onConfirm, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Conferma eliminazione</Text>
          <Text style={styles.message}>Vuoi davvero eliminare {assetSymbol} dal portafoglio?</Text>

          <View style={styles.buttons}>
            <Button title="Annulla" onPress={onCancel} color="#888" />
            <Button title="Conferma" onPress={onConfirm} color="#D32F2F" />
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
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
