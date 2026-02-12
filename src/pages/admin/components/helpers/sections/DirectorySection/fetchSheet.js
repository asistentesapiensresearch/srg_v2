import Papa from 'papaparse';

export const fetchSheet = async (sheetId, selectedSheet = 0) => {
    let sharedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
    if(selectedSheet && selectedSheet > 0){
        sharedUrl += `&gid=${selectedSheet}`;
    }
    const response = await fetch(sharedUrl, { method: 'GET' });

    if (!response.ok) throw new Error(`Error ${response.status}`);

    let rawData = [];
    const csvText = await response.text();
    Papa.parse(csvText, {
        header: true, skipEmptyLines: true,
        complete: (results) => { rawData = results.data.filter(r => Object.values(r).some(v => v)); }
    });
    return rawData;
}