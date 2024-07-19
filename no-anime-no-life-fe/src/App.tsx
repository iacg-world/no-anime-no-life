import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRequest } from 'ahooks'
import { searchByKeyword } from './api'
import { AnimeCategoryList } from './components/AnimeCategoryList'


const getSearchRes = () => {
  return searchByKeyword('刀剑神域')
} 
function App() {
  const [count, setCount] = useState(0)
  const { data, loading } = useRequest(getSearchRes);
  
  return (
    <>
        <AnimeCategoryList/>
    </>
  )
}

export default App
