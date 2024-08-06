import { createContext, FC } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type PropsType = {
  id: string
  children: JSX.Element
}
export const DragContext = createContext<boolean>(false)

const SortableItem: FC<PropsType> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <DragContext.Provider value={isDragging}>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    </DragContext.Provider>

  )
}

export default SortableItem
