<template>
  <div class="scene-root" :panning="allKeysPressed ? allKeysPressed : undefined" :style="style">
    <svg>
      <g :transform="`translate(${dragTotal.join(',')})`">
  
        <GraphLink :link="link" v-for="link in store.uniqueLinks" :key="link.nodeIdA"  />
      </g>
    </svg>
    <div class="scene-body">
      <svg>
      </svg>
      <GraphElement :node="node" v-for="node in store.graphNodes" :key="node.id" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useElementStore } from '@/stores/Element.store';
import { useGraphStore } from '@/stores/Graph.store';
import { useGlobalKeyboardKeys } from '@/tools/input/keyboard.tools';
import { useGlobalMouseDrag } from '@/tools/input/mouse.tools';
import { useKeyHold } from '@/utils/KeyHold.utils';
import { KeyboardKeys } from '@/utils/keys';
import { usePan } from '@/utils/Pan.util';
import { renderConnections, useTerminals } from '@/utils/Terminal.util';
import { computed, ref, watch } from 'vue';
import ElementScaffold from '../elements/ElementScaffold.vue';
import LinkScaffold from '../elements/LinkScaffold.vue';
import GraphElement from '../graph/GraphElement.vue';
import GraphLink from '../graph/GraphLink.vue';
import RefElement from '../vue-elements/RefElement.vue';

const { allKeysPressed } = useGlobalKeyboardKeys([KeyboardKeys.Space])

const panTotal = ref<number[]>


const { dragTotal } = useGlobalMouseDrag(allKeysPressed)

const store = useGraphStore()

const style = computed(() => {
  if(!dragTotal.value) return {}
  return {
    '--pan-x': `${dragTotal.value[0]}px`,
    '--pan-y': `${dragTotal.value[1]}px`
  }
})



</script>

<style lang="sass">

$scene-background: #181818
$grid-color: lighten($scene-background, 10)


.scene-root
  width: 100%
  background-color: $scene-background
  background-image: repeating-linear-gradient($grid-color 0 1px, transparent 1px 100%), repeating-linear-gradient(90deg, $grid-color 0 1px, transparent 1px 100%)
  background-size: 25px 25px
  height: 100%
  margin: 0px
  overflow: hidden
  position: relative
  background-position-x: var(--pan-x)
  background-position-y: var(--pan-y)
  .scene-body
    // position: absolute
    left: var(--pan-x)
    top: var(--pan-y)
  svg
    width: 100vw
    height: 100vh
    position: fixed

  &[panning]
    cursor: all-scroll
    &>*
      pointer-events: none
      user-select: none
</style>