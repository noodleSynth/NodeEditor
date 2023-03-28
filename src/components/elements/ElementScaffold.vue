<template>
  <div class="scene-element" v-bind="attrs" :style="style" >
    
    <div class="element-body">
      <div v-if="name" class="element-name">
        {{name}}
      </div>
      <slot></slot>
    </div>
    <div class="element-handles">
      <div class="move-handle" v-on="events"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Vector2 } from '@/utils/ClickDrag.util';
import { consumeElement, useSceneElement } from '@/utils/Element.util';

import { TerminalDirection, useTerminals } from '@/utils/Terminal.util';
import ElementSection from './ElementSection.vue';
import TerminalScaffold from './TerminalScaffold.vue';

const props = defineProps<{
  uid: string,
  name?: string
}>()

const { attrs, events, style, element } = consumeElement(props.uid)


defineExpose({
  element
})

</script>

<style lang="sass">
.scene-element
  position: absolute
  &[floating]
    z-index: 999
  
  display: flex
  flex-direction: row
  justify-content: stretch
  align-items: stretch
  width: min-content
  padding: 20px
  padding-right: 0px
  padding-bottom: 10px
  z-index: 1
  .element-handles
    opacity: 0
    // position: absolute
    // left: 100%
    padding: 10px
    padding-top: 0px
    margin-top: -10px
    .move-handle
      width: 20px
      height: 20px
      background: white
      border-radius: 100%
      cursor: grab
  &:hover, &:has(*:hover), &[floating]
    box-shadow: 0px 0px 0px 1px blue
    .element-handles
      opacity: 1
  &[floating]
    .move-handle
      cursor: grabbing
  .element-body
    background: #373b4e
    min-width: 200px
    min-height: 100px
    border-radius: 8px
    color: white
    padding: 15px
    padding-top: 20px
    border: solid 1px white
    display: flex
    flex-direction: column
    gap: 20px
    .element-name
      font-weight: 700
      font-size: 12px
      white-space: nowrap
      position: absolute
      left: 4px
      bottom: 100%
      user-select: none
  .element-terminals
    position: static
    padding-right: 10px
    white-space: nowrap
    display: flex
    justify-content: center
    align-items: flex-start
    flex-direction: column
    gap: 10px
    
</style>