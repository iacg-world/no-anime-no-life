import axios from "axios"

export const searchByKeyword = (keyword: string) => {
  return axios.get<[]>(`http://localhost:3000/s/${keyword}`)
}