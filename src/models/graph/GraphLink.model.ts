import type { Ref } from "vue";
import type { GraphNode } from "./GraphNode.model";

export interface GraphLink{
  id: string,
  a: Ref<GraphNode>,
  b: Ref<GraphNode>,
}