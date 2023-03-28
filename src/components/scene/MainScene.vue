<template>
  <div class="scene-root" v-bind="attrs" v-on="{...events}" :style="styles">
    <div class="element-layer" :style="componentLayerStyles">
      <!-- {{ engaged }} -->
      <RefElement />
    </div>
    <!-- <div class="element-layer"  :style="componentLayerStyles"> -->
      <LinkScaffold v-if="floatingConnection" :connection="floatingConnection"/>
  
      <LinkScaffold v-for="i in Connections" :key="i.id" :connection="i" />
    <!-- </div> -->
  </div>
</template>

<script lang="ts" setup>
import { useElementStore } from '@/stores/Element.store';
import { useKeyHold } from '@/utils/KeyHold.utils';
import { KeyboardKeys } from '@/utils/keys';
import { usePan } from '@/utils/Pan.util';
import { renderConnections, useTerminals } from '@/utils/Terminal.util';
import { watch } from 'vue';
import ElementScaffold from '../elements/ElementScaffold.vue';
import LinkScaffold from '../elements/LinkScaffold.vue';
import RefElement from '../vue-elements/RefElement.vue';


const { events, attrs, styles, componentLayerStyles, pan } = usePan()
// const { engaged } = useKeyHold([KeyboardKeys.ArrowDown, KeyboardKeys.ArrowLeft])

const { floatingConnection, Connections } = renderConnections()

const elementStore = useElementStore()

watch(pan, () => {
  Connections.value.forEach((c) => {
    elementStore.updateTerminalPosition(c.start.uid)
    elementStore.updateTerminalPosition(c.end!.uid)
  })
})

// const { floatingConnection } = useTerminals()



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

  &[panning]
    cursor: all-scroll
    &>*
      pointer-events: none
  .element-layer
    position: absolute
</style>