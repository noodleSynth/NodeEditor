
<template>
  <main>
    <MainScene />
    <div>
      <input type="file" v-on="events" />
      <button @click="distribute">Distribute</button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import GraphElement from './components/graph/GraphElement.vue';
import MainScene from './components/scene/MainScene.vue';
import { useGraphStore } from './stores/Graph.store';
import { distributeElements } from './tools/graph/graphNode.tools';
import { useGlobalMouseDrag, useGlobalMousePrimary } from './tools/input/mouse.tools';
import { sourceFileUpload } from './utils/VueFileParser';

const { events } = sourceFileUpload()

const distribution = distributeElements()

const distribute = () => {
  const graphStore = useGraphStore()
  Object.entries(graphStore.links).forEach(([id, links], i, arr) => {
    // console.log({id, links})
    const nodes = links.map(l => graphStore.node(l.nodeIdB))
    distribution.distributeY([graphStore.node(id), ...nodes])
  })
  
}


// watch([dragDelta, dragStart], (things) => {
//   console.log(things)
// })

</script>

<style lang="sass">

body, #app, main
  margin: 0px 0px
  padding: 0px
  display: flex
  justify-content: stretch
  align-items: stretch
  min-width: 100%
  min-height: 100vh
  position: relative

</style>
