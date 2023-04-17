import type { Ref } from "vue";
import type { GraphLink } from "./GraphLink.model";
import type { GraphNode } from "./GraphNode.model";

export interface Graph{
  nodes: {
    [id: string]: GraphNode
  },
  links: {
    [id: string] : GraphLink[]
  }
  zoom: number,
  pan: number[] 
}