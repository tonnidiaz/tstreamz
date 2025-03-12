import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Path } from "@cmn/utils/interfaces";
import _ from "lodash";

const initialState = {
    currentFile: null as string | null,
    useVideoJs: false,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isEnded: false,
};
type State = typeof initialState;

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        updateState: <P extends Path<State>>(
            state,
            action: PayloadAction<[path: P, val: any]>
        ) => {
            _.set(state, action.payload[0], action.payload[1]); // Deep update
        },
    },
});

export const playerReducer = playerSlice.reducer;
export const { updateState: setPlayerState } = playerSlice.actions;
