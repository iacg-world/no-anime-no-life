import { createRef, FocusEvent, KeyboardEvent } from 'react'
import { localImg } from '../utils'
import { SearchAddDialog, SearchAddDialogRef } from './SearchAddDialog'
import { AnimeCategoryInfo, AnimeInfo } from '../type'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../store'
import { addAnimeCategory, modifyCategory, rmAnime } from '../store/anime'
import { ShareDialog, ShareDialogRef } from './ShareDialog'
import { AddSquareOutline, DeleteOutline } from 'antd-mobile-icons'
import { useClickAway } from 'ahooks'



export const AnimeCategoryList = () =>{
  const dialogRef = createRef<SearchAddDialogRef>()
  const shareDialogRef = createRef<ShareDialogRef>()
  const contentRef = createRef<HTMLDivElement>()
  const animeList = useSelector<StateType, AnimeCategoryInfo[]>(state => state.anime) || []
  const dispatch = useDispatch()

  const openSearchAdd = (categoryId: string, data?:AnimeInfo) => {
    dialogRef.current?.openModal({categoryId, animeInfo: data})
  }

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

  const deleteAnime = (categoryId:string) => {

    dispatch(
      rmAnime({categoryId})
    )
  }
  const editInputRef = createRef<HTMLInputElement>()
  let lastCategoryId = ''
  useClickAway(
    () => {
      dispatch(
        modifyCategory({categoryId: lastCategoryId, editing: false})
      )
    },
    () => editInputRef.current
  )
  const onEditCategory = (data: AnimeCategoryInfo) => {
    lastCategoryId = data.categoryId
    
    dispatch(
      modifyCategory({categoryId: data.categoryId, editing: true})
    )

  }
  const modifyCategoryName = (e: FocusEvent<HTMLInputElement, Element>, data: AnimeCategoryInfo) => {
    dispatch(
      modifyCategory({...data, categoryName: (e.target as HTMLInputElement).value, editing: false})
    )

  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, data: AnimeCategoryInfo) => {
    
    if (e.key === 'Enter') { // 检查按下的是否是回车键
      dispatch(
        modifyCategory({...data, categoryName: (e.target as HTMLInputElement).value, editing: false})
      )
    }

  }

  return (
    <>
      <div className="flex flex-row overflow-x-auto w-full h-full" ref={contentRef}>
        {
          animeList.map(categoryItem => {
            return (
              <div className='flex flex-col flex-nowrap min-w-14 max-w-16 h-full' key={categoryItem.categoryId} ref={editInputRef}>
                {
                  categoryItem.editing 
                    ?
                    <input
                      autoFocus
                      onKeyDown={(e) => handleKeyDown(e, categoryItem)}
                      onBlur={(e) => modifyCategoryName(e, categoryItem)}
                      data-id={categoryItem.categoryId} defaultValue={categoryItem.categoryName}
                      type="text" placeholder="编辑类目" maxLength={5} className="h-4 w-full text-sm" />
                    :
                    <div className="text-sm font-sans text-nowrap font-bold"
                      onClick={() => onEditCategory(categoryItem)} >{categoryItem.categoryName}
                    </div>
                }
                <div className='flex flex-col flex-nowrap px-1 overflow-y-auto h-full flex-1'>
                  {
                    categoryItem.list.map(animeItem => {
                      return (
                        <div 
                          key={animeItem.aid}
                          onMouseUp={() => openSearchAdd(categoryItem.categoryId, animeItem)}
                          className="flex flex-col items-center">
                          <img src={animeItem.images?.medium} alt="" className="w-full min-h-16 max-h-18" />
                          <div className="flex flex-row text-xs">{animeItem.name_cn || animeItem.name}</div>
                        </div>
                      )
                    })
                  }
                  <div
                    className="flex flex-nowrap items-center justify-around"
                  >
                    <DeleteOutline 
                      className="text-base"
                      color='var(--adm-color-danger)'
                      onMouseUp={(e) => {e.stopPropagation();deleteAnime(categoryItem.categoryId)}}
                    />
                    <AddSquareOutline
                      className="text-base"
                      color="#76c6b8"
                      onMouseUp={() => openSearchAdd(categoryItem.categoryId)}
                    />

                  </div>

                </div>
              </div>
            )
            
          })
        }
        <div
          className="flex flex-col items-center justify-center min-w-10 h-4">
          <input 
            onKeyDown={(e) => enterAddCategory(e)}
            onBlur={addCategory} type="text" placeholder="输入新类目" maxLength={5} className="h-full w-full text-sm" />
        </div>
      </div>
      <SearchAddDialog ref={dialogRef}></SearchAddDialog>
      <ShareDialog  ref={shareDialogRef} animeList={animeList} />
      <div onClick={onShare} className="fixed right-1 bottom-1 p-0.5 rounded-sm flex flex-col items-center">
        <img className="size-8 mb-0.5" src={localImg('share.png')} alt="" />
      </div>
    </>
  )
}

