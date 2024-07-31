import { forwardRef, useImperativeHandle, useState, useEffect} from 'react'
import { useRequest } from 'ahooks'
import { searchByKeyword } from '../api'
import { AnimeInfo } from '../type'
import { addAnime, modifyAnime } from '../store/anime'
import { useDispatch } from 'react-redux'
import { Button, Toast } from 'antd-mobile'


export interface SearchAddDialogProps {

}

interface AddInfo {
  categoryId: string,
  animeInfo?: AnimeInfo
}
 
export type SearchAddDialogRef = {
  openModal: (addInfo: AddInfo) => void;
};


const getSearchRes = async (key:string)=> {
  return await searchByKeyword(key)
} 

export const SearchAddDialog = forwardRef<SearchAddDialogRef, SearchAddDialogProps>((_props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const dispatch = useDispatch()
  const { data:searchData, loading, runAsync } = useRequest(getSearchRes, {
    manual: true,
    debounceWait: 500,
  })
  const [searchAnimeList, setAnimeList] = useState<AnimeInfo[]>([])

  useEffect(() => {
    const data = searchData?.data
    if (data?.code === 200) {
      setAnimeList(data.data)
    } else {
      setAnimeList([])

    }
    
  }, [searchData])

  const inputChange = async (e: { currentTarget: { value: string; }; }) => {
    const value = e.currentTarget.value
    if (value) {
      setInputValue(value)
      await runAsync(value)
    } else {
      setInputValue('')

    }
  }

  const [addInfo, setAddInfo]= useState<AddInfo>({categoryId: ''})
  const openModal = (data:AddInfo) => {
    setAddInfo(data)
    setAnimeList([])
    setInputValue('')
    setIsOpen(true)
  }
  useImperativeHandle(ref, () => ({
    openModal
  }))
  const closeModal = () => {
    setIsOpen(false)
  }

  const chooseAnime = async (data: AnimeInfo) => {
    if (addInfo.animeInfo) {
      await dispatch(
        modifyAnime({categoryId: addInfo.categoryId, aid: addInfo.animeInfo.aid, obj: data})
      )
      
      Toast.show({
        content: '修改成功',
        position: 'top',
      })
    } else {
      await dispatch(
        addAnime({categoryId: addInfo.categoryId, obj: data})
      )
      Toast.show({
        content: '添加成功',
        position: 'top',
        duration: 800,
      })
    }

  }
 
  return (
    <div>
      {isOpen && (
        <div className="bg-stone-900/60 fixed top-0 left-0 w-full h-screen flex items-center justify-center">
          <div className="bg-white p-1 w-4/5 min-h-1/2 flex flex-col items-center box-border rounded-sm">
            <input placeholder="输入关键字查询动画" className="text-sm border-solid border-black/60 border rounded-sm py-1 px-2" type="text" value={inputValue} onChange={inputChange}/>
            {
              !loading ? 
                <div className="flex flex-row flex-wrap overflow-y-auto" style={{minHeight: '50vh',maxHeight: '80vh'}}>
                  {
                    searchAnimeList.map(item => {
                      return (
                        <div
                          key={item.aid}
                          onClick={() => chooseAnime(item)}
                          className="flex flex-col items-center w-12 mr-1">
                          <img src={item.images?.large} alt="" className="w-full h-14"/>
                          <div className="flex flex-row text-xs">{item.name_cn || item.name}</div>
                        </div>
                      )
                    })
                  }
                </div> :
                <div className="flex flex-row flex-wrap overflow-y-auto" style={{minHeight: '50vh',maxHeight: '80vh'}}>
            加载中。。。
                </div>
            }


            <Button onClick={closeModal}>关闭</Button>
          </div>
        </div>
      )}
    </div>
  )
})