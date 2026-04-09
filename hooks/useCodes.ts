import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useCodes() {
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      const saved = await AsyncStorage.getItem('remedy_codes');
      if (saved) setCodes(JSON.parse(saved));
    } catch (error) {
      console.error('Error loading codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCode = async (code: string) => {
    if (codes.includes(code)) return; // Evitar duplicados
    const newCodes = [...codes, code];
    setCodes(newCodes);
    await AsyncStorage.setItem('remedy_codes', JSON.stringify(newCodes));
  };

  const deleteCode = async (index: number) => {
    const newCodes = codes.filter((_, i) => i !== index);
    setCodes(newCodes);
    await AsyncStorage.setItem('remedy_codes', JSON.stringify(newCodes));
  };

  const clearAll = async () => {
    setCodes([]);
    await AsyncStorage.removeItem('remedy_codes');
  };

  return { codes, loading, addCode, deleteCode, clearAll };
}