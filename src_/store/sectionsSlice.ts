import { createSlice } from "@reduxjs/toolkit";

const sectionsSlice = createSlice({
    name: "sections",
    initialState: [],
    reducers: {
        setSections: (state, action) => action.payload,
    },
});

export const { setSections } = sectionsSlice.actions;
export default sectionsSlice.reducer;