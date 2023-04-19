import { onMounted, onUnmounted, type Ref, ref, watch, computed } from "vue"


export const useGlobalMouseMove = (enabled?: Ref<boolean>) => {

  const mousePosition = ref<number[]>()
  const moveCallbacks: Function[] = []

  const handleMouseMove = (e: Event) => {
    const event = e as MouseEvent
    if (enabled && !enabled.value) return mousePosition.value = undefined
    mousePosition.value = [
      event.clientX,
      event.clientY
    ]
    moveCallbacks.forEach(e => e())
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
  })


  return {
    mousePosition,
    onMove: (cb: Function) => moveCallbacks.push(cb)
  }
}

export const useGlobalMousePrimary = (enabled?: Ref<boolean>) => {

  const primaryButtonDown = ref<boolean>(false)
  const downCallbacks: Function[] = []
  const upCallbacks: Function[] = []

  const handleMouseDown = (e: Event) => {

    if (enabled && !enabled.value) return
    const event = e as MouseEvent 
    if (event.button === 0) {
      primaryButtonDown.value = true
      downCallbacks.forEach(e => e())
    }
  }

  const handleMouseUp = (e: Event) => {
    primaryButtonDown.value = false
    if ((e as PointerEvent).button === 0) {
      upCallbacks.forEach(e => e())
    }
  }

  onMounted(() => {
    window.addEventListener('pointerdown', handleMouseDown)
    window.addEventListener('pointerup', handleMouseUp)
  })

  onUnmounted(() => {
    window.removeEventListener('pointerdown', handleMouseDown)
    window.removeEventListener('pointerup', handleMouseUp)
  })

  if(enabled)
    watch(enabled, () => primaryButtonDown.value = false)

  return {
    primaryButtonDown,
    onMouseDown: (cb: Function) => downCallbacks.push(cb),
    onMouseUp: (cb: Function) => upCallbacks.push(cb)
  }
}

export const useGlobalMouseDrag = (enabled?: Ref<boolean>) => {

  const { primaryButtonDown, onMouseUp } = useGlobalMousePrimary(enabled)

  const { mousePosition, onMove } = useGlobalMouseMove(primaryButtonDown)

  const dragStart = ref<number[]>()
  const dragDelta = ref<number[]>([0, 0])
  
  const dragTracker = ref<number[]>([0, 0])

  const dragTotal = computed(() => {
    if (!dragStart.value) return dragTracker.value
    const [a, b, c, d] = [...dragDelta.value, ...dragTracker.value]
    return [a+c, b + d]
  })


  onMouseUp(() => {
    if (dragStart.value) {
      dragTracker.value = dragTotal.value
    }

    dragStart.value = undefined
  })

  onMove(() => {
    if (!mousePosition.value) return
    if(!dragStart.value) dragStart.value = [...mousePosition.value]
    const [a, b, c, d] = [...mousePosition.value, ...dragStart.value]

    dragDelta.value = [a - c, b - d];
  })

  return {
    mousePosition,
    dragStart,
    dragDelta,
    dragTotal
  }
}