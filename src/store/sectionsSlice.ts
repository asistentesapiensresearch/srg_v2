import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fetchData: {
        sheets: [],
        dbInfo: []
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
        setDataBD: (state, action) => {
            state.fetchData.dbInfo = action.payload;
        }
    },
});

export const { setSections, setSheetData, setDataBD } = sectionsSlice.actions;
export default sectionsSlice.reducer;