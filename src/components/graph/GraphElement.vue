<template>
  <div class="graph-element" :style="styles" ref="root" :class="{[GraphNodeType[node.type]]: true}" :id="node.id">
    <div class="node-body">
      <span class="node-name">
        {{ node.name }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { GraphLink } from '@/models/graph/GraphLink.model';
import type { GraphNode } from '@/models/graph/GraphNode.model';
import { GraphNodeType } from '@/models/graph/GraphNode.model'
import { useGraphStore } from '@/stores/Graph.store';
import { useGraphNode } from '@/tools/graph/graphNode.tools';
import { TypeLookup } from '@/tools/parser/VueFileParser';
import { computed, ref } from 'vue';
import GraphLinkVue from './GraphLink.vue';

const props = defineProps<{
  node: GraphNode
}>()

const nodeRef = computed(() => props.node)
// const node = useGraphNode(nodeRef)

const root = ref<HTMLElement>()

const styles = computed(() => {
  let [x, y] = props.node.position
  if (root.value) {
    const [ width, height ] = [root.value!.clientWidth, root.value!.clientHeight]
    // console.log({x, y})
    // x -= width / 2
    y -= height / 2
    // console.log({x, y})
  } 
  
  return {'--offset-x': `${x}px`, '--offset-y': `${y}px`}
})

</script>

<style lang="sass">

.graph-element
  position: absolute
  left: var(--offset-x)
  top: var(--offset-y)
  min-width: 200px
  background-color: black
  border-radius: 8px
  padding: 8px
  border: solid white 1px
  font-weight: 700
  &.Element
    background-color: #004400
  &.Component
    background-color: #002544
  &.Template
    background-color: #994444
  &.Slot
    background-color: #999944
  &.Root
    background-color: #994499

  .graph-body
    min-width: 100px


svg
  width: 100%
  height: 100%

</style>