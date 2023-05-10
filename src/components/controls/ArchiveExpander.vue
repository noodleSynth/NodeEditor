<template>
  <div class="archive-expander" :class="{open}">
    <div class="archive-expander-title" @click="open = !open">
      {{ label }}
    </div>
    <div class="archive-expander-children" v-show="open">
      <template v-for="(a, b) in (node as ArchiveTreeNode)" :key="b">
        <template v-if="b !== '__is_tree_node'">
          <ArchiveExpander v-if="isTree(a)" :label="(b as string)" :node="a" @selectSource="e => $emit('selectSource', e)" />
          <div class="archive-file" v-else @click="$emit('selectSource', a)">
            {{ b }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ArchiveTreeNode } from '@/tools/explorer/ZipExplorer';
import type { Entry } from '@zip.js/zip.js';
import { computed, ref } from 'vue';


const props = defineProps<{
  label: string,
  node: ArchiveTreeNode | Entry
}>()

const isTree = (q: any) => {
  return Object.hasOwn(q, '__is_tree_node')
}


const open = ref(false)

</script>

<style lang="sass">
.archive-expander
  user-select: none
  .archive-expander-title
    padding: 0em .5em
    background-color: grey
    &::before
      content: '▶'
      margin-right: .2em
  &.open>.archive-expander-title::before
      content: '▼'
  .archive-expander-title, .archive-expander-children
    white-space: nowrap
  .archive-expander-children
    border-left: solid 3px white
    .archive-file
      display: flex
      align-items: center
      &::before
        content: '→'
        line-height: 30px
        height: 30px
        font-weight: 700
        margin-right: 5px
</style>