import { createContext, FC } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { UniqueIdentifier } from '@dnd-kit/core'


type PropsType = {
  id: string
  children: JSX.Element
}
export const DragContext = createContext<{
  isDragging: boolean,
  activeId?: UniqueIdentifier,
}>({
  isDragging: false,
  activeId: ''
})

const SortableItem: FC<PropsType> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, active} = useSortable({ id })
  
  const style:React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <DragContext.Provider value={{isDragging, activeId: active?.id}}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    </DragContext.Provider>

  )
}

export default SortableItem
