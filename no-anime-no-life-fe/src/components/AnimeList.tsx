import { useState } from 'react'
import { animeList } from '../mock'


export function AnimeList() {
  return (
    <>
      <div className="flex flex-row basis-1/4">
        {
          animeList.map(item => {
            return (
              <div className='flex flex-col flex-nowrap m-1.5 min-w-32'>
                <div className="basis-4">{item.category}</div>
                <div className="flex flex-row flex-nowrap"></div>
              </div>
            )
            
          })
        }
      </div>
    </>
  )
}