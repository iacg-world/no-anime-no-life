import { createContext, FC, LegacyRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { DraggableAttributes, UniqueIdentifier } from '@dnd-kit/core'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'

type PropsType = {
  id: string
  handle?: boolean
  children: JSX.Element
}
export const DragContext = createContext<{
  isDragging: boolean,
  activeId?: UniqueIdentifier,
  handleProps?: {
    ref: LegacyRef<any>,
    listeners: SyntheticListenerMap | undefined,
    attributes: DraggableAttributes | object,
  }

}>({
  isDragging: false,
  activeId: '',


})

const SortableItem: FC<PropsType> = ({ id, children, handle }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, active, setActivatorNodeRef} = useSortable({ id })
  
  const style:React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <DragContext.Provider value={{
      isDragging, activeId: active?.id,
      handleProps: {
        ref: setActivatorNodeRef,
        attributes,
        listeners,
      }
    }}>
      <div ref={setNodeRef} {...(!handle ? attributes : {})} {...(!handle ? listeners : {})}  style={style} >
        {children}
      </div>
    </DragContext.Provider>

  )
}

export default SortableItem
