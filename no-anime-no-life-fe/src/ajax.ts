import axios from 'axios'
const baseURL = location.href.includes('localhost') ? 'http://localhost:3000/' : `https://${import.meta.env.NANF_API_BASE_URL}`
axios.defaults.headers.common['User-Agent'] = 'iacg-world/no-anime-no-life';
const instance = axios.create({
  baseURL: `${baseURL}/api/`,
  timeout: 8 * 1000,
})

export default instance

