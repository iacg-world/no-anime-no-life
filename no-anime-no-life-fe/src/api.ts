import axios, { AxiosResponse } from 'axios'
import { ResDataType, ResType } from './ajax'
import { AnimeInfo } from './type'

export const searchByKeyword = (keyword: string)  => {
  return axios.get<ResType<AnimeInfo[]>>(`http://localhost:3000/s/${keyword}`)
}