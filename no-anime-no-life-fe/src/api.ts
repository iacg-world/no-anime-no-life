import axios from './ajax'
import { AnimeCategoryInfo, ApiAnimeCategoryInfo, AnimeInfo, ResponseResult } from './type'


export const searchByKeyword = (keyword: string) => {
  return axios.get<ResponseResult<AnimeInfo[]>>(`s/${keyword}`)
}
export const getShareList = (animeList: ApiAnimeCategoryInfo[]) => {
  return axios.post<ResponseResult<AnimeCategoryInfo[]>>('share', animeList)
}