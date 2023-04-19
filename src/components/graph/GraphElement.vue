<template>
  <div class="graph-element" :style="styles" ref="root">
    <div class="node-body">
      {{ node.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { GraphLink } from '@/models/graph/GraphLink.model';
import type { GraphNode } from '@/models/graph/GraphNode.model';
import { useGraphStore } from '@/stores/Graph.store';
import { computed, ref } from 'vue';
import GraphLinkVue from './GraphLink.vue';

const props = defineProps<{
  node: GraphNode
}>()

const root = ref<HTMLElement>()

const styles = computed(() => {
  let [x, y] = props.node.position
  if (root.value) {
    const [ width, height ] = [root.value!.clientWidth, root.value!.clientHeight]
    console.log({x, y})
    x -= width / 2
    y -= height / 2
    console.log({x, y})
  } 
  
  return {'--offset-x': `${x}px`, '--offset-y': `${y}px`}
})

</script>

<style lang="sass">

.graph-element
  position: absolute
  left: var(--offset-x)
  top: var(--offset-y)
svg
  width: 100%
  height: 100%

</style>