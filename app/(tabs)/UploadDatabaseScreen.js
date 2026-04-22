import * as DocumentPicker from 'expo-document-picker';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { extractZipToSQLite, initDB } from '../../utils/zipDatabaseParser';
export default function UploadDatabaseScreen() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [dbLoaded, setDbLoaded] = useState(false);

  /**
   * 🔥 Inicializar SQLite (MUY IMPORTANTE)
   */
  useEffect(() => {
    initDB();
  }, []);

  /**
   * 📦 Seleccionar ZIP
   */
  const handlePickZip = async () => {
    try {
      setLoading(true);
      setStatus('Seleccionando archivo...');

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/zip',
      });

      if (result.canceled) {
        setStatus('Cancelado');
        setLoading(false);
        return;
      }

      const zipPath = result.assets[0].uri;
      const fileName = result.assets[0].name;

      console.log('📦 ZIP seleccionado:', fileName);

      setStatus('Procesando ZIP...');

      // 🔥 IMPORTANTE: esto ahora guarda en SQLite
      await extractZipToSQLite(zipPath);

      setStatus('✅ Base de datos cargada correctamente');
      setDbLoaded(true);

      setFileInfo({
        name: fileName,
        date: new Date().toLocaleString(),
      });

      Alert.alert('✓ Éxito', `Base cargada desde ${fileName}`);

    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Error al procesar ZIP');
      Alert.alert('❌ Error', error.message || 'No se pudo cargar el archivo ZIP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cargar Base de Datos</Text>
        <Text style={styles.subtitle}>
          Carga un archivo .zip con archivos .txt o .dat
        </Text>
      </View>

      {/* Estado */}
      <View style={[styles.statusBox, dbLoaded ? styles.statusSuccess : styles.statusWarning]}>
        <Text style={styles.statusLabel}>
          {dbLoaded
            ? '✓ Base de datos cargada en SQLite'
            : '⚠️ Sin base de datos cargada'}
        </Text>
      </View>

      {/* Botón ZIP */}
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Procesando...' : '📦 Seleccionar .zip'}
          onPress={handlePickZip}
          disabled={loading}
          color="#0a7ea4"
        />
      </View>

      {/* Loader */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={styles.loadingText}>{status}</Text>
        </View>
      )}

      {/* Mensaje */}
      {!loading && status && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{status}</Text>
        </View>
      )}

      {/* Info archivo */}
      {fileInfo && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📦 Archivo cargado:</Text>
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text> {fileInfo.name}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text> {fileInfo.date}
          </Text>
        </View>
      )}

      {/* Instrucciones */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>📋 Formato soportado:</Text>
        <Text style={styles.instructionsText}>
          • Productos:{'\n'}
          <Text style={styles.code}>00001Ibuprofeno 600mg</Text>
          {'\n\n'}
          • Relaciones:{'\n'}
          <Text style={styles.code}>77994250000358 00001</Text>
          {'\n\n'}
          • Podés usar archivos .txt o .dat dentro del .zip
        </Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

/**
 * 🎨 estilos (igual que los tuyos)
 */
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  safe: {
  flex: 1,
  backgroundColor: '#fff',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  statusBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusSuccess: {
    backgroundColor: '#e8f5e9',
  },
  statusWarning: {
    backgroundColor: '#fff3cd',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  messageBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 13,
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: 8,
  },
  infoRow: {
    fontSize: 12,
    color: '#0d47a1',
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: '700',
  },
  instructionsBox: {
    backgroundColor: '#fff8e1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#fbc02d',
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f57f17',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: '#e65100',
    lineHeight: 18,
  },
  code: {
    fontFamily: 'Courier New',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 3,
    color: '#d32f2f',
  },
});