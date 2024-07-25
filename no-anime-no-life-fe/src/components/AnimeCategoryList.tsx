import { createRef, forwardRef, useEffect, useRef, useState } from 'react'
import { mockAnimeList } from '../mock'
import { localImg, takeScreenshot } from '../utils'
import { SearchAddDialog, SearchAddDialogRef } from './SearchAddDialog'
import useAnimeData from '../hooks/useAnimeData'
import { AnimeCategoryInfo, AnimeInfo } from '../type'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../store'
import { addAnimeCategory } from '../store/anime'
import { ShareDialog, ShareDialogRef } from './ShareDialog'



export const AnimeCategoryList = () =>{
  const dialogRef = createRef<SearchAddDialogRef>()
  const shareDialogRef = createRef<ShareDialogRef>()
  const contentRef = createRef<HTMLDivElement>()
  const animeList = useSelector<StateType, AnimeCategoryInfo[]>(state => state.anime) || []
  const [sharing, setSharing] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    console.log(animeList)
    
  }, [animeList])
  const openSearchAdd = (categoryId: string, data?:AnimeInfo) => {
    dialogRef.current?.openModal({categoryId, animeInfo: data})
  }

  const addCategory = (e: { target: { value: string } }) => {
    const v = e.target.value
    if (v) {

      dispatch(
        addAnimeCategory(v)
      )
      e.target.value = ''
    }

  }

  const onShare = async () => {
    shareDialogRef.current?.openModal()
  }

  return (
    <>
      <div className="flex flex-row overflow-x-auto max-h-screen w-screen min-h-screen" ref={contentRef}>
        {
          animeList.map(categoryItem => {
            return (
              <div className='flex flex-col flex-nowrap min-w-12 max-w-16' key={categoryItem.categoryId}>
                <div className="text-sm font-sans text-nowrap">{categoryItem.categoryName}</div>
                <div className={`flex flex-col flex-nowrap px-1 ${sharing ? '' : 'overflow-y-auto'}`}>
                  {
                    categoryItem.list.map(animeItem => {
                      return (
                        <div 
                          key={animeItem.aid}
                          onMouseUp={() => openSearchAdd(categoryItem.categoryId, animeItem)}
                          className="flex flex-col items-center">
                          <img src={animeItem.images?.large} alt="" className="w-full h-auto" />
                          <div className="flex flex-row text-xs">{animeItem.name_cn}</div>
                        </div>
                      )
                    })
                  }
                  <div
                    onMouseUp={() => openSearchAdd(categoryItem.categoryId)}
                    onTouchEnd={() => openSearchAdd(categoryItem.categoryId)}
                    className="flex flex-col items-center justify-center border-dashed border border-gray w-full min-h-9">
                    <img src={localImg('add.png')} alt="" className="size-5"/>
                  </div>
                </div>
              </div>
            )
            
          })
        }
        <div
          className="flex flex-col items-center justify-center min-w-10 h-4">
          <input onBlur={addCategory} type="text" placeholder="新增类目" maxLength={5} className="h-full w-full text-sm" />
        </div>
      </div>
      <SearchAddDialog ref={dialogRef}></SearchAddDialog>
      <ShareDialog  ref={shareDialogRef} animeList={animeList} />
      <div onClick={onShare} className="fixed right-1 bottom-1">
        <img className="size-4" src={localImg('share.png')} alt="" />
      </div>
    </>
  )
}

