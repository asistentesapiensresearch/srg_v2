import { configureStore } from "@reduxjs/toolkit";
import sectionsReducer from "./store/sectionsSlice";

const store = configureStore({
    reducer: {
        sections: sectionsReducer,
    },
});

export default store;