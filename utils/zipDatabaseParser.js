import { File } from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import JSZip from 'jszip';

const db = SQLite.openDatabaseSync('products.db');

// ------------------ INIT ------------------

export const initDB = () => {
  const versionResult = db.getFirstSync('PRAGMA user_version');
  const currentVersion = versionResult?.user_version || 0;

  console.log('📦 DB version actual:', currentVersion);

  // ---------------- VERSION 0 → 1 ----------------
  if (currentVersion < 1) {
    console.log('🚀 Creando tablas iniciales...');

    db.execSync(`
      CREATE TABLE IF NOT EXISTS products (
        internal_code TEXT PRIMARY KEY,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS barcodes (
        barcode TEXT PRIMARY KEY,
        internal_code TEXT
      );

      CREATE TABLE IF NOT EXISTS scanned_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    db.execSync(`PRAGMA user_version = 1`);
  }

  // ---------------- VERSION 1 → 2 (AGREGAR UNIQUE) ----------------
  if (currentVersion < 2) {
    console.log('🔄 Migrando tabla scanned_codes (UNIQUE)...');

    db.execSync(`
      CREATE TABLE scanned_codes_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        barcode TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      INSERT OR IGNORE INTO scanned_codes_new (barcode, created_at)
      SELECT barcode, created_at FROM scanned_codes;

      DROP TABLE scanned_codes;

      ALTER TABLE scanned_codes_new RENAME TO scanned_codes;
    `);

    db.execSync(`PRAGMA user_version = 2`);
  }
};

// ------------------ INSERTS ------------------

export const insertProduct = (code, description) => {
  db.runSync(
    'INSERT OR REPLACE INTO products (internal_code, description) VALUES (?, ?)',
    [code, description]
  );
};

export const insertBarcode = (barcode, internalCode) => {
  db.runSync(
    'INSERT OR REPLACE INTO barcodes (barcode, internal_code) VALUES (?, ?)',
    [barcode, internalCode]
  );
};

export const insertScannedCode = (barcode) => {
  db.runSync(
    'INSERT OR IGNORE INTO scanned_codes (barcode) VALUES (?)',
    [barcode]
  );
};

// ------------------ QUERIES ------------------

export const getProductByBarcode = (barcode) => {
  const result = db.getFirstSync(
    `SELECT p.description 
     FROM barcodes b
     JOIN products p ON p.internal_code = b.internal_code
     WHERE b.barcode = ?`,
    [barcode]
  );

  return result?.description || null;
};

export const getScannedCodes = () => {
  return db.getAllSync(
    'SELECT * FROM scanned_codes ORDER BY created_at DESC'
  );
};

export const deleteScannedCode = (id) => {
  db.runSync(
    'DELETE FROM scanned_codes WHERE id = ?',
    [id]
  );
};

export const clearScannedCodes = () => {
  db.runSync('DELETE FROM scanned_codes');
};

// ------------------ ZIP IMPORT ------------------

export const extractZipToSQLite = async (zipPath) => {
  const file = new File(zipPath);
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  for (const filename in zip.files) {
    const entry = zip.files[filename];

    if (entry.dir) continue;

    if (
      filename.toLowerCase().endsWith('.txt') ||
      filename.toLowerCase().endsWith('.dat')
    ) {
      const content = await entry.async('text');

      const lines = content
        .replace(/\r/g, '')
        .split('\n')
        .map(l => l.trim())
        .filter(Boolean);

      for (const line of lines) {
        // RELACIONES: "77994250000358 00001"
        if (line.includes(' ')) {
          const [barcode, internalCode] = line.split(/\s+/);
          insertBarcode(barcode, internalCode);
        } else {
          const match = line.match(/^(\d+)(.+)$/);
          if (match) {
            const code = match[1];
            const description = match[2];
            insertProduct(code, description);
          }
        }
      }
    }
  }
};