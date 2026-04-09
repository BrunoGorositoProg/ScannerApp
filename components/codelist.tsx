import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CodesListProps {
  codes: string[];
  onDelete: (index: number) => void;
}

export default function CodesList({ codes, onDelete }: CodesListProps) {
  return (
    <FlatList
      data={codes}
      keyExtractor={(_, i) => i.toString()}
      renderItem={({ item, index }) => (
        <View style={styles.item}>
          <View style={styles.codeContainer}>
            <Text style={styles.label}>Código {index + 1}</Text>
            <Text style={styles.code}>{item}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => onDelete(index)}
            style={styles.deleteBtn}
          >
            <Text style={styles.deleteIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      scrollEnabled={true}
      nestedScrollEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fafafa',
  },
  codeContainer: { flex: 1 },
  label: { fontSize: 12, color: '#999', marginBottom: 4 },
  code: { fontSize: 16, fontWeight: '500', color: '#333' },
  deleteBtn: { padding: 8 },
  deleteIcon: { fontSize: 20, color: '#d32f2f', fontWeight: 'bold' },
});