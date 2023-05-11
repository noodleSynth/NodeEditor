import type { Ref } from "vue";
import type { GraphLink } from "./GraphLink.model";
import type { GraphNode } from "./GraphNode.model";

export interface Graph{
  nodes: {
    [id: string]: GraphNode
  },
  zoom: number,
  pan: number[] 
}