import { Path } from "@cmn/utils/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash"

const initialState = {
    version: 0,
    user: { username: "tonnidiaz", car: { make: "Honda", model: "Civic", speed: {min: 0, max: 400} } },
}
type AppState = typeof initialState;

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        incrVersion: (state) => {
            state.version += 1;
        },
        mutate: (state, {payload}: PayloadAction<typeof state>)=>{
            console.log(payload);
            state = payload
        },

        setUser: (state, {payload} : {payload: typeof state.user})=>{
            state.user = payload
        },
        updateState: <P extends Path<AppState>>(state, action: PayloadAction<{ path: P; value: any }>) => {
            _.set(state, action.payload.path, action.payload.value); // Deep update
        },
    },
});

export const appSliceActs = appSlice.actions
export const {incrVersion, updateState} = appSlice.actions
export const appReducer = appSlice.reducer;
