import { useGraphStore } from "@/stores/Graph.store";

const openingRegex = new RegExp(/<(?<tag>[\w\-_]+)\s*(?<attributes>.*?)\s*(?<isVoid>\/?)>/)
const closingTagRegex = new RegExp(/(<\/(?<tag>.+?)>\s?)/)

export interface ParserNode{
  tag?: string,
  attributes?: string,
  children: ParserNode[],
  content?: string
}

/**
 * Its JENK but it works
 */

export const tokenize = (src: string, parentNode: ParserNode) => {
  
  let tokens = src
  while (tokens.length) {
    const node : ParserNode= {
      children: []
    }

    const closestClosure = closingTagRegex.exec(tokens)
    const closestOpening = openingRegex.exec(tokens)
    
    if (!closestOpening)
      break

    const { tag, attributes, isVoid } = closestOpening.groups!
    
    Object.assign(node, { tag, attributes })
    
    if (isVoid) {
      tokens = tokens.substring(closestOpening.index + closestOpening[0].length)
      parentNode.children.push(node)
    } else if ((closestClosure && closestClosure?.index - closestOpening?.index < 0)) {

      tokens = tokens.substring(closestClosure[0].length + closestClosure.index)
      break
    } else {
      const seekBy = tokenize(tokens.substring(closestOpening[0].length + closestOpening.index), node)
      tokens = tokens.substring(closestOpening[0].length + closestOpening.index + seekBy)
      parentNode.children.push(node)
    }


  
  }
  return src.length - tokens.length
}

export const parseTemplate = (src: string) => {
  const graphStore = useGraphStore()
  graphStore.$reset()
  const parsedRoot = {
    tag: "template",
    children: []
  }
  // try {
  tokenize(src, parsedRoot)
    // console.log("TOTAL D", {q, src: src.length})
  // } catch (e){
  //   console.log(":)", e)
  // }
  // console.log(node)
  

  // const dom = parser.parseFromString(src, 'text/html')

  let q = 1

  const buildGraph = (el: ParserNode, parentNode?: GraphNode) => {
    const node = parentNode ? parentNode : graphStore.spawnNode("root")
    for (let i = 0; i < el.children.length; i++) {
      const doc = el.children[i]
      const docNode = graphStore.spawnNode(doc.tag!)
      docNode.position = [100 * q, 20 * graphStore.graphNodes.length - 1]
      // console.log(doc)
      graphStore.addLink({
        nodeIdA: node.id,
        nodeIdB: docNode.id
      })
      if (doc.children.length > 0) {
        q++;
        buildGraph(doc, docNode)
        q--;
      }
    }
    return node
  }


  // const rootNode = graphStore.spawnNode("root")
  // rootNode.position = [0, 50]
  // buildGraph(dom.body, rootNode)

  return buildGraph(parsedRoot)
}
