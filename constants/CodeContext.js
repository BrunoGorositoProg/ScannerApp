import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  clearScannedCodes,
  deleteScannedCode,
  getProductByBarcode,
  getScannedCodes,
  insertScannedCode,
} from '../utils/zipDatabaseParser';

const CodesContext = createContext(undefined);

export function CodesProvider({ children }) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshCodes();
  }, []);

  // ------------------ LOAD ------------------

  const refreshCodes = async () => {
    try {
      setLoading(true);

      const data = getScannedCodes();

      const formatted = data.map(item => ({
        id: item.id,
        barcode: item.barcode,
      }));

      setCodes(formatted);

      console.log('📋 Códigos cargados:', formatted.length);
    } catch (error) {
      console.error('❌ Error loading codes:', error);
      setCodes([]);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ ADD ------------------

  const addCode = async (barcode) => {
    try {
      if (!barcode || barcode.trim() === '') return;

      const exists = codes.some(c => c.barcode === barcode);
      if (exists) {
        console.log('⚠️ Código duplicado:', barcode);
        return;
      }

      insertScannedCode(barcode);

      await refreshCodes();
    } catch (error) {
      console.error('❌ Error adding code:', error);
    }
  };

  // ------------------ DELETE ------------------

  const deleteCode = async (id) => {
    try {
      deleteScannedCode(id);
      await refreshCodes();
    } catch (error) {
      console.error('❌ Error deleting code:', error);
    }
  };

  // ------------------ CLEAR ------------------

  const clearAll = async () => {
    try {
      clearScannedCodes();
      await refreshCodes();
    } catch (error) {
      console.error('❌ Error clearing codes:', error);
    }
  };

  // ------------------ DESCRIPTION ------------------

  const getDescription = (barcode) => {
    try {
      return getProductByBarcode(barcode) || 'Sin descripción';
    } catch (error) {
      console.error('❌ Error getting description:', error);
      return 'Error';
    }
  };

  return (
    <CodesContext.Provider
      value={{
        codes,
        loading,
        addCode,
        deleteCode,
        clearAll,
        refreshCodes,
        getDescription,
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