<template>
  <div class="element-section">
    <div class="section-label" v-if="label">{{ label }}</div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label?: string
}>()
</script>

<style lang="sass">
.element-section
  border: solid 1px grey
  border-radius: 8px
  padding: 0px 0px 20px 4px
  .section-label
    user-select: none
    font-weight: 700
    background-color: #373b4e
    padding: 0px 8px
    font-size: 14px
    top: -12px
    left: 8px
    margin-bottom: -20px
    width: min-content
  
</style>