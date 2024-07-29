import axios from './ajax'
import { AnimeCategoryInfo, AnimeInfo, ResponseResult } from './type'


export const searchByKeyword = (keyword: string) => {
  return axios.get<ResponseResult<AnimeInfo[]>>(`s/${keyword}`)
}
export const getShareList = (animeList: AnimeCategoryInfo[]) => {
  return axios.post<ResponseResult<AnimeCategoryInfo[]>>('share', animeList)
}