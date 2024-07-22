import { createContext, useState, FC } from 'react'
import { mockAnimeList } from '../mock'
import { nanoid } from 'nanoid'
import { AnimeDataInfo, AnimeInfo } from '../type'
import { produce } from 'immer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
const initData = JSON.parse(localStorage.getItem('animeData') || '[]')

export const componentsSlice = createSlice({
  name: 'anime',
  initialState: initData,
  reducers: {
    addAnimeCategory: produce(
      (draft: AnimeDataInfo[], action: PayloadAction<string>) => {
        const newCategory: AnimeDataInfo = {
          categoryId: nanoid(),
          categoryName: action.payload,
          list: []
        }
        draft.push(newCategory)
      }
    ),
    addAnime: produce(
      (draft: AnimeDataInfo[], action: PayloadAction<{
        categoryId: string,
        obj: AnimeInfo,
      }>) => {
        const target = draft.find(item => item.categoryId === action.payload.categoryId)
        if (target) {
          const newList = {
            ...action.payload.obj,
            aid: nanoid(),
          }
          target.list.push(newList)
        }

      }
    ),
  
    modifyAnime: produce(
      (draft: AnimeDataInfo[], action: PayloadAction<{
        categoryId: string,
        aid: string,
        obj: AnimeInfo,
      }>) => {
        const {categoryId, aid, obj} = action.payload
        const categoryTarget = draft.find(item => item.categoryId === categoryId)
        if (categoryTarget) {
          const newList= categoryTarget.list.map(item => {
            if (item.aid === aid) {
              return {
                ...item,
                ...obj,
                aid: item.aid,
              }
            } else {
              return item
            }
          })
          categoryTarget.list = newList
        }
      }
    ),

    modifyCategoryName:produce(
      (draft: AnimeDataInfo[], action: PayloadAction<{
        categoryId: string,
        name: string,
      }>) => {
        const target = draft.find(item => item.categoryId === action.payload.categoryId)
        if (target) {
          target.categoryName = action.payload.name
        }

      }
    ),
  },
})
export const {
  addAnimeCategory,
  addAnime,
  modifyAnime,
} = componentsSlice.actions
export default componentsSlice.reducer