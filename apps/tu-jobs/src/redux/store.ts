import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from './reducers/app'
import { jobsReducer } from './reducers/jobs'

export const store = configureStore({
  reducer: {app: appReducer, jobs: jobsReducer},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
