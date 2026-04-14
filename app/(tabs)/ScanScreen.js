import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CameraView } from 'expo-camera';
import React, { useCallback, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCodes } from '../../constants/CodeContext';

export default function ScanScreen() {
  const [scanned, setScanned] = useState(false);
  const [lastScannedData, setLastScannedData] = useState(null);
  const lastCodeRef = useRef(null);
  const { addCode, getDescription, dbLoaded } = useCodes();
  const navigation = useNavigation(); // 👈 inicializamos navegación

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      setLastScannedData(null);
      lastCodeRef.current = null;
    }, [])
  );

  const handleBarCodeScanned = useCallback(
    async ({ data }) => {
      if (lastCodeRef.current === data) {
        return;
      }

      lastCodeRef.current = data;
      setScanned(true);

      const description = getDescription(data);
      await addCode(data);

      setLastScannedData({
        code: data,
        description,
        timestamp: new Date().toLocaleTimeString(),
      });
    },
    [addCode, getDescription]
  );

  const handleCloseModal = () => {
    setLastScannedData(null);
    setScanned(false);
  };

  if (!dbLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>Base de datos no cargada</Text>
          <Text style={styles.warningSubtext}>
            Ve a "Cargar BD" y sube un .zip con los códigos
          </Text>
        </View>
      </View>
    );
  }

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
        <Text style={styles.hint}>Apunta al código del remedio</Text>
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
              <Text style={styles.dataDescription}>{lastScannedData?.description}</Text>
            </View>

            <View style={styles.dataBox}>
              <Text style={styles.dataLabel}>Hora:</Text>
              <Text style={styles.dataTime}>{lastScannedData?.timestamp}</Text>
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
                  navigation.navigate('ListScreen'); // 👈 navega a tu pantalla de lista
                }}
              >
                <Text style={styles.buttonTextSecondary}>Ir a mis códigos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    alignItems: 'center',
  },
  hint: { color: '#fff', fontSize: 14, fontWeight: '500' },
  warningBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
  },
  warningIcon: { fontSize: 48, marginBottom: 16 },
  warningText: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  warningSubtext: { fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 32 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  dataBox: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  dataLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataCode: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0a7ea4',
    fontFamily: 'Courier New',
  },
  dataDescription: { fontSize: 16, color: '#333', lineHeight: 22 },
  dataTime: { fontSize: 13, color: '#999' },
  buttonGroup: { marginTop: 24, gap: 12 },
  button: { paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#0a7ea4' },
  buttonSecondary: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#e0e0e0' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonTextSecondary: { color: '#333', fontSize: 16, fontWeight: '600' },
});
