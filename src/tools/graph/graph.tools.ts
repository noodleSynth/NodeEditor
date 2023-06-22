import type { GraphNodeType, navigationTags, GraphNode, structuralTags } from './../../models/graph/GraphNode.model';
import { useGraphStore } from "@/stores/Graph.store";
import type { VueTemplateNode, VueScript } from "../parser/VueFileParser";
import { ref } from 'vue';
import type { Vector2 } from '@/utils/ClickDrag.util';

import type { ElementNode, RootNode, Node} from '@vue/compiler-core'
import type { GraphLink } from '@/models/graph/GraphLink.model';

export const useGraphManagement = () => {

}

export const consumeGraph = () => {

}
export enum ElementTypes {
  ELEMENT = 0,
  COMPONENT = 1,
  SLOT = 2,
  TEMPLATE = 3
}



export const useGraph = () => {

  const graphStore = useGraphStore()
  const root = ref<GraphNode>()

  const buildNodeGraph = async (rootTemplateNode: RootNode, script?: VueScript) => {
    graphStore.$reset()

    const getNodeImport = (node: VueTemplateNode) => {
      const tag = node.tag!
      if (!script) return undefined
      return script.imports.find((i) => {
        return i.import.map(t => t.toLowerCase()).includes(tag.replaceAll('-', '').toLowerCase())
      })
    }

    const traverseTemplateNode = (node: Node) => {

      let registeredNode: GraphNode;

      switch (node.type) {
        case 0:
        case 1:
          // @ts-ignore
          // eslint-disable-next-line no-case-declarations
          const elNode = ((node as any) as ElementNode)
          registeredNode = graphStore.registerNode(elNode)
          registeredNode.children = elNode.children ? elNode.children.map((n) => {
            const node = traverseTemplateNode(n)
            if(!node) return
            const link: GraphLink = { a: ref<GraphNode>(registeredNode), b: ref<GraphNode>(node) }
            graphStore.registerLink(link)
            registeredNode.links.push(link)
            node.links.push(link)
            return node
          }).filter(e => e) : undefined
          
          
          break
      }
      return registeredNode
    }
    root.value = traverseTemplateNode(rootTemplateNode)
  }

  const placeNodes = async (pos: number[]) => {
    if(!root.value) return
    root.value.position = pos

    let maxY = 0

    const placeChildren = (parent: GraphNode) => {
      if(!parent.children) return
      const el = document.getElementById(parent.id)
      if(!el) return console.error(`Could not find element #${parent.id}`)

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