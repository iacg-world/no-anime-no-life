import axios, { AxiosResponse } from 'axios'
import { ResDataType, ResType } from './ajax'
import { AnimeInfo, ResponseResult } from './type'

export const searchByKeyword = (keyword: string)  => {
  return axios.get<ResponseResult<AnimeInfo[]>>(`http://localhost:3000/s/${keyword}`)
}