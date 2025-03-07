import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Path } from "@cmn/utils/interfaces";
import _ from "lodash";

const initialState = {currentFile: null as string | null, useVideoJs: false}
type State = typeof initialState;

const playerSlice = createSlice({name: "player", initialState, reducers: {
    updateState: <P extends Path<State>>(state, action: PayloadAction<{ path: P; value: any }>) => {
        _.set(state, action.payload.path, action.payload.value); // Deep update
    },
}})

export const playerReducer = playerSlice.reducer
export const {updateState: setPlayerState} = playerSlice.actions