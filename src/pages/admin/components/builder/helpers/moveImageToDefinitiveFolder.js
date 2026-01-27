// src/components/builder/helpers/moveImageToDefinitiveFolder.js
import { copy, remove } from 'aws-amplify/storage';

/**
 * Mueve una imagen de la carpeta temporal a la carpeta definitiva
 * @param {string} tempFolder - Carpeta temporal (ej: "builder/images/temp/section-id/")
 * @param {string} currentKey - Key actual de la imagen
 * @param {string} identifier - Identificador único (timestamp o section-id)
 * @returns {Promise<string>} - Key final de la imagen
 */
export async function moveImageToDefinitiveFolder(tempFolder, currentKey, identifier) {
    if (!currentKey) {
        throw new Error('No image key provided');
    }

    // Si la imagen ya está en la carpeta definitiva, no hacer nada
    if (!currentKey.includes('/temp/')) {
        return currentKey;
    }

    try {
        // Extraer el nombre del archivo
        const fileName = currentKey.split('/').pop();

        // Crear la nueva key en la carpeta definitiva
        const definitiveFolder = 'builder/images/';
        const timestamp = Date.now();
        const finalKey = `${definitiveFolder}${timestamp}-${identifier}-${fileName}`;

        // Copiar el archivo a la nueva ubicación
        await copy({
            source: { path: currentKey },
            destination: { path: finalKey }
        });

        // Eliminar el archivo temporal
        await remove({ path: currentKey });

        console.log('✅ Imagen movida exitosamente:', finalKey);
        return finalKey;

    } catch (error) {
        console.error('❌ Error moviendo imagen:', error);
        // Si falla el movimiento, retornar la key original
        return currentKey;
    }
}

/**
 * Limpia imágenes temporales no utilizadas
 * @param {string[]} tempKeys - Array de keys temporales
 */
export async function cleanupTempImages(tempKeys) {
    if (!tempKeys || tempKeys.length === 0) return;

    try {
        await Promise.all(
            tempKeys.map(key => remove({ path: key }))
        );
        console.log('✅ Imágenes temporales limpiadas:', tempKeys.length);
    } catch (error) {
        console.error('❌ Error limpiando imágenes temporales:', error);
    }
}