import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface CodesContextType {
  codes: string[];
  loading: boolean;
  addCode: (code: string) => Promise<void>;
  deleteCode: (index: number) => Promise<void>;
  clearAll: () => Promise<void>;
  refreshCodes: () => Promise<void>;
}

const CodesContext = createContext<CodesContextType | undefined>(undefined);

export function CodesProvider({ children }: { children: React.ReactNode }) {
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      const saved = await AsyncStorage.getItem('remedy_codes');
      if (saved) {
        const parsedCodes = JSON.parse(saved);
        setCodes(Array.isArray(parsedCodes) ? parsedCodes : []);
        console.log('✓ Códigos cargados:', parsedCodes);
      }
    } catch (error) {
      console.error('Error loading codes:', error);
      setCodes([]);
    } finally {
      setLoading(false);
    }
  };

  const addCode = async (code: string) => {
    try {
      // Validar que no sea vacío o espacios en blanco
      if (!code || code.trim() === '') {
        console.log('⚠️ Código vacío, ignorado');
        return;
      }

      const trimmedCode = code.trim();

      // Evitar duplicados
      if (codes.includes(trimmedCode)) {
        console.log('⚠️ Código duplicado, ignorado:', trimmedCode);
        return;
      }

      const newCodes = [...codes, trimmedCode];
      setCodes(newCodes);
      await AsyncStorage.setItem('remedy_codes', JSON.stringify(newCodes));
      console.log('✓ Código guardado:', trimmedCode);
      console.log('📊 Total de códigos:', newCodes.length);
    } catch (error) {
      console.error('❌ Error adding code:', error);
    }
  };

  const deleteCode = async (index: number) => {
    try {
      if (index < 0 || index >= codes.length) {
        console.error('❌ Índice inválido:', index);
        return;
      }

      const deletedCode = codes[index];
      const newCodes = codes.filter((_, i) => i !== index);
      setCodes(newCodes);
      await AsyncStorage.setItem('remedy_codes', JSON.stringify(newCodes));
      console.log('🗑️ Código eliminado:', deletedCode);
      console.log('📊 Total de códigos:', newCodes.length);
    } catch (error) {
      console.error('❌ Error deleting code:', error);
    }
  };

  const clearAll = async () => {
    try {
      setCodes([]);
      await AsyncStorage.removeItem('remedy_codes');
      console.log('🗑️ Todos los códigos eliminados');
    } catch (error) {
      console.error('❌ Error clearing codes:', error);
    }
  };

  const refreshCodes = async () => {
    try {
      await loadCodes();
      console.log('🔄 Códigos refrescados');
    } catch (error) {
      console.error('❌ Error refreshing codes:', error);
    }
  };

  return (
    <CodesContext.Provider value={{ codes, loading, addCode, deleteCode, clearAll, refreshCodes }}>
      {children}
    </CodesContext.Provider>
  );
}

export function useCodes() {
  const context = useContext(CodesContext);
  if (!context) {
    throw new Error('useCodes debe usarse dentro de CodesProvider');
  }
  return context;
}