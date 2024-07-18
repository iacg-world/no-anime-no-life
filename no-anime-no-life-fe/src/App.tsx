import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRequest } from 'ahooks'
import { searchByKeyword } from './api'
import { AnimeList } from './components/AnimeList'


const getSearchRes = () => {
  return searchByKeyword('刀剑神域')
} 
function App() {
  const [count, setCount] = useState(0)
  const { data, loading } = useRequest(getSearchRes);
  
  return (
    <>
        <AnimeList/>
    </>
  )
}

export default App
