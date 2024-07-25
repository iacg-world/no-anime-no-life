import { forwardRef, useImperativeHandle, useState, FunctionComponent, FC, useEffect} from 'react'
import { useRequest } from 'ahooks'
import { getShareList, searchByKeyword } from '../api'
import { AnimeCategoryInfo, AnimeInfo, ResponseResult } from '../type'
import { AxiosResponse } from 'axios'
import useAnimeData from '../hooks/useAnimeData'
import { addAnime, modifyAnime } from '../store/anime'
import { useDispatch } from 'react-redux'


export interface ShareDialogProps {
  animeList: AnimeCategoryInfo[]

}

interface AddInfo {
  categoryId: string,
  animeInfo?: AnimeInfo
}
 
export type ShareDialogRef = {
  openModal: () => void;
};


const getSearchRes = async (key:string)=> {
  return await searchByKeyword(key)
} 

export const ShareDialog = forwardRef<ShareDialogRef, ShareDialogProps>((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const dispatch = useDispatch()
  const { data:searchData, loading, runAsync } = useRequest(getSearchRes, {
    manual: true,
    debounceWait: 500,
  })
  const [shareAnimeList, setAnimeList] = useState<AnimeInfo[]>([])

  useEffect(() => {
    const data = searchData?.data
    if (data?.code === 200) {
      setAnimeList(data.data)
    } else {
      setAnimeList([])

    }
    
  }, [searchData])


  const [addInfo, setAddInfo]= useState<AddInfo>({categoryId: ''})
  const openModal = () => {
    setAnimeList([])
    setInputValue('')
    setIsOpen(true)
    getShareList(props.animeList)
  }
  useImperativeHandle(ref, () => ({
    openModal
  }))
  const closeModal = () => {
    setIsOpen(false)
  }
 
  return (
    <div>
      {isOpen && (
        <div className="bg-stone-900/60 fixed top-0 left-0 w-full h-screen flex items-center justify-center">
          <div className="bg-white p-1 w-4/5 min-h-1/2 flex flex-col items-center box-border">


            <button onClick={closeModal}>关闭</button>
          </div>
        </div>
      )}
    </div>
  )
})