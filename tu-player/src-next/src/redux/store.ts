import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from './reducers/app'

export const store = configureStore({
  reducer: {app: appReducer,},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
