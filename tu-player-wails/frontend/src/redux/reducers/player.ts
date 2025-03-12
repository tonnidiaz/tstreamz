import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Path } from "@cmn/utils/interfaces";
import _ from "lodash";
import { ImportVideo } from "@wailsjs/go/main/App";
import { parseFilename } from "@/lib/funcs";
import { parseDate } from "@cmn/utils/funcs";

const initialState = {
    currentFile: null as string | null,
    useVideoJs: false,
    currentTime: 0,
    cnt: 0,
    duration: 0,
    ts: parseDate(),
    isPlaying: false,
    isEnded: false,
    currentIndex: 0,
    playlist: null as string[] | null,
};
type State = typeof initialState;

export const importVideoAsyncThunk = createAsyncThunk("player/importVideo", async() => {
    try {
        const file = await ImportVideo()
        if (!file) return;
        const newFile = file + '#';
        return newFile
    } catch (err) {
        return null
    }
})

const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        
        setPlaylist: (state, action: PayloadAction<string[]>) => {
            state.playlist = action.payload;
            if (state.currentFile){
                state.currentIndex = state.playlist.indexOf(parseFilename(state.currentFile));
            }
        },
        setCurrentIndex: (state, action: PayloadAction<number>) => {
            // console.log(`\n[set_curr_index] ${action.payload}`);
            state.currentIndex = action.payload;
            state.currentFile = state.playlist?.length ? state.playlist[action.payload] : state.currentFile;
        },
        setCurrentFile: (state, action: PayloadAction<string>) => {
            state.currentFile = action.payload;
            state.currentIndex = state.playlist?.indexOf(parseFilename(action.payload || ""));
        },
        setTs: (state, action: PayloadAction<string>) => {
            state.ts = action.payload
        },
        importVideo: (state, action: PayloadAction<undefined>) => {
           /*  ImportVideo()
                .then((file) => {
                    if (!file) return;
                    const newFile = file + '#';
                    state.currentFile = newFile
                })
                .catch(console.log); */
        },

        increment: (state)=>{
            state.cnt = state.cnt + 1
        }
        // updateState: <P extends Path<State>>(
        //     state,
        //     action: PayloadAction<[path: P, val: any]>
        // ) => {
        //     _.set(state, action.payload[0], action.payload[1]); // Deep update
        // },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(importVideoAsyncThunk.fulfilled, (state, action) => {
          // Add user to the state array
          state.currentFile= action.payload
        })
      },
});

export const playerReducer = playerSlice.reducer;
export const {setCurrentFile} = playerSlice.actions;
export const playerStateActions = playerSlice.actions;
