import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fetchData: {
        sheets: {},
        databaseDownload: {
          model: null,
          data: null
        },
    }
};

const sectionsSlice = createSlice({
    name: "sections",
    initialState,
    reducers: {
        setSections: (state, action) => action.payload,
        setSheetData: (state, action) => {
            const { identifierExcel, data, total } = action.payload;
            state.fetchData.sheets[identifierExcel] = {
                identifierExcel,
                data,
                total
            };
        },
        setDatabaseDownload: (state, action) => {
            state.fetchData.databaseDownload = action.payload;
        }
    },
});

export const { setSections, setSheetData, setDatabaseDownload } = sectionsSlice.actions;
export default sectionsSlice.reducer;