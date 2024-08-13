import { Modifier } from '@dnd-kit/core'

export const restrictToVerticalAxis: Modifier = ({ transform }) => {
  return {
    ...transform,
    x: 0,
  }
}

export const restrictToHorizontalAxis: Modifier = ({transform}) => {
  return {
    ...transform,
    y: 0,
  }
}