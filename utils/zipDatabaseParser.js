import { File } from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import JSZip from 'jszip';

const db = SQLite.openDatabaseSync('products.db');

export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS products (
      internal_code TEXT PRIMARY KEY,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS barcodes (
      barcode TEXT PRIMARY KEY,
      internal_code TEXT
    );
  `);
};

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

export const getProductByBarcode = async (barcode) => {
  const result = db.getFirstSync(
    `SELECT p.description 
     FROM barcodes b
     JOIN products p ON p.internal_code = b.internal_code
     WHERE b.barcode = ?`,
    [barcode]
  );

  return result?.description || null;
};

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
        } 
        // PRODUCTOS: "00001Ibuprofeno 600mg"
        else {
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