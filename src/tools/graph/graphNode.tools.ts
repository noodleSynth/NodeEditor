import type { GraphNode } from "@/models/graph/GraphNode.model"
import { useGraphStore } from "@/stores/Graph.store"
import { computed, type Ref } from "vue"
import { type NodeTypes, processFor, createTransformContext, type RootNode, type DirectiveNode } from '@vue/compiler-core'

export const useGraphRoot = () => {
  // const graphStore = useGraphStore()
  // const rootNode = computed(() => 
  //   graphStore.node("ROOT")
  // )

  // const transformContext = computed(() => createTransformContext((rootNode.value.templateNode as any) as RootNode, {}))

  // return {
  //   rootNode,
  //   transformContext
  // }
}

export const useGraphNode = (node: Ref<GraphNode>) => {
  // const TemplateNode = computed(() => node.value.templateNode ?  node.value.templateNode: undefined)
  // const {transformContext} = useGraphRoot()

  const ForLoop = computed(() => {
    const candidate = TemplateNode.value?.props.find(e => e.type === 7 && e.name==='for') 
    if (!candidate) return undefined

    // const ForProp = processFor(node.value.templateNode, candidate as DirectiveNode, transformContext.value)
    // console.log(ForProp)
    console.log(candidate)
    return {
      candidate
    }
  })


  return {
    ForLoop,
    // TemplateNode,
    node
  }
}