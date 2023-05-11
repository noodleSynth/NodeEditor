export enum GraphNodeType{
  HTMLNode,
  Component
}

export interface GraphNode{
  id: string,
  position: number[],
  name: string,
  type: GraphNodeType,
  children?: GraphNode[]
}