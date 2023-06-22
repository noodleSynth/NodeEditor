import type { VueTemplateNode } from './../tools/parser/VueFileParser';

import type { Graph } from "@/models/graph/Graph.model";
import type { GraphLink } from "@/models/graph/GraphLink.model";
import type { GraphNode } from "@/models/graph/GraphNode.model";
import { GraphNodeType } from "@/models/graph/GraphNode.model";
import { defineStore } from "pinia";
import { ref } from "vue";
import type { Node, ElementNode, RootNode, NodeTypes } from '@vue/compiler-core'



export const useGraphStore = defineStore("Graph store", {
  state: (): Graph =>  ({
    nodes: {},
    links: {},
    zoom: 1,
    pan: [0, 0]
  }),

  getters: {
    graphNodes: (state) => Object.values(state.nodes),
    node: (state) => (id: string) => state.nodes[id],
  },
  
  actions: {
    registerLink(link: GraphLink) {
      if (!link.id)
        link.id = crypto.randomUUID()
      this.links[link.id] = link;
    },


    registerNode(templateNode: ElementNode | RootNode) {
      const node = {
        id: crypto.randomUUID().replaceAll('-', ''),
        position: [0, 0],
        links: [],
        children: [],
        name: "node",
        type: Object.hasOwn(templateNode, 'tagType') ? (templateNode as ElementNode).tagType : GraphNodeType.Root
      } as GraphNode
      if(templateNode.type == 0)
        node.name = "Root"
      else
        switch (templateNode.tagType) {
          case 1:
          case 0:
            node.name = templateNode.tag
            break
          case 3:
          case 2:
            node.name = "Slot"
            break
        }

      this.nodes[node.id] = node

      return node
    }
  }
})