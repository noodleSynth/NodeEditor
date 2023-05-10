
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

    const htmlTagRegex = new RegExp(/^<(?<tag>[a-zA-Z]+)\s?(?<attributes>[^\n]*?)>{1}\s*(?<content>[\w\W]*)\s*<\/\k<tag>>$/gm)
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

  return {
    parseVueSource
  }
}