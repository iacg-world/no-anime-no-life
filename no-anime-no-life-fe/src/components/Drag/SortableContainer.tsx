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
  SortingStrategy,
} from '@dnd-kit/sortable'
import { SortableAnimeCategoryInfo, SortableAnimeInfo } from '../../type'
import { MoveAnimeParams } from '../../store/anime'

type PropsType = {
  children: JSX.Element | JSX.Element[]
  items: SortableAnimeInfo[] | SortableAnimeCategoryInfo[]
  onDragEnd: (obj?: Omit<MoveAnimeParams, 'categoryId'>) => void
  onDragStart?: (event: DragEndEvent) => void,
  strategy: SortingStrategy,
}

const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items, onDragEnd, onDragStart, strategy } = props

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
        delay: 250,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 10,
      },

    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over == null) {
      onDragEnd()
      return
    }

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(a => a.id  === active.id)
      const newIndex = items.findIndex(a => a.id === over.id)
      onDragEnd({oldIndex, newIndex})
    } else {
      onDragEnd()
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={onDragStart}>
      <SortableContext items={items} strategy={strategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

export default SortableContainer
