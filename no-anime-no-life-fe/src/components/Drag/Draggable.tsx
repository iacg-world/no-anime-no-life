import React from 'react'
import {useDraggable} from '@dnd-kit/core'
import {CSS} from '@dnd-kit/utilities'

interface DragProps { id: any; children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined }

export default function Draggable(props: DragProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  })
  const style = {
    // Outputs `translate3d(x, y, 0)`
    transform: CSS.Translate.toString(transform),
  }

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  )
}