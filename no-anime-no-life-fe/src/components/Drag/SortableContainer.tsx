import { FC } from 'react'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { AnimeInfo } from '../../type'
import { MoveAnimeParams } from '../../store/anime'

type PropsType = {
  children: JSX.Element | JSX.Element[]
  items: AnimeInfo[]
  onDragEnd: (obj: Omit<MoveAnimeParams, 'categoryId'>) => void
  onDragStart: (event: DragEndEvent) => void
}

const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items, onDragEnd, onDragStart } = props

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
        delay: 250,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 10,
      },

    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over == null) return

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(a => a.aid === active.id)
      const newIndex = items.findIndex(a => a.aid === over.id)
      onDragEnd({oldIndex, newIndex})
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={onDragStart}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

export default SortableContainer
