import { useCodes } from '@/constants/CodeContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CodesList from '../../components/codelist';

export default function ListScreen() {
  const { codes, loading, deleteCode, clearAll, refreshCodes } = useCodes();

  // Actualiza cada vez que entra a la pantalla
  useFocusEffect(
    useCallback(() => {
      refreshCodes();
      console.log('📋 Códigos actuales:', codes.length);
    }, [])
  );

  if (loading) return <Text style={{ padding: 16 }}>Cargando...</Text>;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {codes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>📋 Sin códigos guardados</Text>
          <Text style={styles.emptySubtext}>Escanea remedios para comenzar</Text>
        </View>
      ) : (
        <>
          <Text style={{ padding: 12, fontSize: 14, color: '#666' }}>
            Total: {codes.length} código(s)
          </Text>
          <CodesList codes={codes} onDelete={deleteCode} />
          <View style={styles.buttonContainer}>
            <Button 
              title={`Borrar todo (${codes.length})`} 
              onPress={clearAll} 
              color="#d32f2f" 
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: '#999' },
  buttonContainer: { padding: 16, borderTopWidth: 1, borderColor: '#e0e0e0' },
});