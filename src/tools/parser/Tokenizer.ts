
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