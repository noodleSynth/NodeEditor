
<template>
  <main>
    <MainScene />
    <input type="file" v-on="events" />
  </main>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import GraphElement from './components/graph/GraphElement.vue';
import MainScene from './components/scene/MainScene.vue';
import { useGlobalMouseDrag, useGlobalMousePrimary } from './tools/input/mouse.tools';
import { sourceFileUpload } from './utils/VueFileParser';

const { events } = sourceFileUpload()

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
