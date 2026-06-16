import Papa from 'papaparse';

export const transposeSheetData = (data, fields = null) => {
    if (!data || data.length === 0) return data;
    
    // Use fields array from PapaParse to maintain the exact left-to-right order of columns,
    // avoiding JS object key sorting (V8 sorts numeric strings first).
    const keys = fields && fields.length > 0 ? fields : Object.keys(data[0]);
    if (keys.length <= 1) return data;
    
    // Find all keys that look like years (start with 4 digits)
    const yearKeys = keys.filter(k => /^\d{4}/.test(k.trim()));
    const nonYearKeys = keys.filter(k => !/^\d{4}/.test(k.trim()));
    
    // It is transposed if we have at least 2 year-like keys, and they represent at least 65% of the other keys
    const isTransposed = yearKeys.length >= 2 && (yearKeys.length / (keys.length - 1)) >= 0.65;
    
    if (!isTransposed) return data;
    
    // The firstKey (label key) is the first non-year key, or keys[0] if none found
    const firstKey = nonYearKeys.length > 0 ? nonYearKeys[0] : keys[0];
    
    // The otherKeys are the year keys
    const otherKeys = keys.filter(k => k !== firstKey);
    
    console.log("Detectado Excel transpuesto. Transponiendo en caliente...", otherKeys);
    
    const transposed = [];
    const xHeader = firstKey || "Año";
    
    otherKeys.forEach(colKey => {
        const newRow = {};
        newRow[xHeader] = colKey;
        
        data.forEach(row => {
            const rowLabel = String(row[firstKey] || '').trim();
            if (rowLabel) {
                newRow[rowLabel] = row[colKey];
            }
        });
        transposed.push(newRow);
    });
    
    return transposed;
};

export const fetchSheet = async (sheetId, selectedSheet = 0, token = null) => {
    const cacheKey = `sheet_cache_${sheetId}_${selectedSheet}`;
    
    try {
        let sharedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
        if(selectedSheet && selectedSheet > 0){
            sharedUrl += `&gid=${selectedSheet}`;
        }
        
        // Usar token provisto o el de localStorage como fallback
        const authToken = token || localStorage.getItem("google_oauth_token");
        
        const headers = {};
        if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
        }
        
        let response;
        try {
            response = await fetch(sharedUrl, { method: 'GET', headers });
        } catch (fetchErr) {
            console.warn("Fetch with headers failed, trying public fetch...", fetchErr);
            response = await fetch(sharedUrl, { method: 'GET' });
        }

        // Si falló usando el token de autenticación (ej: expirado o inválido), 
        // pero el documento es público, reintentamos sin token.
        if (!response.ok && authToken) {
            console.warn(`Fetch with token failed with status ${response.status}. Retrying without token...`);
            try {
                const publicResponse = await fetch(sharedUrl, { method: 'GET' });
                if (publicResponse.ok) {
                    response = publicResponse;
                }
            } catch (retryErr) {
                console.error("Public retry failed:", retryErr);
            }
        }

        if (!response.ok) throw new Error(`Error ${response.status}`);

        let rawData = [];
        const csvText = await response.text();
        Papa.parse(csvText, {
            header: true, skipEmptyLines: true,
            complete: (results) => { 
                const parsed = results.data.filter(r => Object.values(r).some(v => v));
                rawData = transposeSheetData(parsed, results.meta?.fields);
            }
        });

        // Almacenar en caché local de forma exitosa
        if (rawData && rawData.length > 0) {
            try {
                localStorage.setItem(cacheKey, JSON.stringify(rawData));
            } catch (cacheErr) {
                console.error("Error writing to localStorage cache:", cacheErr);
            }
        }
        return rawData;

    } catch (error) {
        console.error(`Error fetching sheet ${sheetId} (GID: ${selectedSheet}):`, error);
        
        // Fallback: Recuperar la información guardada en caché
        try {
            const cachedDataStr = localStorage.getItem(cacheKey);
            if (cachedDataStr) {
                const cachedData = JSON.parse(cachedDataStr);
                if (cachedData && cachedData.length > 0) {
                    console.log(`Using cached data for sheet ${sheetId} (GID: ${selectedSheet})`);
                    return transposeSheetData(cachedData);
                }
            }
        } catch (cacheErr) {
            console.error("Error reading from localStorage cache:", cacheErr);
        }
        
        // Propagar el error original si no hay datos en caché
        throw error;
    }
}