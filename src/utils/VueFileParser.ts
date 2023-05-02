import { tokenize, type ParserNode } from './../tools/parser/Tokenizer';
import type { GraphNode } from "@/models/graph/GraphNode.model"
import { useElementStore } from "@/stores/Element.store"
import { useGraphStore } from "@/stores/Graph.store"
import { ref } from "vue"
import { useSceneElement } from "./Element.util"

const htmlTagRegex = new RegExp(/^<(?<tag>[a-zA-Z]+)\s?(?<attributes>[^\n]*?)>{1}\s*(?<content>[\w\W]*)\s*<\/\k<tag>>$/gm)
const jsImportRegex = new RegExp(/^import\s(type\s)?({\s)?(?<import>[\w\W]*?)(\s})?\sfrom\s[\'\"](?<from>.*)[\'\"];$/gm)


const parseTemplate = (src: string) => {
  const graphStore = useGraphStore()

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


interface VueSection{
  attributes: string,
  content: string,
  tag?: string
}

interface HTMLTree extends Partial<VueSection>{
  children: {
    [tag: string]: HTMLTree[]
  }
}

interface VueFile{
  template?: VueSection,
  script?: VueSection,
  style?: VueSection
}

export const sourceFileUpload = () => {

  const sections = ref<VueFile>({})
  const htmlTree = ref<HTMLTree>({})
  const graphStore = useGraphStore()

  const uploadFile = (e: Event) => {
    graphStore.$reset()
    const fe = e.target as HTMLInputElement

    const fileReader = new FileReader()
    
    fileReader.onloadend = ((ev) => {
      let result = (ev.target!.result)!.toString()
      result = (window.atob(result.split(",")[1]));
      let q = undefined
      while ((q = htmlTagRegex.exec(result))) {
        const { tag, attributes, content } = q.groups as { tag: keyof VueFile, attributes: string, content: string }
        sections.value[tag] = {
          attributes,
          content
        }
      }
      console.log(sections.value.template!.content)
      // console.log(sections.value.template!.content.trim().split(/<(?<tag>\w*).*>[\w\W]*?<\/\k<tag>>/g))
      // htmlTree.value = getChildren(sections.value.template!.content)
      parseTemplate(sections.value.template!.content)
      q = undefined
      const thing = []
      console.log(sections.value.script!.content)
      while ((q = jsImportRegex.exec(sections.value.script!.content))) {
        thing.push(q.groups)
      }
      console.table(thing)
      // console.log(sections.value)
      // console.log(htmlTree.value)
    })


    fileReader.readAsDataURL(fe.files![0])
  }

  return {
    events: {
      input: uploadFile
    }
  }
}