<template>
    <path fill="transparent" :d="`M${linkStartPoint} L${linkFirstBendPoint} ${linkSecondBendPoint} ${linkEndPoint}`" stroke="green"></path>
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

const linkStartPoint = computed(() => {
  const startElement = store.node(props.link.nodeIdA)
  const [x, y] = startElement.position
  return `${x} ${y}`
})

const linkStartArray = computed(() => {
  const startElement = store.node(props.link.nodeIdA)
  return startElement.position
})

const linkEndArray = computed(() => {
  const startElement = store.node(props.link.nodeIdB)
  return startElement.position
})


const linkFirstBendPoint = computed(() => {
  const startElement = store.node(props.link.nodeIdA)
  const endElement = store.node(props.link.nodeIdB)
  const [x, y, a, b] = [...startElement.position, ...endElement.position]
  const dx = (a - x) * .5
  // const dy = (b - y) * .25
  return `${x + dx} ${y}`
})

const linkSecondBendPoint = computed(() => {
  const startElement = store.node(props.link.nodeIdA)
  const endElement = store.node(props.link.nodeIdB)
  const [x, y, a, b] = [...startElement.position, ...endElement.position]
  const dx = (a - x) * .5
  const dy = (b - y) * .5
  return `${x + dx} ${b}`
})



const linkEndPoint = computed(() => {
  const endElement = store.node(props.link.nodeIdB)
  const [x, y] = endElement.position
  return `${x} ${y}`
})

</script>