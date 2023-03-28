import { computed, onBeforeUnmount, onMounted, ref } from "vue"

export const useScroll = (min=1, max=100, step=1) => {

  const _scrollValue = ref(min)

  const handleScrollEvent = (e  :WheelEvent) => {
    _scrollValue.value -= step * e.deltaY
    _scrollValue.value = Math.min(max, _scrollValue.value)
    _scrollValue.value = Math.max(min, _scrollValue.value)
  }

  onMounted(() => {
    window.addEventListener('wheel', handleScrollEvent)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('wheel', handleScrollEvent)
  })

  const scrollValue = computed(() => {
    const baseValue = _scrollValue.value
    return ((baseValue - min) / (max - min))
  })

  return {
    scrollValue
  }
}