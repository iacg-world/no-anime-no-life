import { useState } from 'react'
import { nanoid } from 'nanoid'
import { AnimeCategoryInfo, AnimeInfo } from '../type'
import { produce } from 'immer'

export default function useAnimeData() {
  const initData = JSON.parse(localStorage.getItem('animeData') || '[]')
  const [animeList, setAnimeList] = useState<AnimeCategoryInfo[]>(initData)
  const setAnimeListWrap = (data:AnimeCategoryInfo[]) => {
    setAnimeList(data)
    localStorage.setItem('animeData', JSON.stringify(data))
  }

  const addAnimeCategory = (categoryName:string) => {
    const newList = produce(animeList, draft => {
      draft.push({
        categoryId: nanoid(),
        categoryName: categoryName,
        list: []
      })
    })

    setAnimeListWrap(newList)

  

  }
  const addAnime = (categoryId:string, obj:AnimeInfo) => {
    const newAnimeList = produce(animeList, draft => {
      draft.map(item => {
        if (item.categoryId === categoryId) {
          const newList= produce(item.list, draft2 => {
            draft2.push({
              ...obj,
              aid: nanoid(),
            })
          })
          item.list = newList


        }
        return item

      })

    })
    setAnimeListWrap(newAnimeList)

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
    setAnimeListWrap(newAnimeList)
  }
  const modifyCategory = (categoryId:string, name:string) => {
    const newAnimeList = produce(animeList, draft => {
      draft.map(item => {
        if (item.categoryId === categoryId) {
          return {
            ...item,
            categoryName: name,
          }
        } else {
          return item
        }
      })

    })
    setAnimeListWrap(newAnimeList)
  }
  return {
    animeList,
    addAnimeCategory,
    addAnime,
    modifyAnime,
    modifyCategory,
  }
}
