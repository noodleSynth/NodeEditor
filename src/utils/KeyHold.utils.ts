import { computed, onBeforeUnmount, onMounted, ref, type Ref } from "vue";
import type { KeyboardKeys } from "./keys";

export const useKeyHold = (keys: KeyboardKeys[], enabled?: Ref<boolean>) => {
  const keysDown = ref<{ [key: string]: boolean }>({})

  const engaged = computed(() => {
    return keys.find((key) => keysDown.value[key] == undefined) === undefined
  })


  const keyDown = (e: KeyboardEvent) => {
    if (enabled && !enabled.value) return
    if ((keys as string[]).includes(e.code)) keysDown.value[e.code as string] = true
  }

  const keyUp = (e: KeyboardEvent) => {
    if(enabled && !enabled.value) return
    if ((keys as string[]).includes(e.code)) delete keysDown.value[e.code as string]
  }

  onMounted(() => {
    window.addEventListener("keydown", keyDown)
    window.addEventListener("keyup", keyUp)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", keyDown)
    window.removeEventListener("keyup", keyUp)
  })

  return {
    engaged,
    disengaged: computed(() => engaged.value)
  }
}