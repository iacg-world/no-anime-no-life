import { createRef, forwardRef, useEffect, useRef, useState } from 'react'
import { mockAnimeList } from '../mock'
import { localImg } from '../utils'
import { SearchAddDialog, SearchAddDialogRef } from './SearchAddDialog'
import useAnimeData from '../hooks/useAnimeData'
import { AnimeInfo } from '../type'
import { useDispatch, useSelector } from 'react-redux'
import { StateType } from '../store'
import { addAnimeCategory } from '../store/anime'



export const AnimeCategoryList = () =>{
  const dialogRef = createRef<SearchAddDialogRef>()
  const animeList = useSelector<StateType>(state => state.anime) || []
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

  return (
    <>
      <div className="flex flex-row overflow-hidden max-h-screen">
        {
          animeList.map(categoryItem => {
            return (
              <div className='flex flex-col flex-nowrap w-12' key={categoryItem.categoryId}>
                <div className="text-sm font-sans">{categoryItem.categoryName}</div>
                <div className="flex flex-col flex-nowrap overflow-y-auto px-1">
                  {
                    categoryItem.list.map(animeItem => {
                      return (
                        <div 
                          key={animeItem.aid}
                          onClick={() => openSearchAdd(categoryItem.categoryId, animeItem)}
                          className="flex flex-col items-center">
                          <img src={animeItem.images?.large} alt="" className="w-full h-auto"/>
                          <div className="flex flex-row text-xs">{animeItem.name_cn}</div>
                        </div>
                      )
                    })
                  }
                  <div
                    onClick={() => openSearchAdd(categoryItem.categoryId)}
                    onTouchStart={() => openSearchAdd(categoryItem.categoryId)}
                    className="flex flex-col items-center justify-center border-dashed border border-gray w-full min-h-9">
                    <img src={localImg('add.png')} alt="" className="size-5"/>
                  </div>
                </div>
              </div>
            )
            
          })
        }
        <div
          className="flex flex-col items-center justify-center w-12 h-4">
          <input onBlur={addCategory} type="text" placeholder="新增类目" className="h-full w-full text-sm" />
        </div>
      </div>
      <SearchAddDialog ref={dialogRef}></SearchAddDialog>
    </>
  )
}

