import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CameraView } from 'expo-camera';
import React, { useCallback, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCodes } from '../../constants/CodeContext';

export default function ScanScreen() {
  const [scanned, setScanned] = useState(false);
  const [lastScannedData, setLastScannedData] = useState(null);
  const lastCodeRef = useRef(null);

  const navigation = useNavigation();
  const { addCode, getDescription } = useCodes();

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setLastScannedData(null);
      lastCodeRef.current = null;
    }, [])
  );

  const handleBarCodeScanned = useCallback(
    async ({ data }) => {
      if (lastCodeRef.current === data) return;

      lastCodeRef.current = data;
      setScanned(true);

      // 👉 Guardar en SQLite
      await addCode(data);

      // 👉 Obtener descripción
      const description = getDescription(data);

      setLastScannedData({
        code: data,
        description: description || '❌ No encontrado',
        timestamp: new Date().toLocaleTimeString(),
      });
    },
    []
  );

  const handleCloseModal = () => {
    setLastScannedData(null);
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39'],
        }}
      />

      <View style={styles.footer}>
        <Text style={styles.hint}>Apunta al código del producto</Text>
      </View>

      <Modal
        visible={!!lastScannedData}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✓ Código Escaneado</Text>

            <View style={styles.dataBox}>
              <Text style={styles.dataLabel}>Código:</Text>
              <Text style={styles.dataCode}>{lastScannedData?.code}</Text>
            </View>

            <View style={styles.dataBox}>
              <Text style={styles.dataLabel}>Descripción:</Text>
              <Text style={styles.dataDescription}>
                {lastScannedData?.description}
              </Text>
            </View>

            <View style={styles.dataBox}>
              <Text style={styles.dataLabel}>Hora:</Text>
              <Text style={styles.dataTime}>
                {lastScannedData?.timestamp}
              </Text>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={handleCloseModal}
              >
                <Text style={styles.buttonText}>Escanear otro</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => {
                  handleCloseModal();
                  navigation.navigate('ListScreen');
                }}
              >
                <Text style={styles.buttonTextSecondary}>
                  Ir a mis códigos
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  camera: {
    flex: 1,
  },

  footer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
    alignItems: 'center',
  },

  hint: {
    color: '#fff',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  dataBox: {
    marginBottom: 10,
  },

  dataLabel: {
    fontSize: 12,
    color: '#999',
  },

  dataCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  dataDescription: {
    fontSize: 14,
  },

  dataTime: {
    fontSize: 12,
    color: '#666',
  },

  buttonGroup: {
    marginTop: 20,
  },

  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },

  buttonPrimary: {
    backgroundColor: '#0a7ea4',
  },

  buttonSecondary: {
    backgroundColor: '#eee',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  buttonTextSecondary: {
    color: '#333',
    fontWeight: 'bold',
  },
});