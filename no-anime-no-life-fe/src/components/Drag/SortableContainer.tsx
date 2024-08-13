import { FC, useState } from 'react'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  Modifiers,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  SortingStrategy,
} from '@dnd-kit/sortable'
import { SortableAnimeCategoryInfo, SortableAnimeInfo } from '../../type'
import { MoveAnimeParams } from '../../store/anime'
import { createPortal } from 'react-dom'

type PropsType = {
  children: JSX.Element[]
  items: SortableAnimeInfo[] | SortableAnimeCategoryInfo[]
  onDragEnd: (obj?: Omit<MoveAnimeParams, 'categoryId'>) => void
  onDragStart?: (event: DragStartEvent) => void,
  strategy: SortingStrategy,
  modifiers?: Modifiers | undefined,
  dragOverlay?: boolean
}



const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items, onDragEnd, onDragStart, strategy, modifiers, dragOverlay} = props
  const [activeId, setActiveId] = useState<UniqueIdentifier>()
  function handleDragStart(event:DragStartEvent) {
    if (event.active.id) {

      setActiveId(event.active.id)
      onDragStart && onDragStart(event)
    }
  }

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
    setActiveId(undefined)
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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={modifiers}
    >
      <SortableContext items={items} strategy={strategy}>
        {children}
      </SortableContext>
      {
        dragOverlay ? createPortal(
          
          <DragOverlay>
            {activeId ?
              <div className="scale-110">{children.find(item => item.key === activeId)}</div>:
              null
            }
          </DragOverlay>,
          document.body
        ) : null
      }

    </DndContext>
  )
}

export default SortableContainer
