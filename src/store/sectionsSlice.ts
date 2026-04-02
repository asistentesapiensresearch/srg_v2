import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fetchData: {
        sheets: [],
        databaseDownload: {
          model: null,
          data: null,
        },
    }
};

const sectionsSlice = createSlice({
    name: "sections",
    initialState,
    reducers: {
        setSections: (state, action) => action.payload,
        setSheetData: (state, action) => {
            state.fetchData.sheets = action.payload;
        },
        setDatabaseDownload: (state, action) => {
            state.fetchData.databaseDownload = action.payload;
        }
    },
});

export const { setSections, setSheetData, setDatabaseDownload } = sectionsSlice.actions;
export default sectionsSlice.reducer;