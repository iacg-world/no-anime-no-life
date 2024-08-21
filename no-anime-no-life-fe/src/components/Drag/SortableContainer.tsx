import { FC } from 'react'
import {
  Modifiers,
} from '@dnd-kit/core'
import {
  SortableContext,
  SortingStrategy,
} from '@dnd-kit/sortable'
import { SortableAnimeCategoryInfo, SortableAnimeInfo } from '../../type'

type PropsType = {
  children: JSX.Element[] | JSX.Element
  id: string,
  items: SortableAnimeInfo[] | SortableAnimeCategoryInfo[]
  strategy: SortingStrategy,
  modifiers?: Modifiers | undefined,
}



const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items, strategy, id} = props

  return (

    <SortableContext id={id} items={items} strategy={strategy}>
      {children}
    </SortableContext>
  )
}

export default SortableContainer
