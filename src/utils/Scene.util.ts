import { computed, getCurrentInstance, onMounted, ref, watch, type Ref } from "vue"
import type { Vector2 } from "./ClickDrag.util"
import type { ElementTerminal } from "./Terminal.util"
import { useTranslate } from "./Tranlate.util"


const scene : Ref<{
  children: {
    [uid: string]: Element
  }[]
}>= ref({
  children: {} as {
    [uid: string]: Element
  }[]
})

export const useScene = () => {

  const sceneChildren = computed(() => scene.value.children)

  return {
    sceneChildren
  }
}

