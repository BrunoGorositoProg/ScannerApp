import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  const Card = ({ title, icon, route }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(route)}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={42} color="#4F46E5" />
      <Text style={styles.cardText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Image
    source={require('../../assets/images/logo_Cooperala.png')}
    style={styles.logo}
    resizeMode="contain"
  />
  </View>
      <Text style={styles.title}>Inicio</Text>

      <View style={styles.grid}>
        <Card title="Lista" icon="list" route="../(tabs)/ListScreen" />
        <Card title="Escanear" icon="scan" route="../(tabs)/ScanScreen" />
        <Card title="Subir DB" icon="cloud-upload" route="../(tabs)/UploadDatabaseScreen" />
        <Card title="Cooperala" icon="business" route="../(tabs)/Cooperala" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
header: {
  position: 'absolute',
  top: 40,     // ajustá según notch / status bar
  left: 16,
  zIndex: 10,
},
logo: {
  width: 160,
  height: 80,
},
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#111827',
  },
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 15,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
});