<template>
  <svg class="link" xmlns="http://www.w3.org/2000/svg" v-bind="{style, viewbox}" v-if="props.connection.start && props.connection.end">
    <path :d="path" stroke-width="5" stroke="#AF3B22"/>
  </svg>
</template>

<script lang="ts" setup>
import type { Connection } from '@/utils/Terminal.util';
import { computed, onMounted } from 'vue';
import {useElementStore} from '@/stores/Element.store'

const props = defineProps<{
  connection: Connection
}>()

const offset = 20
const path = computed(() => {
  const { x, y } = props.connection.start.position
  const { w, h } = ((a) => ({ w: a.x - x, h: a.y - y }))(props.connection.end!.position)
  return `M ${w >= 0 ? offset : Math.abs(w) + (offset / 2) + 10} ${h > 0? offset : Math.abs(h) + offset} ${w > 0 ? w + offset : offset} ${h > 0 ? h + offset : offset}`
})

const style = computed(() => {

  const { x, y } = props.connection.start.position
  const { w, h } = ((a) => ({ w: a.x - x, h: a.y - y }))(props.connection.end!.position)


  return {
  left: `${w > 0? x - (offset / 2) : x - (offset / 2) + w}px`,
  top: `${h > 0? y - (offset / 2) : y - (offset / 2) + h}px`,
  width: `${Math.abs(w) + (offset * 2)}px`,
  height: `${Math.abs(h) + (offset * 2)}px`
  }
})

const viewbox = computed(() => `0 0 ${Math.abs(props.connection.end?.position.x)} ${Math.abs(props.connection.end?.position.y)}`)

const elementStore = useElementStore()

onMounted(() => {
  elementStore.updateTerminalPosition(props.connection.start.uid)
})

</script>

<style lang="sass">
.link
  position: absolute
  z-index: 999
  // border: solid green 1px
  min-height: 20px
  min-width: 20px
  overflow: visible
  pointer-events: none

</style>