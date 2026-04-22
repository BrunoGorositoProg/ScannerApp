import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutCooperalaScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sobre Cooperala</Text>

      {/* HISTORIA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historia y origen</Text>

        <Text style={styles.paragraph}>
          Cooperala surge como una iniciativa del sector farmacéutico para:
        </Text>

        <Text style={styles.listItem}>
          • Unificar esfuerzos entre farmacias independientes
        </Text>
        <Text style={styles.listItem}>
          • Crear un sistema más justo de distribución
        </Text>
        <Text style={styles.listItem}>
          • Fortalecer la economía colaborativa en salud
        </Text>

        <Text style={styles.paragraph}>
          Con el paso del tiempo, se consolidó como una referencia dentro del
          modelo cooperativo farmacéutico en Argentina, creciendo en
          infraestructura, tecnología y cobertura.
        </Text>
      </View>

      {/* QUE HACE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Qué hace?</Text>

        <Text style={styles.paragraph}>
          Su función principal es actuar como intermediario eficiente entre
          laboratorios y farmacias, ofreciendo:
        </Text>

        <Text style={styles.listItem}>
          • Distribución de medicamentos y productos farmacéuticos
        </Text>
        <Text style={styles.listItem}>
          • Logística optimizada para abastecimiento rápido
        </Text>
        <Text style={styles.listItem}>
          • Negociación conjunta para mejores precios
        </Text>
        <Text style={styles.listItem}>
          • Gestión de stock y abastecimiento continuo
        </Text>

        <Text style={styles.paragraph}>
          En términos simples, facilita que las farmacias tengan siempre
          productos disponibles al mejor costo posible.
        </Text>
      </View>

      {/* COMO FUNCIONA */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>¿Cómo funciona?</Text>

        <Text style={styles.paragraph}>
          El modelo cooperativo implica que:
        </Text>

        <Text style={styles.listItem}>
          • Las farmacias asociadas son parte de la organización
        </Text>
        <Text style={styles.listItem}>
          • Las decisiones se toman de forma conjunta
        </Text>
        <Text style={styles.listItem}>
          • Los beneficios se redistribuyen entre los miembros
        </Text>

        <Text style={styles.paragraph}>
          Esto genera un sistema más equitativo y sostenible.
        </Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  safe: {
  flex: 1,
  backgroundColor: '#fff',
},

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  paragraph: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    lineHeight: 20,
  },

  listItem: {
    fontSize: 14,
    color: '#444',
    marginLeft: 8,
    marginBottom: 4,
  },
});