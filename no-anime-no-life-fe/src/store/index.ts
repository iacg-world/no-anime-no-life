import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { AnimeCategoryInfo, GlobalStore } from '../type'
import animeReducer from './anime'
import globalReducer from './global'
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
  anime: AnimeCategoryInfo[],
  global: GlobalStore
}
const rootReducer= combineReducers({
  anime: animeReducer,
  global: globalReducer
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