/* eslint-disable no-useless-escape */

const htmlTagRegex = new RegExp(/^<(?<tag>[a-zA-Z]+)\s?(?<attributes>[^\n]*?)>{1}\s*(?<content>[\w\W]*)\s*<\/\k<tag>>$/gm)
const openingRegex = new RegExp(/<(?<tag>[\w\-_]+)\s*(?<attributes>.*?)\s*(?<isVoid>\/?)>/)
const closingTagRegex = new RegExp(/(<\/(?<tag>.+?)>\s?)/)
const jsImportRegex = new RegExp(/^import\s(type\s)?({\s)?(?<importEls>[\w\W]*?)(\s})?\sfrom\s[\'\"](?<from>.*)[\'\"];$/gm)

export interface VueTemplateNode{
  tag?: string,
  attributes?: string,
  children: VueTemplateNode[],
  content?: string
}

export interface VueScript {
  imports: {
    import: string[],
    from: string
  }[]
}

/**
 * Its JENK but it works
 */

const buildTemplateTree = (src: string, parentNode: VueTemplateNode) => {
  
  let tokens = src
  while (tokens.length) {
    const node : VueTemplateNode= {
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
      const seekBy = buildTemplateTree(tokens.substring(closestOpening[0].length + closestOpening.index), node)
      tokens = tokens.substring(closestOpening[0].length + closestOpening.index + seekBy)
      parentNode.children.push(node)
    }  
  }
  return src.length - tokens.length
}

interface VueSection{
  rawContent: string,
  attributes: string
}

interface VueTemplateSection extends VueSection{

}

interface VueScriptSection extends VueSection{

}

interface VueStyleSection extends VueSection{

}

interface VueFile {
  template: VueTemplateSection,
  script?: VueScriptSection,
  style?: VueStyleSection
}

export const useVueFileParser = () => {

  const parseVueSource = (source: string) => {

    const vueFile = {} as VueFile

    let q = undefined
    while ((q = htmlTagRegex.exec(source))) {
      const { tag, attributes, content } = q.groups as { tag: keyof VueFile, attributes: string, content: string }
      vueFile[tag] = {
        attributes,
        rawContent: content
      }
    }

    return vueFile
  }

  const parseVueTemplate = async (src : string) => {
    const parsedRoot = {
      tag: "Vue Root",
      children: []
    }
    buildTemplateTree(src, parsedRoot)
    return parsedRoot
  }

  
  const parseVueScript = async (src: string) : Promise<VueScript> => {
    let q = undefined
    const imports = []
    while ((q = jsImportRegex.exec(src))) {
      const {importEls, from} = q.groups as {importEls: string, from: string}
      imports.push({import: importEls.split(', '), from})
    }

    return {
      imports
    }
  }

  return {
    parseVueSource,
    parseVueTemplate,
    parseVueScript
  }
}
