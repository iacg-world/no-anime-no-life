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
export interface InsertAnimeParams {
  categoryId: string,
  anime: AnimeInfo,
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
        deleteIndex?: number
      }>) => {
        const {categoryId, deleteIndex} = action.payload
        let categoryIndex
        const target = draft.find((item, index) => {
          if (item.categoryId === categoryId) {
            categoryIndex = index
            return item.categoryId === categoryId
          }
        })
        if (target && target.list.length) {
          if (deleteIndex !== undefined) {
            target.list.splice(deleteIndex, 1)
          } else {
            target.list.pop()
          }

        } else if (categoryIndex) {
          draft.splice(categoryIndex, 1)

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
    insertAnime: produce(
      (draft: AnimeCategoryInfo[], action: PayloadAction<InsertAnimeParams>) => {
        const { anime, newIndex, categoryId } = action.payload
        const target = draft.find(item => item.categoryId === categoryId)
        if (target) {
          target.list = target.list.concat([anime, ...target.list.splice(newIndex)])
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
  insertAnime,
} = componentsSlice.actions
export default componentsSlice.reducer