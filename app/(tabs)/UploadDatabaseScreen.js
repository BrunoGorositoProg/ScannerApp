import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCodes } from '../../constants/CodeContext';
import { createMockDatabase, extractZipDatabaseJSZip } from '../../utils/zipDatabaseParser';

export default function UploadDatabaseScreen() {
  const { saveDatabase, descriptions, dbLoaded } = useCodes();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [fileInfo, setFileInfo] = useState(null);

  // Seleccionar archivo .zip
  const handlePickZip = async () => {
    try {
      setLoading(true);
      setStatus('Seleccionando archivo...');

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/zip', // Solo .zip
      });

      if (result.canceled) {
        setStatus('Cancelado');
        setLoading(false);
        return;
      }

      const zipPath = result.assets[0].uri;
      const fileName = result.assets[0].name;
      console.log('📦 ZIP seleccionado:', fileName, 'en:', zipPath);

      setStatus('Procesando ZIP...');
      const database = await extractZipDatabaseJSZip(zipPath);

      await saveDatabase(database);
      setStatus(`✓ Base de datos cargada: ${Object.keys(database).length} registros`);
      setFileInfo({
        name: fileName,
        count: Object.keys(database).length,
        date: new Date().toLocaleString(),
      });

      Alert.alert('✓ Éxito', `Cargados ${Object.keys(database).length} códigos desde ${fileName}`, [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Error al procesar ZIP');
      Alert.alert('❌ Error', error.message || 'No se pudo cargar el archivo ZIP');
    } finally {
      setLoading(false);
    }
  };

  // Cargar BD de prueba (mock)
  const handleLoadMockDatabase = async () => {
    try {
      setLoading(true);
      setStatus('Cargando base de datos de ejemplo...');

      const mockDb = createMockDatabase();
      await saveDatabase(mockDb);

      setStatus(`✓ Base de datos de ejemplo cargada: ${Object.keys(mockDb).length} registros`);
      setFileInfo({
        name: 'Base de datos de ejemplo (Mock)',
        count: Object.keys(mockDb).length,
        date: new Date().toLocaleString(),
      });

      Alert.alert('✓ Éxito', `Base de datos de ejemplo cargada con ${Object.keys(mockDb).length} códigos`, [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Error');
      Alert.alert('❌ Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cargar Base de Datos</Text>
        <Text style={styles.subtitle}>Carga un archivo .zip con archivos .txt de códigos</Text>
      </View>

      {/* Estado actual */}
      <View style={[styles.statusBox, dbLoaded ? styles.statusSuccess : styles.statusWarning]}>
        <Text style={styles.statusLabel}>
          {dbLoaded
            ? `✓ Base de datos activa: ${Object.keys(descriptions).length} códigos`
            : '⚠️ Sin base de datos cargada'}
        </Text>
      </View>

      {/* Botón principal: Seleccionar .zip */}
      <View style={styles.buttonContainer}>
        <Button
          title={loading ? 'Procesando...' : '📦 Seleccionar .zip'}
          onPress={handlePickZip}
          disabled={loading}
          color="#0a7ea4"
        />
      </View>

      <View style={styles.divider}>
        <Text style={styles.dividerText}>O</Text>
      </View>

      {/* Botón secundario: Cargar ejemplo */}
      <View style={styles.buttonContainer}>
        <Button
          title="📋 Cargar ejemplo (para testing)"
          onPress={handleLoadMockDatabase}
          disabled={loading}
          color="#6c757d"
        />
      </View>

      {/* Indicador de carga */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={styles.loadingText}>{status}</Text>
        </View>
      )}

      {/* Mensaje de estado */}
      {!loading && status && (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>{status}</Text>
        </View>
      )}

      {/* Información de archivo cargado */}
      {fileInfo && (
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📦 Archivo cargado:</Text>
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nombre:</Text> {fileInfo.name}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registros:</Text> {fileInfo.count}
          </Text>
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text> {fileInfo.date}
          </Text>
        </View>
      )}

      {/* Instrucciones */}
      <View style={styles.instructionsBox}>
        <Text style={styles.instructionsTitle}>📋 Cómo crear el .zip:</Text>
        <Text style={styles.instructionsText}>
          1. Crea múltiples archivos .txt{'\n'}
          2. Cada línea: código + descripción sin separador{'\n'}
          3. Ejemplo de línea: <Text style={styles.code}>00001Ibuprofeno 600mg</Text>
          {'\n'}4. Comprime todos los .txt en un único .zip{'\n'}
          5. Sube el .zip aquí
        </Text>
      </View>

      {/* Ejemplo de estructura */}
      <View style={styles.exampleBox}>
        <Text style={styles.exampleTitle}>📁 Estructura de ejemplo:</Text>
        <Text style={styles.exampleText}>
          <Text style={styles.code}>archivo.zip</Text>
          {'\n'}├─ <Text style={styles.code}>remedios.txt</Text>
          {'\n'}│  ├─ <Text style={styles.code}>00001Ibuprofeno 600mg</Text>
          {'\n'}│  └─ <Text style={styles.code}>00002Paracetamol 500mg</Text>
          {'\n'}└─ <Text style={styles.code}>medicamentos.txt</Text>
          {'\n'}   ├─ <Text style={styles.code}>00003Amoxicilina 500mg</Text>
          {'\n'}   └─ <Text style={styles.code}>00004Metformina 850mg</Text>
        </Text>
      </View>

      {/* Lista actual de códigos */}
      {dbLoaded && Object.keys(descriptions).length > 0 && (
        <View style={styles.previewBox}>
          <Text style={styles.previewTitle}>📦 Primeros 5 registros cargados:</Text>
          {Object.entries(descriptions)
            .slice(0, 5)
            .map(([code, desc]) => (
              <View key={code} style={styles.previewItem}>
                <Text style={styles.previewCode}>{code}</Text>
                <Text style={styles.previewDesc}>{desc}</Text>
              </View>
            ))}
          {Object.keys(descriptions).length > 5 && (
            <Text style={styles.previewMore}>
              ...y {Object.keys(descriptions).length - 5} registros más
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
  divider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerText: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
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
    lineHeight: 18,
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
  exampleBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#9c27b0',
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6a1b9a',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 11,
    color: '#424242',
    lineHeight: 16,
    fontFamily: 'Courier New',
  },
  code: {
    fontFamily: 'Courier New',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 3,
    color: '#d32f2f',
  },
  previewBox: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  previewItem: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  previewCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0a7ea4',
    fontFamily: 'Courier New',
  },
  previewDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  previewMore: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 8,
  },
});