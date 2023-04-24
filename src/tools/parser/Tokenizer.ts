import { parse } from "@vue/compiler-dom"

const tagRegex = new RegExp(/<(?<tag>[\w\-_]+)\s*(?<attributes>.*?)\s*(?<isVoid>\/?)>/)
const closingTag = (tag: string) => new RegExp(`(<\/${tag}>)`)

interface ParserNode{
  tag?: string,
  attributes?: string,
  children: ParserNode[],
  content?: string
}

export const tokenize = (tokens: string, parentNode: ParserNode) => {
  console.log(tokens)
  while(tokens.trim().length){
    const node = {
      children: []
    }
    const tagData = tagRegex.exec(tokens)
    if(!tagData) return console.log("No Tag data", tokens)
    
    tokens = tokens.substring(tagData.index + tagData[0].length)

    const {tag, attributes, isVoid} = tagData.groups
    node.attributes = attributes
    node.tag = tag
  
    parentNode.children.push(node)
    
    if(!isVoid){
      tokenize(tokens, node)
    }
  }
}