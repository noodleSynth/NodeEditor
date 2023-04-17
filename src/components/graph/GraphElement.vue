<template>
  <div class="graph-element">
    <div v-for="node in store.graphNodes" :key="node.id" :style="{'--offset-x': `${node.position[0]}px`, '--offset-y': `${node.position[1]}px`}" class="graph-node">
      {{ node.name }}
    </div>
    <svg v-for="link in store.uniqueLinks" :key="link.nodeIdA" stroke="red" >
      <path :d='pathString(link)' />
    </svg> 
  </div>
</template>

<script lang="ts" setup>
import type { GraphLink } from '@/models/graph/GraphLink.model';
import { useGraphStore } from '@/stores/Graph.store';
import { ref } from 'vue';

const store = useGraphStore()

const pathString = (link: GraphLink) => {
  const [a, b, c, d] = [...store.node(link.nodeIdA).position, ...store.node(link.nodeIdB).position]

  return `M${a} ${b} L ${c} ${d}`
}


</script>

<style lang="sass">
.graph-element
  position: relative
  width: 100%
  height: 100%
  .graph-node, svg
    position: absolute
    left: var(--offset-x)
    top: var(--offset-y)
  svg
    width: 100%
    height: 100%

</style>