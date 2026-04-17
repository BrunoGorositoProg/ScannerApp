import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('products.db');

export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      internal_code TEXT PRIMARY KEY NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS barcodes (
      barcode TEXT PRIMARY KEY NOT NULL,
      internal_code TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_barcode ON barcodes(barcode);
  `);
};