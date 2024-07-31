import { createRef } from 'react'
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
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (userAgent.indexOf('micromessenger') !== -1) {
    // 确认是微信浏览器
      shareDialogRef.current?.openModal(true)

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
  const modifyCategoryName = (e: { target: { value: string } }, data: AnimeCategoryInfo) => {
    dispatch(
      modifyCategory({...data, categoryName: e.target.value, editing: false})
    )

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
                    <input autoFocus onBlur={(e) => modifyCategoryName(e, categoryItem)} data-id={categoryItem.categoryId} defaultValue={categoryItem.categoryName} type="text" placeholder="编辑类目" maxLength={5} className="h-4 w-full text-sm" />
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
                      onClick={(e) => {e.stopPropagation();deleteAnime(categoryItem.categoryId)}}
                    />
                    <AddSquareOutline
                      className="text-base"
                      color="#76c6b8"
                      onMouseUp={() => openSearchAdd(categoryItem.categoryId)}
                      onTouchEnd={() => openSearchAdd(categoryItem.categoryId)}
                    />

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
      <div onClick={onShare} className="fixed right-1 bottom-1 p-0.5 bg-white rounded-sm flex flex-col items-center">
        <img className="size-4 mb-0.5" src={localImg('share.png')} alt="" />
        分享
      </div>
    </>
  )
}

