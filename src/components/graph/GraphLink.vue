<template>
    <path fill="transparent" :d="`M${linkStartPoint} L${linkEndPoint}`" stroke="green"></path>
    <circle r="2" fill="red" :cx="linkStartArray[0]" :cy="linkStartArray[1]" ></circle>
    <circle r="2" fill="yellow" :cx="linkEndArray[0]" :cy="linkEndArray[1]" ></circle>
</template>

<script lang="ts" setup>
import type { GraphLink } from '@/models/graph/GraphLink.model';
import { useGraphStore } from '@/stores/Graph.store';
import { computed } from 'vue';


const props = defineProps<{
  link: GraphLink
}>()

const store = useGraphStore()

const startDimensions = computed(() => {
  const startElement = store.node(props.link.nodeIdA)
  const htmlEl = document.getElementById(startElement.id)
  const {width, height} = htmlEl!.getBoundingClientRect()
  return [width, height]
})

const linkStartPoint = computed(() => {
  const startElement = store.node(props.link.nodeIdA)
  const [x, y] = startElement.position

  const [width, height] = startDimensions.value
  return `${x+width} ${y}`
})

const linkStartArray = computed(() => {
  const startElement = store.node(props.link.nodeIdA)
  const [width, height] = startDimensions.value
  const [x, y] = startElement.position
  return [x + width, y]
})

const linkEndArray = computed(() => {
  const startElement = store.node(props.link.nodeIdB)
  return startElement.position
})

const linkEndPoint = computed(() => {
  const endElement = store.node(props.link.nodeIdB)
  const [x, y] = endElement.position
  return `${x} ${y}`
})

</script>