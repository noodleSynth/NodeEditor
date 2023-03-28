import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue"
import { KeyboardKeys } from "./keys"

export interface Vector2{
  x: number,
  y: number
}

type dragHandler = { (delta: Vector2) : void}


const lastTouch = ref([])

export const useClickDrag = (enabled: Ref<Boolean> | undefined) => {
  
  const mouseClickStart = ref<{ x: number, y: number }>()

  if (enabled)
    watch(enabled, () => mouseClickStart.value = undefined)
  
  const onDrag: dragHandler[] = []
  const onDrop: dragHandler[] = []
  const onStart: dragHandler[] = []

  const delta = (e: MouseEvent) => {
    if(!mouseClickStart.value) return {x: 0, y: 0}
    const { a, b } = { a: e.clientX, b: e.clientY }
    const { x, y } = mouseClickStart.value
    return { x: a - x, y: b - y }
  }

  const handleClickDrag = (e: MouseEvent) => {
    if(enabled && !enabled.value) return
    if(!mouseClickStart.value) return 
    
    if (e.buttons == 1) {
        if(onDrag)
          onDrag.forEach((q) => q(delta(e))) 
    } 
    
  }

  const floating = computed(() => mouseClickStart.value ? true : undefined)

  const clearMouseDown = (e: MouseEvent) => {
    if(mouseClickStart.value && onDrop) onDrop.forEach((q) => q(delta(e))) 
    mouseClickStart.value = undefined
  }

  onMounted(() => {
    window.addEventListener("mousemove", handleClickDrag)
    window.addEventListener("mouseup", clearMouseDown)
  })

  onBeforeUnmount(() => {
    window.removeEventListener("mousemove", handleClickDrag)
    window.removeEventListener("mouseup", clearMouseDown)
  })

  return {
    floating,
    attrs: computed (() => ({
      floating: floating.value,
    })),
    events: {
      mousedown: (e: MouseEvent) => {
        e.stopPropagation()
        if(enabled && !enabled.value) return
        mouseClickStart.value = { x: e.clientX, y: e.clientY }
        if(onStart)
          onStart.forEach((q) => q(delta(e))) 
      },
    },
    onDrag: (e: dragHandler) => onDrag.push(e),
    onDrop: (e: dragHandler) => onDrop.push(e),
    onStart: (e: dragHandler) => onStart.push(e),
    dragStart: mouseClickStart
  }
}