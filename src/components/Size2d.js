import { 
  defineComponent,
  Types
} from "bitecs"

export const Size2d = defineComponent({
  width:Types.f32,
  height:Types.f32,
  radius:Types.f32
})