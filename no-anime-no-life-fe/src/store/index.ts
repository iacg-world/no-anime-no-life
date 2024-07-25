import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { AnimeCategoryInfo } from '../type'
import animeReducer from './anime'
import storage from 'redux-persist/lib/storage'
import {   
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, 
} from 'redux-persist'
export type StateType = {
  anime: AnimeCategoryInfo[]
}
const rootReducer= combineReducers({
  anime: animeReducer,
})

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})
const persistor = persistStore(store)
export {
  store,
  persistor
}