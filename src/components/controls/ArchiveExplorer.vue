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
import { useGraph } from '@/tools/graph/graph.tools';
import { useVueFileParser } from '@/tools/parser/VueFileParser';
import { TextWriter, type Entry } from '@zip.js/zip.js';
import ArchiveExpander from './ArchiveExpander.vue';

const handleInput = (e: Event) => {
  const target = (e.target) as HTMLInputElement
  loadArchiveFile(target.files![0]).then(() => { 
    const entry = appEntry()
    if(!entry) return alert("Could not find app entry")
    handleFileSelect(entry)
  })
}


const handleFileSelect = (e: Entry) => {
  const textWriter = new TextWriter();
  e.getData!(textWriter).then( async (data) => {

    const file = (parseVueSource(data))

    const template = (await parseVueTemplate(file.template.rawContent))
    const script = await (file.script ? parseVueScript(file.script.rawContent) : undefined)
    buildNodeGraph(template, script).then(() => {
      placeNodes([100, 100])
    })
  })
}



const {parseVueSource, parseVueTemplate, parseVueScript} = useVueFileParser()
const {fileEntries, loadArchiveFile, entryTree, appEntry} = useRepoArchive()
const { buildNodeGraph, placeNodes, root } = useGraph()

</script>

<style lang="sass">
.archive-explorer
  overflow: hidden
  overflow-y: auto
  height: 80vh
  width: 20em
  .archive-file-list
    overflow-y: auto
    height: auto
</style>