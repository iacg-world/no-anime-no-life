import { FC } from 'react'
import {
  Modifiers,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext,
  SortingStrategy,
} from '@dnd-kit/sortable'
import { SortableAnimeCategoryInfo, SortableAnimeInfo } from '../../type'
import { MoveAnimeParams } from '../../store/anime'

type PropsType = {
  children: JSX.Element[]
  id: string,
  items: SortableAnimeInfo[] | SortableAnimeCategoryInfo[]
  onDragEnd: (obj?: Omit<MoveAnimeParams, 'categoryId'>) => void
  onDragStart?: (event: DragStartEvent) => void,
  strategy: SortingStrategy,
  modifiers?: Modifiers | undefined,
  dragOverlay?: boolean
}



const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items, strategy, id} = props

  const { setNodeRef } = useDroppable({
    id
  })

  return (

    <SortableContext id={id} items={items} strategy={strategy}>
      <div ref={setNodeRef}>
        {children}
      </div>
    </SortableContext>
  )
}

export default SortableContainer
