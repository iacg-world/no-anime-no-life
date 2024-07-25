import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useRequest } from 'ahooks'
import { searchByKeyword } from './api'
import { AnimeCategoryList } from './components/AnimeCategoryList'

function App() {

  
  return (
    <>
      <AnimeCategoryList/>
    </>
  )
}

export default App
