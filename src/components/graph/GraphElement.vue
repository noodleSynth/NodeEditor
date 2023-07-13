<template>
  <div
    class="graph-element"
    :style="styles"
    ref="root"
    :class="{ [GraphNodeType[node.type]]: true }"
    :id="node.id"
    @mouseleave="isInside = false"
  >
    <div class="node-header">
      <span class="node-name">
        {{ node.name }}
      </span>
      <span tabindex="1" class="click-drag-handle" @mouseenter="isInside = true"> </span>
      <span style="margin-top: -4px; aspect-ratio: 1/1" @click="showBody = !showBody">{{
        showBody ? "v" : "<"
      }}</span>
    </div>
    <div class="node-body" v-if="showBody">
      <ul>
        <li v-for="i in node.props" :key="i.name">
          <GraphProp v-bind="i" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { GraphLink } from "@/models/graph/GraphLink.model";
import type { GraphNode } from "@/models/graph/GraphNode.model";
import { GraphNodeType } from "@/models/graph/GraphNode.model";
import { useGraphStore } from "@/stores/Graph.store";
import { useGraphNode } from "@/tools/graph/graphNode.tools";
import { useGlobalMouseDrag } from "@/tools/input/mouse.tools";
import { TypeLookup } from "@/tools/parser/VueFileParser";
import type { DirectiveNode, SimpleExpressionNode } from "@vue/compiler-core";
import { computed, ref, watch, watchEffect } from "vue";
import GraphLinkVue from "./GraphLink.vue";
import GraphProp from "./GraphProp.vue";

const props = defineProps<{
  node: GraphNode;
}>();

const graphStore = useGraphStore();

const nodeRef = computed(() => graphStore.node(props.node.id));
// const node = useGraphNode(nodeRef)

const root = ref<HTMLElement>();
const showBody = ref(false);
const isInside = ref(false);

const { dragDelta, dragStart, dragTotal } = useGlobalMouseDrag(isInside);

const styles = computed(() => {
  let [x, y] = props.node.position;
  if (root.value) {
    const [width, height] = [root.value!.clientWidth, root.value!.clientHeight];
    // console.log({x, y})
    // x -= width / 2
    y -= height / 2;
    // console.log({x, y})
  }

  return {
    "--offset-x": `${
      x + dragDelta.value[0] * ((dragStart.value !== undefined) as any)
    }px`,
    "--offset-y": `${
      y + dragDelta.value[1] * ((dragStart.value !== undefined) as any)
    }px`,
  };
});

watch(dragStart, (n, o) => {
  if (n || !o) return (isInside.value = true);
  nodeRef.value.position[0] += dragDelta.value[0];
  nodeRef.value.position[1] += dragDelta.value[1];
});
</script>

<style lang="sass">

.graph-element
  position: absolute
  left: var(--offset-x)
  top: var(--offset-y)
  min-width: 200px
  background-color: black
  border-radius: 8px
  border: solid white 1px
  user-select: none

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

  .node-body
    margin: 4px 8px
    padding: 4px
    border: grey 1px dashed
    &:hover
      border-color: white

    ul
      list-style: none
      padding: 0px
      li
        font-size: .8em
  .node-header
    padding: 4px 8px
    display: flex
    justify-content: space-between
    align-items: center
    .click-drag-handle
      border-top: 1px solid grey
      border-bottom: 1px solid grey
      padding: 1px 0px
      margin: auto 4px
      width: 100%
      height: min-content
      cursor: grab
      &:hover
        border-color: white
      &:active
        cursor: grabbing
    .node-name
      font-weight: 700
      color: white


svg
  width: 100%
  height: 100%
</style>
