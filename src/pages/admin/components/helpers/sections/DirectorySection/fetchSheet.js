import Papa from 'papaparse';

export const fetchSheet = async (sheetId, selectedSheet = 0) => {
    const sharedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${selectedSheet}`;
    const response = await fetch(sharedUrl, { method: 'GET' });

    if (!response.ok) throw new Error(`Error ${response.status}`);

    let rawData = [];
    const csvText = await response.text();
    Papa.parse(csvText, {
        header: true, skipEmptyLines: true,
        complete: (results) => { rawData = results.data.filter(r => Object.values(r).some(v => v)); }
    });

    console.log('rawData', rawData)
    return rawData;
}