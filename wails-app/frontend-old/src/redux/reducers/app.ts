import { tuImmer } from "@cmn/utils/funcs4";
import { Path } from "@cmn/utils/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
    title: "Tu player"
}

type State = typeof initialState
const appSlice = createSlice({
    name: 'app', initialState,
    reducers: {
        updateState: <P extends Path<State>>(state, action: PayloadAction<{ path: P; value: any }>) => {
            _.set(state, action.payload.path, action.payload.value); // Deep update
        },

    }
})
tuImmer
export const appReducer = appSlice.reducer
export const {updateState: updateAppState} = appSlice.actions