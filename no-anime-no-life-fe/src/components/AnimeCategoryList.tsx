import { createRef, forwardRef, useEffect, useRef, useState } from 'react'
import { mockAnimeList } from '../mock'
import { localImg } from '../utils'
import { SearchAddDialog, SearchAddDialogRef } from './SearchAddDialog'



export const AnimeCategoryList = () =>{
  const dialogRef = createRef<SearchAddDialogRef>()
  useEffect(() => {
  })
  const openSearchAdd = () => {
    dialogRef.current?.openModal()
  }
  
  return (
    <>
      <div className="flex flex-row overflow-hidden max-h-screen">
        {
          mockAnimeList.map(categoryItem => {
            return (
              <div className='flex flex-col flex-nowrap w-12'>
                <div className="text-sm font-sans">{categoryItem.categoryName}</div>
                <div className="flex flex-col flex-nowrap overflow-y-auto px-1">
                  {
                    categoryItem.list.map(animeItem => {
                      return (
                        <div 
                          onClick={openSearchAdd}
                          className="flex flex-col items-center">
                          <img src={animeItem.images.large} alt="" className="w-full h-auto"/>
                          <div className="flex flex-row text-xs">{animeItem.name_cn}</div>
                        </div>
                      )
                    })
                  }
                  <div
                    onClick={openSearchAdd}
                    onTouchStart={openSearchAdd}
                    className="flex flex-col items-center justify-center border-dashed border border-gray w-full min-h-9">
                    <img src={localImg('add.png')} alt="" className="size-5"/>
                  </div>
                </div>
              </div>
            )
            
          })
        }
      </div>
      <SearchAddDialog ref={dialogRef}></SearchAddDialog>
    </>
  )
}

