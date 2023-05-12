export enum GraphNodeType{
  HTMLNode,
  Component,
  Structural,
  Navigation
}

export const structuralTags = ['template', 'slot']
export const navigationTags = ['routerlink', 'routerview']

export interface GraphNode{
  id: string,
  position: number[],
  name: string,
  type: GraphNodeType,
  children?: GraphNode[]
}