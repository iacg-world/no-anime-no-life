import axios from 'axios'
const baseURL = location.href.includes('localhost') ? 'http://localhost:3000/' : `https://${import.meta.env.NANF_API_BASE_URL}/api/`
const instance = axios.create({
  baseURL: `${baseURL}`,
  timeout: 10 * 1000,
})

export default instance

