import type { GraphNode } from "@/models/graph/GraphNode.model"
import { useGraphStore } from "@/stores/Graph.store"




export const distributeElements = () => {

  const graphStore = useGraphStore()

  const distributeY = (graphNodes: GraphNode[]) => {
    const els : {
      [id: string]: DOMRect
    } = {}

    const elIds = graphNodes.sort((a, b) => a.position[1] - b.position[1]).map(e => e.id)

    elIds.forEach((n) => {
      const el = document.getElementById(n)?.getBoundingClientRect()
      if (!el) throw `Cant find el: ${n}`
      els[n] = el
    })

    elIds.forEach((current, i, arr) => {
      const aRect = els[current]!
      if(i + 1 >= arr.length) return
      const bRect = els[arr[i + 1]]

      const nodeA = graphStore.node(current)
      const nodeB = graphStore.node(arr[i + 1])

      /* 
    
     
       <^-----------------------^>
        | a        ^            |
        |        space          |
        |          |            |
        |--------median---------|
        |          |            |
        |        space          |
        |          v            |
       <v-----------------------v>
                   
                   
                   
       <^-----------------------^>
        | b        ^            |
        |        space          |
        |          |            |
        |--------median---------|
        |          |            |
        |        space          |
        |          v            |
       <v-----------------------v>
      */
        
      const aSpace = (aRect.height / 2)
      const aMedian = aRect.top + aSpace

      const bSpace = (bRect.height / 2)
      const bMedian = bRect.top + bSpace

      const medianDelta = aMedian - bMedian

      if (Math.abs(medianDelta) >= aSpace + bSpace) return

      if (medianDelta == 0) {
          nodeB.position[1] += aSpace + bSpace
        return
      }

      const adjust = (aSpace + bSpace) - Math.abs(medianDelta)
      console.table({
        adjust, medianDelta, aSpace, bSpace, separation: aSpace + bSpace
      })

      nodeB.position[1] += adjust
    })
  }

  return {
    distributeY
  }

}