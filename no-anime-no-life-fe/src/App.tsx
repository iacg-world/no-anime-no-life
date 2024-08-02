import './App.css'

import { AnimeCategoryList } from './components/AnimeCategoryList'

function App() {

  
  return (
    <div className="flex flex-col h-screen overflow-hidden box-border bg-[#FFFAFA] lg:px-24">
      <div className="text-center h-[10vh]">
        <div className="text-center text-xl font-bold">NO ANIME NO LIFE</div>
        <div className="text-center font-bold">动画人生</div>
      </div>
      <div className="grow h-[85vh] mb-2 shadow-md">
        <AnimeCategoryList/>
      </div>
      <div className="h-[5vh] text-center text-xs text-gray-400">
        <a target='_blank' className="mr-1" href="https://github.com/iacg-world/no-anime-no-life">@Github</a>
        <a target='_blank' href="https://github.com/bangumi/api">动画来自<strong>番组计划</strong></a>
      </div>
    </div>
  )
}

export default App
