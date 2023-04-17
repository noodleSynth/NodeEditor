export enum NodeType{
  HTMLNode,
  Component
}

export interface GraphNode{
  id: string,
  position: number[],
  name: string,
  type: NodeType
}