import { createRef, FocusEvent, KeyboardEvent, useState } from 'react'
import { localImg } from '../utils'
import { SearchAddDialog, SearchAddDialogRef } from './SearchAddDialog'
import { AnimeCategoryInfo, AnimeInfo } from '../type'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../store'
import { addAnimeCategory, modifyCategory, moveAnime, MoveAnimeParams, rmAnime } from '../store/anime'
import { ShareDialog, ShareDialogRef } from './ShareDialog'
import { AddSquareOutline, DeleteOutline } from 'antd-mobile-icons'
import { useClickAway } from 'ahooks'
import AnimeItem, { OpenSearchAdd } from './AnimeItem'
import SortableItem from './Drag/SortableItem'
import SortableContainer from './Drag/SortableContainer'


export const AnimeCategoryList = () =>{
  const dialogRef = createRef<SearchAddDialogRef>()
  const shareDialogRef = createRef<ShareDialogRef>()
  const contentRef = createRef<HTMLDivElement>()
  const animeList = useSelector<StateType, AnimeCategoryInfo[]>(state => state.anime) || []
  const dispatch = useDispatch()

  const openSearchAdd:OpenSearchAdd = (categoryId, data) => {
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
  // 拖拽排序结束
  function handleDragEnd(obj:MoveAnimeParams) {
    dispatch(
      moveAnime(obj)
    )
    setDragging(false)
  }
  const genSortableAnimeItems = (list: AnimeInfo[]) => {
    return list.map(item => {
      return {
        ...item,
        id: item.aid
      }
    })
  }
  const [isDragging, setDragging] = useState(false)
  const handleDragStart = () => {
    setDragging(true)
  }

  return (
    <>
      <div className="flex flex-row overflow-x-auto w-full h-full" ref={contentRef}>


        {
          animeList.map(categoryItem => {
            const {categoryId, editing} = categoryItem
            return (
              <div className='flex flex-col flex-nowrap w-14 h-full mx-1 flex-shrink-0' key={categoryId} ref={editInputRef}>
                {
                  editing
                    ?
                    <input
                      autoFocus
                      onKeyDown={(e) => handleKeyDown(e, categoryItem)}
                      onBlur={(e) => modifyCategoryName(e, categoryItem)}
                      data-id={categoryId} defaultValue={categoryItem.categoryName}
                      type="text" placeholder="编辑类目" maxLength={5}
                      className="h-4 w-full text-sm" />
                    :
                    <div className="text-sm font-sans text-nowrap font-bold"
                      onClick={() => onEditCategory(categoryItem)} >{categoryItem.categoryName}
                    </div>
                }

                <div className='flex flex-col flex-nowrap overflow-y-auto overflow-x-hidden h-full relative' style={{touchAction: isDragging ?'none' : 'auto'}} >
                  <SortableContainer items={genSortableAnimeItems(categoryItem.list)} onDragStart={handleDragStart} onDragEnd={(obj) => {handleDragEnd({categoryId, ...obj})}}>
                    {
                      categoryItem.list.map(animeItem => {
                        const {aid} = animeItem
                        return (
                          <SortableItem key={aid} id={aid}>
                            <AnimeItem categoryId={categoryId} animeItem={animeItem} openSearchAdd={openSearchAdd} ></AnimeItem>
                          </SortableItem>
                        )
                      })
                    }
                  </SortableContainer>


                  <div
                    className="flex flex-nowrap items-center justify-around"
                  >
                    <DeleteOutline 
                      className="text-base"
                      color='var(--adm-color-danger)'
                      onMouseUp={(e) => {e.stopPropagation();deleteAnime(categoryId)}}
                    />
                    <AddSquareOutline
                      className="text-base"
                      color="#76c6b8"
                      onMouseUp={() => openSearchAdd(categoryId)}
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

