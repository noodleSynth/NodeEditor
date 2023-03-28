<template>
  <div class="terminal"
    ref="root"
    v-bind="{...attrs, id}"
    v-on="events"
    :class="{'input-terminal': terminal.direction === TerminalDirection.input, 'output-terminal': terminal?.direction === TerminalDirection.output}" :connected="true">
      <span class="terminal-icon" ></span>
      <span>{{ terminal.name }} </span>
    </div>
</template>

<script lang="ts" setup>

import { type ElementTerminal, TerminalDirection, defineTerminal } from '@/utils/Terminal.util';
import { computed, toRef } from 'vue';


const props = defineProps<{
  id: string
}>()

const { terminal, events, attrs } = defineTerminal(props.id)


</script>

<style lang="sass">

.terminal
  display: flex
  gap: 10px
  justify-content: flex-start
  align-items: center
  user-select: none
  cursor: pointer
  position: static
    
  span
    font-weight: 700
    padding-left: 5px
  .terminal-icon
    position: absolute
    right: calc(100% - 9px)
    background-color: black
    display: block
    width: 20px
    height: 20px
    z-index: 1
    &:empty
      border: solid white 5px
      border-radius: 100%

  &.output-terminal
    flex-direction: row-reverse
    margin-left: auto
    .terminal-icon
      right: unset
      left: calc(100% - 9px)
  &:hover
    .terminal-icon
      border-color: grey
      color: grey
  &[connected]
    .terminal-icon
      border-color: green
</style>