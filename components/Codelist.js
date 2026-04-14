import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CodesList({ codes, onDelete, getDescription }) {
  return (
    <FlatList
      data={codes}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item, index }) => {
        const description = getDescription ? getDescription(item) : 'Sin descripción';

        return (
          <View style={styles.item}>
            <View style={styles.codeContainer}>
              <View style={styles.codeHeader}>
                <Text style={styles.label}>Código {index + 1}</Text>
              </View>
              <Text style={styles.code}>{item}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>
            <TouchableOpacity
              onPress={() => onDelete(index)}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteIcon}>✕</Text>
            </TouchableOpacity>
          </View>
        );
      }}
      scrollEnabled={true}
      nestedScrollEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  codeContainer: {
    flex: 1,
    marginRight: 12,
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    color: '#999',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  code: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0a7ea4',
    fontFamily: 'Courier New',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  deleteBtn: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 20,
    color: '#d32f2f',
    fontWeight: 'bold',
  },
});