<template>
  <div class="archive-explorer">
    <input type="file" @input="handleInput" accept="application/zip" />
    <div class="archive-file-list">
      <ArchiveExpander @selectSource="handleFileSelect" :label="(b as string)" :node="a" class="archive-file-list-item" v-for="(a, b) in entryTree" :key="b" >
      </ArchiveExpander>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRepoArchive } from '@/tools/explorer/ZipExplorer';
import { parseTemplate } from '@/tools/parser/Tokenizer';
import { useVueFileParser } from '@/tools/parser/VueFileParser';
import { TextWriter, type Entry } from '@zip.js/zip.js';
import ArchiveExpander from './ArchiveExpander.vue';

const handleInput = (e: Event) => {
  const target = (e.target) as HTMLInputElement
  loadArchiveFile(target.files![0])
}


const handleFileSelect = (e: Entry) => {
  const textWriter = new TextWriter();
  e.getData!(textWriter).then(data => {

    const file = (parseVueSource(data))
    parseTemplate(file.template.rawContent)
  })
}



const {parseVueSource} = useVueFileParser()
const {fileEntries, loadArchiveFile, entryTree} = useRepoArchive()


</script>

<style lang="sass">
.archive-explorer
  overflow: hidden
  height: 80vh
  width: 20em
  .archive-file-list
    overflow-y: auto
    height: 100%
</style>