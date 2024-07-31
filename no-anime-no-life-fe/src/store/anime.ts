import { nanoid } from 'nanoid'
import { AnimeCategoryInfo, AnimeInfo } from '../type'
import { produce } from 'immer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
const INIT_DATA: AnimeCategoryInfo[] = [
  {
    categoryId: nanoid(),
    categoryName: '热血/战斗',
    list: [],
  },
  {
    categoryId: nanoid(),
    categoryName: '青春/校园',
    list: [],
  },
  {
    categoryId: nanoid(),
    categoryName: '搞笑/治愈',
    list: [],
  },
]

export const componentsSlice = createSlice({
  name: 'anime',
  initialState: INIT_DATA,
  reducers: {
    addAnimeCategory: produce(
      (draft: AnimeCategoryInfo[], action: PayloadAction<string>) => {
        const newCategory: AnimeCategoryInfo = {
          categoryId: nanoid(),
          categoryName: action.payload,
          list: []
        }
        draft.push(newCategory)
      }
    ),
    addAnime: produce(
      (draft: AnimeCategoryInfo[], action: PayloadAction<{
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
    rmAnime: produce(
      (draft: AnimeCategoryInfo[], action: PayloadAction<{
        categoryId: string,
      }>) => {
        let deleteIndex = 0
        const target = draft.find((item, index) => {
          deleteIndex = index
          return item.categoryId === action.payload.categoryId
        })
        if (target) {
          if (target.list.length) {

            target.list.pop()
          } else {
            draft.splice(deleteIndex, 1)
          }
        }

      }
    ),

    modifyAnime: produce(
      (draft: AnimeCategoryInfo[], action: PayloadAction<{
        categoryId: string,
        aid: string,
        obj: AnimeInfo,
      }>) => {
        const { categoryId, aid, obj } = action.payload
        const categoryTarget = draft.find(item => item.categoryId === categoryId)
        if (categoryTarget) {
          const newList = categoryTarget.list.map(item => {
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

    modifyCategory: produce(
      (draft: AnimeCategoryInfo[], action: PayloadAction<Partial<AnimeCategoryInfo>>) => {
        const target = draft.find(item => item.categoryId === action.payload.categoryId)
        if (target) {
          Object.assign(target , action.payload)
        }

      }
    ),
  },
})
export const {
  addAnimeCategory,
  addAnime,
  rmAnime,
  modifyAnime,
  modifyCategory,
} = componentsSlice.actions
export default componentsSlice.reducer