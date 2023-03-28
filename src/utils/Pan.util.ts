import { computed, ref } from "vue"
import { useClickDrag, type Vector2 } from "./ClickDrag.util"
import { useKeyHold } from "./KeyHold.utils"
import { KeyboardKeys } from "./keys"
import { useTranslate } from "./Tranlate.util"

export const usePan = () => {
  
  const {engaged} = useKeyHold([KeyboardKeys.Space])
  const {floating, events, attrs, motion} = useTranslate(engaged)

  const styles = computed(() => {
    const { x, y } = motion.value
    
    return {
      "background-position": `${x}px ${y}px`
    }
  })

  const componentLayerStyles = computed(() => {
    const { x, y } = motion.value
    
    return {
      "top": `${y}px `,
      "left": `${x}px `
    }
  })


  return {
    events: {
      ...events,
    },
    attrs: computed(() => ({
      ...attrs,
      panning: engaged.value ? true : undefined
    })),
    styles,
    componentLayerStyles,
    pan: motion
  }
}