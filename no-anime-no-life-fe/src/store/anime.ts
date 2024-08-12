import { nanoid } from 'nanoid'
import { AnimeCategoryInfo, AnimeInfo } from '../type'
import { produce } from 'immer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { arrayMove } from '@dnd-kit/sortable'

export interface MoveAnimeParams {
  categoryId?: string,
  oldIndex: number,
  newIndex: number,
}
const INIT_DATA: AnimeCategoryInfo[] = [
  {
    categoryId: nanoid(),
    categoryName: '催泪/致郁',
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
  {
    categoryId: nanoid(),
    categoryName: '最意难平的',
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
          Object.assign(target, action.payload)
        }

      }
    ),
    moveAnime: produce(
      (draft: AnimeCategoryInfo[], action: PayloadAction<MoveAnimeParams>) => {
        const { categoryId, oldIndex, newIndex } = action.payload
        const target = draft.find(item => item.categoryId === categoryId)
        if (target) {
          target.list = arrayMove(target.list, oldIndex, newIndex)
        }

      }
    ),
    moveCategory: (state, action: PayloadAction<MoveAnimeParams>) => {
      const { oldIndex, newIndex } = action.payload
      return arrayMove(state, oldIndex, newIndex)
    },
    initAnime: (_, action: PayloadAction<AnimeCategoryInfo[]>) => {
      return action.payload
    }
  },
})
export const {
  addAnimeCategory,
  addAnime,
  rmAnime,
  modifyAnime,
  modifyCategory,
  moveAnime,
  moveCategory,
  initAnime,
} = componentsSlice.actions
export default componentsSlice.reducer