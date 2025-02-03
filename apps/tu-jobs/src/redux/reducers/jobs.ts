import { IFilters, IJobExt } from "@/utils/interfaces";
import { IObj, Path } from "@cmn/utils/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash"

const initialState = {
    ok: true,
   filters: {sectors: []} as IFilters,
   jobs: null as IJobExt[] | null
}
type AppState = typeof initialState;

const slice = createSlice({
    name: "jobs",
    initialState,
    reducers: {
        updateJobsState: <P extends Path<AppState>>(state, action: PayloadAction<[P, any]>) => {
            // console.log(`\nPATH:`, action.payload[0], 'VALUE:', action.payload[1]);
            _.set(state, action.payload[0], action.payload[1]); // Deep update
        },
        setFilters: (state, {payload} : {payload: typeof state.filters })=>{
            state.filters = payload
        }
    },
});

export const {updateJobsState, setFilters} = slice.actions
export const jobsReducer = slice.reducer;
