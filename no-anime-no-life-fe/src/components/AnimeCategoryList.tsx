import { createRef, FocusEvent, KeyboardEvent } from 'react'
import { localImg } from '../utils'
import { AnimeCategoryInfo, SortableAnimeCategoryInfo } from '../type'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../store'
import { addAnimeCategory, MoveAnimeParams, moveCategory, } from '../store/anime'
import { ShareDialog, ShareDialogRef } from './ShareDialog'
import SortableItem from './Drag/SortableItem'
import SortableContainer from './Drag/SortableContainer'
import { horizontalListSortingStrategy } from '@dnd-kit/sortable'
import AnimeListItem from './AnimeListItem'
import { SearchAddDialog, SearchAddDialogRef } from './SearchAddDialog'
import { OpenSearchAdd } from './AnimeItem'


export const AnimeCategoryList = () =>{
  const shareDialogRef = createRef<ShareDialogRef>()
  const contentRef = createRef<HTMLDivElement>()
  const animeList = useSelector<StateType, AnimeCategoryInfo[]>(state => state.anime) || []
  const dispatch = useDispatch()



  const addCategory = (e: FocusEvent<HTMLInputElement, Element>) => {
    const v = (e.target as HTMLInputElement).value
    if (v) {

      dispatch(
        addAnimeCategory(v)
      );
      (e.target as HTMLInputElement).value = ''
    }
  }
  const enterAddCategory = (e: KeyboardEvent<HTMLInputElement>,) => {
    if (e.key === 'Enter') { // 检查按下的是否是回车键
      const v = (e.target as HTMLInputElement).value
      if (v) {
  
        dispatch(
          addAnimeCategory(v)
        );
        (e.target as HTMLInputElement).value = ''
      }
      const contentRefDom = contentRef.current
      requestAnimationFrame(() => {
        contentRefDom?.scrollTo(999999 , 0)
      })
    }
  }

  const onShare = async () => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('micromessenger') !== -1) {
    // 确认是微信浏览器
      shareDialogRef.current?.openModal()

    } else {
      shareDialogRef.current?.openModal()
    }

  }


  
  function handleAnimeListDragEnd(obj?:MoveAnimeParams) {
    if (obj) {
      dispatch(
        moveCategory(obj)
      )
    }

  }

  const genSortableAnimeCategoryInfoItems = (list: AnimeCategoryInfo[]):SortableAnimeCategoryInfo[] => {
    return list.map(item => {
      return {
        ...item,
        id: item.categoryId
      }
    })
  }
  const dialogRef = createRef<SearchAddDialogRef>()

  const openSearchAdd:OpenSearchAdd = (categoryId, data) => {
    dialogRef.current?.openModal({categoryId, animeInfo: data})
  }

  return (
    <>
      <div className="flex flex-row overflow-x-auto w-full h-full" ref={contentRef}>
        <SortableContainer  
          strategy={horizontalListSortingStrategy} 
          items={genSortableAnimeCategoryInfoItems(animeList)} 
          onDragEnd={(obj) => {handleAnimeListDragEnd(obj ? {...obj} : undefined)}}>


          {
            animeList.map(categoryItem => {
              const {categoryId} = categoryItem
              return (
                <SortableItem key={categoryId} id={categoryId}>
                  <AnimeListItem categoryItem={categoryItem} openSearchAdd={openSearchAdd}></AnimeListItem>
                </SortableItem>
              )
            
            })

          }
        </SortableContainer>
        <div
          className="flex flex-col items-center justify-center min-w-10 h-4">
          <input 
            onKeyDown={(e) => enterAddCategory(e)}
            onBlur={addCategory} type="text" placeholder="输入新类目" maxLength={5} className="h-full w-full text-sm" />
        </div>
      </div>

      <div onClick={onShare} className="fixed right-1 bottom-1 p-0.5 rounded-sm flex flex-col items-center">
        <img className="size-8 mb-0.5" src={localImg('share.png')} alt="" />
      </div>
      <ShareDialog  ref={shareDialogRef} animeList={animeList} />

      <SearchAddDialog ref={dialogRef}></SearchAddDialog>,

    </>

  )

}

