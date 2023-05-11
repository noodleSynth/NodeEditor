import type { VueTemplateNode } from './../tools/parser/VueFileParser';

import type { Graph } from "@/models/graph/Graph.model";
import type { GraphLink } from "@/models/graph/GraphLink.model";
import { GraphNodeType, type GraphNode } from "@/models/graph/GraphNode.model";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useGraphStore = defineStore("Graph store", {
  state: (): Graph =>  ({
    nodes: {},
    zoom: 1,
    pan: [0, 0]
  }),

  getters: {
    graphNodes: (state) => Object.values(state.nodes),
    node: (state) => (id: string) => state.nodes[id],
  },
  
  actions: {
    registerNode(templateNode: VueTemplateNode){
      const node = {
        id: crypto.randomUUID(),
        name: templateNode.tag!,
        type: GraphNodeType.HTMLNode,
        position: [0, 0]
      } as GraphNode

      this.nodes[node.id] = node

      return node
    }
  }
})