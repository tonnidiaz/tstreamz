import {configureStore} from '@reduxjs/toolkit'
import { appReducer } from './reducers/app'
import { playerReducer } from './reducers/player'
export const store = configureStore({
    reducer: {app: appReducer, player: playerReducer}
})

export type RootState = ReturnType<typeof store.getState>