import { configureStore } from '@reduxjs/toolkit'
import { AnimeDataInfo } from '../type'
import animeReducer from './anime'

export type StateType = {
  anime: AnimeDataInfo[]
}

export default configureStore({
  reducer: {
    anime: animeReducer
  },
})
