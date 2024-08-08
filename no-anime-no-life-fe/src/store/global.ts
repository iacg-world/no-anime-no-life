import { produce } from 'immer'
import { GlobalStore, ObjectKeysToLiteral } from '../type'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


const INIT_DATA: GlobalStore = {
  title: {
    topic_name: 'NO ANIME NO LIFE',
    topic_name_cn: '动画人生',
  }

}

export const globalSlice = createSlice({
  name: 'global',
  initialState: INIT_DATA,
  reducers: {

    modifyTitle: produce(
      (draft: GlobalStore, action: PayloadAction<{
        key: ObjectKeysToLiteral<GlobalStore['title']>,
        value: string
      }>) => {
        const { key, value } = action.payload
        draft.title[key] = value

      }
    ),

  }
})
export const {
  modifyTitle
} = globalSlice.actions
export default globalSlice.reducer