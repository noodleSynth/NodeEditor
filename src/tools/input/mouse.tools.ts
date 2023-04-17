import { onMounted, onUnmounted, type Ref, ref, watch } from "vue"


export const useGlobalMouseMove = (enabled?: Ref<boolean>) => {

  const mousePosition = ref<number[]>()

  const handleMouseMove = (e: Event) => {
    const event = e as MouseEvent
    if(enabled && !enabled.value) return mousePosition.value = undefined
    mousePosition.value = [
      event.clientX,
      event.clientY
    ]
  }

  onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
  })


  return {
    mousePosition
  }
}

export const useGlobalMousePrimary = (enabled?: Ref<boolean>) => {

  const primaryButtonDown = ref<boolean>(false)

  const handleMouseDown = (e: Event) => {
    if (enabled && !enabled.value) return
    console.log("Tgubg")
    const event = e as MouseEvent 
    if(event.button === 0) primaryButtonDown.value = true
  }

  const handleMouseUp = (e: Event) => {
    primaryButtonDown.value = false
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
    primaryButtonDown
  }
}

export const useGlobalMouseDrag = (enabled?: Ref<boolean>) => {

  const { primaryButtonDown } = useGlobalMousePrimary(enabled)

  const { mousePosition } = useGlobalMouseMove(primaryButtonDown)

  const dragStart = ref<number[]>()
  const dragDelta = ref<number[]>()

  watch(primaryButtonDown, (btnDown) => {
    if (btnDown && mousePosition.value) {
      dragDelta.value = [0, 0]
      dragStart.value = [...mousePosition.value]
      return
    }
    dragStart.value = undefined
    dragDelta.value = undefined
  })

  watch(mousePosition, (newPosition) => {
    if (!newPosition || !dragStart.value) return
    const [a, b, c, d] = [...newPosition, ...dragStart.value]

    dragDelta.value = [a - c, b - d];
  }, {
    deep: true
  })


  return {
    mousePosition,
    dragStart,
    dragDelta
  }
}