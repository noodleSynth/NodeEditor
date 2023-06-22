export enum GraphNodeType{
  Element,
  Component,
  Template,
  Slot,
  Root
}
import type {NodeTypes} from '@vue/compiler-core'
export const structuralTags = ['template', 'slot']
export const navigationTags = ['routerlink', 'routerview']
import type {Node, BaseElementNode, TemplateNode} from '@vue/compiler-core'
import type { GraphLink } from './GraphLink.model'
export interface GraphNode{
  id: string,
  position: number[],
  children?: GraphNode[],
  links: GraphLink[]
  type: GraphNodeType
  name: string,
}