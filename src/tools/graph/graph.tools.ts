import { GraphNodeType, type GraphNode } from './../../models/graph/GraphNode.model';
import { useGraphStore } from "@/stores/Graph.store";
import type { VueTemplateNode, VueScript } from "../parser/VueFileParser";
import { ref } from 'vue';
import type { Vector2 } from '@/utils/ClickDrag.util';

export const useGraphManagement = () => {

}

export const consumeGraph = () => {

}

export const useGraph = () => {

  const graphStore = useGraphStore()
  const root = ref<GraphNode>()

  const buildNodeGraph = async (rootTemplateNode: VueTemplateNode, script?: VueScript) => {
    graphStore.$reset()
    const rootNode = root.value = graphStore.registerNode(rootTemplateNode)

    const getNodeImport = (node: VueTemplateNode) => {
      const tag = node.tag!
      if(!script) return undefined
      return script.imports.find((i) => {
        return i.import.includes(tag)
      })
    }

    const traverseTemplateNode = (node: VueTemplateNode, parent: GraphNode) => {
      if(!node.children) return
      node.children.forEach((n) => {
        const childNode = graphStore.registerNode(n)
        const nodeImportPath = getNodeImport(n)?.from
        if(nodeImportPath) childNode.type = GraphNodeType.Component

        if(!parent.children) parent.children = []
        parent.children.push(childNode)
        traverseTemplateNode(n, childNode)
      })
    }

    traverseTemplateNode(rootTemplateNode, rootNode)
  }

  const placeNodes = async (pos: number[]) => {
    if(!root.value) return
    root.value.position = pos

    let maxY = 0

    const placeChildren = (parent: GraphNode) => {
      if(!parent.children) return
      const el = document.getElementById(parent.id)
      if(!el) return

      const {width, height} = el.getBoundingClientRect()

      parent.children.forEach((child, i) => {
        child.position = [parent.position[0] + width + 50, Math.max(parent.position[1], maxY) + (i * (50 + height))]

        maxY = Math.max(parent.position[1], maxY)

        console.log(child.name, child.position, [width, height])
        placeChildren(child)
      })
    }

    placeChildren(root.value)
  }

  return {
    buildNodeGraph,
    placeNodes,
    root
  }
}