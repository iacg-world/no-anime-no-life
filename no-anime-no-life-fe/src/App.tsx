import { useDispatch, useSelector } from 'react-redux'
import './App.scss'

import { AnimeCategoryList } from './components/AnimeCategoryList'
import { StateType } from './store'
import { GlobalStore } from './type'
import { modifyTitle } from './store/global'
import { createRef, KeyboardEvent, useState } from 'react'
import { useDebounceFn } from 'ahooks'

function App() {
  const dispatch = useDispatch()
  const [editing, setEditing] = useState(false)
  const nameRef = createRef<HTMLInputElement>()
  const nameCnRef = createRef<HTMLInputElement>()
  const global = useSelector<StateType, GlobalStore>(state => {
    return state.global
  }) || {}

  const getValues = (): [string, string] => {
    if (nameRef.current && nameCnRef.current) {
      const topic_name = nameRef.current.value ? nameRef.current.value : global.title.topic_name
      const topic_name_cn = nameCnRef.current.value ? nameCnRef.current.value : global.title.topic_name_cn
      return [topic_name, topic_name_cn]

    } else {
      return [global.title.topic_name, global.title.topic_name_cn]
    }
    
  }
  const toggleEdit = (status: boolean) => {
    setEditing(status)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { // 检查按下的是否是回车键
      
      modifyTitleNameDebounce()
    }
  }
  const modifyTitleName = () => {
    dispatch(
      modifyTitle({key: 'topic_name', value: getValues()[0]} ),
    )
    dispatch(
      modifyTitle({key: 'topic_name_cn', value: getValues()[1]})
    )
    toggleEdit(false)

  }
  const {
    run: modifyTitleNameDebounce,
  } = useDebounceFn(modifyTitleName, {
    wait: 500,
    leading: true,
    trailing: false,
  })

  type EditType = 'name' | 'name_cn'
  const [editType, setEditType] = useState<EditType>('name')
  const clickEdit = (type: EditType) => {
    setEditType(type)
    toggleEdit(true)
  }


  
  return (
    <div className="flex flex-col h-screen overflow-hidden box-border bg-[#FFFAFA] lg:px-24">
      <div className="flex flex-col items-center h-[10vh]">
        {
          editing
            ?
            <>
              <input
                ref={nameRef}
                autoFocus={editType === 'name'}
                className="text-center text-xl font-bold"
                defaultValue={global.title.topic_name}
                onKeyDown={(e) => handleKeyDown(e)}
                onBlur={() => modifyTitleNameDebounce()}
                type="text" placeholder=""
              />
              <input
                ref={nameCnRef}
                autoFocus={editType === 'name_cn'}
                className="text-center font-bold"
                defaultValue={global.title.topic_name_cn}
                onKeyDown={(e) => handleKeyDown(e)}
                onBlur={() => modifyTitleNameDebounce()}
                type="text" placeholder=""
              />
            </>

            :
            <>
              <div onClick={() => clickEdit('name')} data-type="name" className="text-center text-xl font-bold min-h-4 min-w-6">{global.title.topic_name}</div>
              <div onClick={() => clickEdit('name_cn')} data-type="cn" className="text-center font-bold">{global.title.topic_name_cn}</div>
            </>

        }
      </div>
      <div className="grow h-[85vh] mb-2 shadow-md">
        <AnimeCategoryList/>
      </div>
      <div className="h-[5vh] text-center text-xs text-gray-400">
        <a target='_blank' className="mr-1" href="https://github.com/iacg-world/no-anime-no-life">@Github</a>
        <a target='_blank' href="https://github.com/bangumi/api">动画来自<strong>@番组计划</strong></a>
      </div>
    </div>
  )
}

export default App
