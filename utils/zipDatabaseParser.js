import { File } from 'expo-file-system';
import JSZip from 'jszip';

/**
 * ✅ PARSEAR TXT
 */
const parseTxtContent = (txtContent) => {
  const database = {};

  const lines = txtContent
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  lines.forEach((line) => {
    const match = line.match(/^(\d+)(.+)$/);

    if (match) {
      const code = match[1].trim();
      const description = match[2].trim();
      database[code] = description;
    }
  });

  return database;
};

/**
 * ✅ EXTRAER ZIP
 */
export const extractZipDatabaseJSZip = async (zipPath) => {
  try {
    console.log('📦 Procesando ZIP...');

    const file = new File(zipPath);
    const arrayBuffer = await file.arrayBuffer();

    const zip = await JSZip.loadAsync(arrayBuffer);

    let database = {};

    for (const filename in zip.files) {
      const entry = zip.files[filename];

      if (!entry.dir && filename.toLowerCase().endsWith('.txt')) {
        console.log('📄 Procesando:', filename);

        const content = await entry.async('text');
        const parsed = parseTxtContent(content); // 👈 ahora sí existe

        database = { ...database, ...parsed };
      }
    }

    if (Object.keys(database).length === 0) {
      throw new Error('ZIP sin archivos .txt válidos');
    }

    console.log('✅ Total:', Object.keys(database).length);

    return database;
  } catch (error) {
    console.error('❌ Error ZIP:', error);
    throw new Error(`No se pudo procesar el ZIP: ${error.message}`);
  }
};
/**
 * Base de datos mock (para testing)
 */
export const createMockDatabase = () => {
  return {
    '00001': 'Limpieza de prótesis dentales',
    '00002': 'Ibuprofeno 600mg',
    '00003': 'Paracetamol 500mg',
    '00004': 'Cepillo de dientes suave',
    '00005': 'Pasta dental blanqueadora',
    '00006': 'Enjuague bucal antiséptico',
    '00007': 'Desinfectante de manos',
    '00008': 'Alcohol al 70%',
    '00009': 'Amoxicilina 500mg',
    '00010': 'Azitromicina 250mg',
    '77948588': 'Tableta de chicles',
    '7790040139930': 'Galletitas',
  };
};