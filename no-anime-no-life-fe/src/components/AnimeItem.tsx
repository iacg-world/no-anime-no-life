import { FC, useContext } from 'react'
import { AnimeInfo } from '../type'
import { DragContext } from './Drag/SortableItem'
export type OpenSearchAdd = (categoryId: string, data?:AnimeInfo) => void

interface PropsType {
  categoryId?: string,
  animeItem: AnimeInfo
  openSearchAdd?: OpenSearchAdd
}

const AnimeItem:FC<PropsType> = (props) => {
  const {categoryId, animeItem, openSearchAdd} = props
  const {isDragging, activeId} = useContext(DragContext)
  const classNameStr = `flex flex-col items-center mx-0.5 ${activeId===animeItem.aid ? 'opacity-70': ''}`

  return (
    <div 
      onClick={() => (!isDragging && openSearchAdd && categoryId) && openSearchAdd(categoryId, animeItem)}
      className={classNameStr}>
      <img src={animeItem.images?.medium} alt="" className="w-full h-auto max-h-18" style={{pointerEvents: 'none'}} />
      <div className="flex flex-row text-xs">{animeItem.name_cn || animeItem.name}</div>
    </div>

  )
}

export default AnimeItem