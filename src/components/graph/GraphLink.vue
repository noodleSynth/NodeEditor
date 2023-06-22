<template>
    <path fill="transparent" :d="`M${linkStartPoint} L${linkEndPoint}`" stroke-width="5" stroke="green"></path>
    <circle r="3" fill="red" :cx="linkStartArray[0]" :cy="linkStartArray[1]" ></circle>
    <circle r="5" fill="yellow" :cx="linkEndArray[0]" :cy="linkEndArray[1]" ></circle>
</template>

<script lang="ts" setup>
import type { GraphLink } from '@/models/graph/GraphLink.model';
import type { GraphNode } from '@/models/graph/GraphNode.model';
import { useGraphStore } from '@/stores/Graph.store';
import { computed } from 'vue';


const props = defineProps<{
  link: GraphLink
}>()

const store = useGraphStore()

const startDimensions = computed(() => {
  const startElement = (props.link.a as any) as GraphNode

  const htmlEl = document.getElementById(startElement.id)
  const {width, height} = htmlEl!.getBoundingClientRect()
  return [width, height]
})

const linkStartPoint = computed(() => {
  const startElement = (props.link.a as any) as GraphNode
  const [x, y] = startElement.position

  const [width, height] = startDimensions.value
  return `${x+width} ${y}`
})

const linkStartArray = computed(() => {
  const startElement = (props.link.a as any) as GraphNode
  const [width, height] = startDimensions.value
  const [x, y] = startElement.position
  return [x + width, y]
})

const linkEndArray = computed(() => {
  const startElement = (props.link.b as any) as GraphNode
  return startElement.position
})

const linkEndPoint = computed(() => {
  const endElement = (props.link.b as any) as GraphNode
  const [x, y] = endElement.position
  return `${x} ${y}`
})

</script>