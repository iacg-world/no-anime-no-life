import { useState } from 'react'
import { mockAnimeList } from '../mock'
import { nanoid } from 'nanoid'
import { AnimeDataInfo, AnimeInfo } from '../type'
import { produce } from 'immer'

export default function useAnimeData() {
  const [animeList, setAnimeList] = useState(mockAnimeList)

  const addAnimeCategory = (categoryName:string) => {
    const newList = produce(animeList, draft => {
      draft.push({
        categoryId: nanoid(),
        categoryName: categoryName,
        list: []
      })
    })

    setAnimeList(newList)

  

  }
  const addAnime = (categoryId:string, obj:AnimeInfo) => {
    const newAnimeList = produce(animeList, draft => {
      draft.map(item => {
        if (item.categoryId === categoryId) {
          const newList= produce(item.list, draft => {
            draft.push({
              ...obj,
              aid: nanoid(),
            })
          })
          return {
            ...item,
            list: newList,
          }

        } else {
          return item
        }

      })

    })
    setAnimeList(newAnimeList)

  }

  const modifyAnime = (categoryId:string, aid:string, obj: AnimeInfo) => {
    const newAnimeList = produce(animeList, draft => {
      draft.map(item => {
        if (item.categoryId === categoryId) {
          const newList= produce(item.list, draft => {
            draft.map(item => {
              if (item.aid === aid) {
                return {
                  ...obj,
                  aid: item.aid,
                }

              } else {
                return item
              }
            })

          })
          return {
            ...item,
            list: newList,
          }

        } else  {
          return item
        }
      })

    })
    setAnimeList(newAnimeList)
  }
  return {
    addAnimeCategory,
    addAnime,
    modifyAnime,
    animeList,
  }
}