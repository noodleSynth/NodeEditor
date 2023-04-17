import type { Graph } from "@/models/graph/Graph.model";
import type { GraphLink } from "@/models/graph/GraphLink.model";
import { defineStore } from "pinia";
import { ref } from "vue";

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
    uniqueLinks: (state) => {
        const items: {
          [idCombo: string]: GraphLink
        }= {}
  
        Object.values(state.links).flatMap(e => e.flatMap(q => q)).forEach((link) => {
          const combo = Object.values(link).join(':')
          if(items[combo]) return
          items[combo] = link
        })
        return (Object.values(items))
    }
  },
  
  actions: {
    spawnNode(name: string) {

      const id = crypto.randomUUID()

      this.nodes[id] = {
        id,
        position: [0, 0],
        name
      }

      return this.nodes[id]
    },
    addLink(link: GraphLink) {
      if (!this.links[link.nodeIdA]) this.links[link.nodeIdA] = []
      if (!this.links[link.nodeIdB]) this.links[link.nodeIdB] = []
      this.links[link.nodeIdA].push(link)
      this.links[link.nodeIdB].push(link)
    }
  }
})