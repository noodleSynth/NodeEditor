import { computed, ref, type Ref } from "vue"
import { useClickDrag, type Vector2 } from "./ClickDrag.util"
import type { KeyboardKeys } from "./keys"


export const useTranslate = (enabled?: Ref<boolean>) => {

  const drag = useClickDrag(enabled)

  const dragDeltaTracker = ref<Vector2>()
  const translate = ref<Vector2>({x: 0, y: 0})

  drag.onDrag((delta) => {
    dragDeltaTracker.value = delta
  })

  drag.onDrop((delta) => {
    const { x, y } = translate.value
    translate.value = {
      x: x + delta.x,
      y: y + delta.y
    }

    dragDeltaTracker.value = undefined
  })

  const motion = computed(() => {
    return {
      x: translate.value.x + (dragDeltaTracker.value ? dragDeltaTracker.value.x : 0),
      y: translate.value.y + (dragDeltaTracker.value ? dragDeltaTracker.value.y : 0)
    }
  })

  return {
    events: drag.events,
    attrs: drag.attrs,
    floating: drag.floating,
    drag,
    translate,
    motion
  }
}