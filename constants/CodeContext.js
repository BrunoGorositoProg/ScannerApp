import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const CodesContext = createContext(undefined);

export function CodesProvider({ children }) {
  const [codes, setCodes] = useState([]);
  const [descriptions, setDescriptions] = useState({}); // { code: "description" }
  const [loading, setLoading] = useState(true);
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    loadCodes();
    loadDatabase();
  }, []);

  // Carga códigos escaneados
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

  // Carga base de datos de descripciones desde .zip
  const loadDatabase = async () => {
    try {
      const saved = await AsyncStorage.getItem('remedy_database');
      if (saved) {
        const parsed = JSON.parse(saved);
        setDescriptions(parsed);
        console.log('✓ Base de datos cargada:', Object.keys(parsed).length, 'registros');
        setDbLoaded(true);
      }
    } catch (error) {
      console.error('Error loading database:', error);
      setDbLoaded(false);
    }
  };

  // Guardar base de datos (desde .zip parseado)
  const saveDatabase = async (dbObject) => {
    try {
      await AsyncStorage.setItem('remedy_database', JSON.stringify(dbObject));
      setDescriptions(dbObject);
      setDbLoaded(true);
      console.log('✓ Base de datos guardada:', Object.keys(dbObject).length, 'registros');
    } catch (error) {
      console.error('Error saving database:', error);
    }
  };

  // Obtener descripción de un código
  const getDescription = (code) => {
    return descriptions[code] || 'Sin descripción';
  };

  // Agregar código escaneado
  const addCode = async (code) => {
    try {
      if (!code || code.trim() === '') {
        console.log('⚠️ Código vacío, ignorado');
        return;
      }

      const trimmedCode = code.trim();

      if (codes.includes(trimmedCode)) {
        console.log('⚠️ Código duplicado, ignorado:', trimmedCode);
        return;
      }

      const newCodes = [...codes, trimmedCode];
      setCodes(newCodes);
      await AsyncStorage.setItem('remedy_codes', JSON.stringify(newCodes));
      console.log('✓ Código guardado:', trimmedCode);
    } catch (error) {
      console.error('❌ Error adding code:', error);
    }
  };

  // Eliminar código
  const deleteCode = async (index) => {
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
    } catch (error) {
      console.error('❌ Error deleting code:', error);
    }
  };

  // Borrar todo
  const clearAll = async () => {
    try {
      setCodes([]);
      await AsyncStorage.removeItem('remedy_codes');
      console.log('🗑️ Todos los códigos eliminados');
    } catch (error) {
      console.error('❌ Error clearing codes:', error);
    }
  };

  // Refrescar códigos
  const refreshCodes = async () => {
    try {
      await loadCodes();
      console.log('🔄 Códigos refrescados');
    } catch (error) {
      console.error('❌ Error refreshing codes:', error);
    }
  };

  return (
    <CodesContext.Provider
      value={{
        codes,
        loading,
        descriptions,
        dbLoaded,
        addCode,
        deleteCode,
        clearAll,
        refreshCodes,
        getDescription,
        saveDatabase,
        loadDatabase,
      }}
    >
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