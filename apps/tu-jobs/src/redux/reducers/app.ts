import { SITE } from "@/utils/consts";
import { Path } from "@cmn/utils/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash"

const initialState = {
    ready: false,
    title: SITE,
    screenSz: {w: 0, h: 0},
    user: { username: "tonnidiaz", car: { make: "Honda", model: "Civic", speed: {min: 0, max: 400} } },
}
type AppState = typeof initialState;

const appSlice = createSlice({
    name: "app",
    initialState,
    
    reducers: {
        
        updateAppStore: <P extends Path<AppState>>(state, action: PayloadAction<{ path: P; value: any }>) => {
            _.set(state, action.payload.path, action.payload.value); // Deep update
        },
    },
});

export const {updateAppStore} = appSlice.actions
export const appReducer = appSlice.reducer;
