import { 
  defineComponent,
  Types
} from "bitecs"

export const Movement = defineComponent({
  x:Types.f32,
  y:Types.f32,
  speed:Types.ui8,
})