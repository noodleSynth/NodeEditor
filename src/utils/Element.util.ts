import { useElementStore, type Element } from "@/stores/Element.store"
import { computed, onMounted, ref, watch } from "vue"
import type { Vector2 } from "./ClickDrag.util"
import type { ElementTerminal } from "./Terminal.util"
import { useTranslate } from "./Tranlate.util"


export const consumeElement = (handel: string) => {
  const elementStore = useElementStore()

  const element = computed(() => elementStore.element(handel))

  const { translate, floating, attrs, events, motion } = useTranslate()

  watch(motion, (nm) => {
    if(!element.value) return
    element.value.position = nm
  })

  return {
    element,
    attrs,
    events,
    style: computed(() => {
      if (!element.value) return {}
      return {
        top: `${element.value.position.y}px`,
        left: `${element.value.position.x}px`
      }
    })
  }
}

export const useSceneElement = (pos = {x: 0, y: 0} as Vector2) => {
  const uid: string = crypto.randomUUID()
  
  const elementStore = useElementStore()
  
  const handel = ref<string>(crypto.randomUUID())
  
  elementStore.registerElement(handel.value).position = pos
  
  const { element } = consumeElement(handel.value)
  

  // const element = computed(() => elementStore.element(handel.value))


 
  interface ElementTerminals{
    [name: string] : ElementTerminal<any>
  }


  

  onMounted(() => {
    // 
  })

  return {
    element,
  }
}
