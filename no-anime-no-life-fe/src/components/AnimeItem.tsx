import { FC, useContext } from 'react'
import { AnimeInfo } from '../type'
import { DragContext } from './Drag/SortableItem'
import { Image } from 'antd-mobile'
export type OpenSearchAdd = (categoryId: string, data?:AnimeInfo) => void

interface PropsType {
  categoryId: string,
  animeItem: AnimeInfo
  openSearchAdd: OpenSearchAdd
}

export const AnimeItem:FC<PropsType> = (props) => {
  const {categoryId, animeItem, openSearchAdd} = props
  const isDrag = useContext(DragContext)

  return (
    <div 
      onMouseUp={() => !isDrag && openSearchAdd(categoryId, animeItem)}
      className="flex flex-col items-center">
      <Image draggable src={animeItem.images?.medium} alt="" className="w-full min-h-16 max-h-18" />
      <div className="flex flex-row text-xs">{animeItem.name_cn || animeItem.name}</div>
    </div>

  )
}

export default AnimeItem