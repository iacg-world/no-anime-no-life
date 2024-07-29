import axios from 'axios'
import { AnimeCategoryInfo, AnimeInfo, ResponseResult } from './type'

export const searchByKeyword = (keyword: string) => {
  return axios.get<ResponseResult<AnimeInfo[]>>(`http://localhost:3000/s/${keyword}`)
}
export const getShareList = (animeList: AnimeCategoryInfo[]) => {
  return axios.post<ResponseResult<AnimeCategoryInfo[]>>('http://localhost:3000/share', animeList)
}