import { 
  defineComponent,
  Types
} from "bitecs"

export const Jump = defineComponent({
  bufferTimer:Types.f32,
  coyoteTimer:Types.f32,
  jumpVelocity:Types.f32,
  maxJumpTime:Types.f32,
  currentJumpTimer:Types.f32,
  fallingGravityMod:Types.f32,
  holdingJump:Types.ui8
})