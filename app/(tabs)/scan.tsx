import { useCodes } from '@/constants/CodeContext';
import { useFocusEffect } from '@react-navigation/native';
import { CameraView } from 'expo-camera';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

export default function ScanScreen() {
  const [scanned, setScanned] = useState(false);
  const lastCodeRef = useRef<string | null>(null); // ← Evitar duplicados
  const { addCode } = useCodes();

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      lastCodeRef.current = null; // Reset al entrar a la pantalla
    }, [])
  );

  const handleBarCodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      // Si es el mismo código que el anterior, ignora
      if (lastCodeRef.current === data) {
        return;
      }

      lastCodeRef.current = data;
      setScanned(true);
      await addCode(data);

      Alert.alert('✓ Código guardado', data, [
        { text: 'OK', onPress: () => setScanned(false) },
      ]);
    },
    [addCode]
  );

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128'],
        }}
      />
      <View style={styles.footer}>
        <Text style={styles.hint}>Apunta al código del remedio</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
    alignItems: 'center',
  },
  hint: { color: '#fff', fontSize: 14, fontWeight: '500' },
});