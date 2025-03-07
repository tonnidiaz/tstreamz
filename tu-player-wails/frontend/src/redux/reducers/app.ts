import { Path } from "@cmn/utils/interfaces";
import _ from "lodash";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    title: "Tu player",
    port: 0,
    args: [] as string[]
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

export const appReducer = appSlice.reducer
export const {updateState: updateAppState} = appSlice.actions