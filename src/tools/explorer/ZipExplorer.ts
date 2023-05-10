import { computed, ref } from 'vue';
import {BlobReader, ZipReader, type Entry} from '@zip.js/zip.js'


export interface ArchiveTreeNode{
  __is_tree_node?: any,
  [folderName: string]: Entry | ArchiveTreeNode
}

export const useRepoArchive = () => {
  
  const fileEntries = ref<{
    [path: string] : Entry
  }>({})
  
  const isLoading = ref(true)
  
  const loadArchiveFile = (file: Blob) => {
    const fileReader = new BlobReader(file)
  
    const zipReader = new ZipReader(fileReader)

    zipReader.getEntries().then(entries => {
      entries.forEach((entry) => {
        if(entry.filename.includes('/node_modules/') || entry.filename.includes('/.git/') || entry.filename.includes('/.') || entry.filename.startsWith('__') || entry.directory)
          return

          fileEntries.value[entry.filename] = entry
      })
      isLoading.value = false
    })
  }



  const entryTree = computed(() => {
    const ret : ArchiveTreeNode = {}

    Object.entries(fileEntries.value).forEach(([path, entry]) => {
      const parts = path.split('/')
      let node = ret
      while(parts.length > 0){
        const current = parts.shift()!
        if(parts.length === 0) {
          node[current] = entry
          break
        }
        if(!node[current]) node[current] = {
          __is_tree_node: undefined
        } as ArchiveTreeNode

        if(Object.hasOwn(node[current], '__is_tree_node')){
          node = node[current] as ArchiveTreeNode
          continue
        }
      }

    })
    return ret
  })

  
  return {
    fileEntries,
    entryTree,
    loadArchiveFile
  }
}