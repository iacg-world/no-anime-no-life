
import {useDroppable} from '@dnd-kit/core'

export function Droppable(props) {
  const {setNodeRef} = useDroppable({
    id: props.id,
  })
  const style = {
  }

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  )
}
  