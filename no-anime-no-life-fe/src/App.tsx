import './App.css'

import { AnimeCategoryList } from './components/AnimeCategoryList'

function App() {

  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="text-center h-[10vh]">
        <div className="text-center text-xl font-bold">NO ANIME NO LIFE</div>
        <div className="text-center font-bold">动画人生分享器</div>
      </div>
      <div className="grow h-[85vh]">
        <AnimeCategoryList/>
      </div>
      <div className="h-[5vh]"></div>
    </div>
  )
}

export default App
