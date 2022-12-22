import {
  defineComponent,
  Types
} from "bitecs"

export const Sprite=defineComponent({
  texture:Types.ui8,
  frame:Types.ui8,
  flipX:Types.ui8
})