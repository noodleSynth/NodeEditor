import { useElementStore, type Element } from "@/stores/Element.store";
import { computed, getCurrentInstance, onMounted, ref, toRef, watch, type ComputedRef, type Ref } from "vue";
import type { Vector2 } from "./ClickDrag.util";
import { useTranslate } from "./Tranlate.util";

export interface ElementTerminal<Accepts>{
  name: string,
  uid: string,
  connected?: string,
  direction: TerminalDirection,
  position: Vector2
  pipe: {
    (refrence: Ref<Accepts>) : void
  }
}

export enum TerminalDirection{
  input,
  output
}

export interface Connection{
  id: string,
  start: ElementTerminal<any>
  end?: ElementTerminal<any>
}

interface Connections{
  [id: string]: Connection
}


export const useTerminals = (element: Ref<Element>) => {

  const elementStore = useElementStore()

  const terminals = computed(() => Object.values(element.value.terminals))

  watch(() => element.value.position, (q) => {
    // console.log(terminals)
    terminals.value.forEach((e) => {
      elementStore.updateTerminalPosition(e.uid)
    })
  })

  return {
    addTerminal(name: string, direction: TerminalDirection) {  
      console.log(element.value)
      const terminal = elementStore.registerTerminal(name, direction)
      element.value.terminals[terminal.uid] = terminal
    },
    terminals
  }
}


const Connections = ref<Connection[]>([])

const terminalStop = ref<ElementTerminal<any>>()

const floatingConnection = ref<Connection>()

export const defineTerminal = (terminalId: string) => {

  const elementStore = useElementStore()

  const terminal = computed(() => elementStore.terminal(terminalId))

  const { attrs, events, floating, translate, drag } = useTranslate()
  

  drag.onStart((delta) => {
    elementStore.updateTerminalPosition(terminal.value.uid)
    floatingConnection.value = {
      id: "Floating",
      start: terminal.value
    }
  })

  drag.onDrag((delta) => {
    const { w, h } = (({x, y}) => ({w: x, h: y}) )(delta)
    const { x, y } = floatingConnection.value!.start.position
    // @ts-ignore
    floatingConnection.value!.end = {position: {x: x + w, y: y + h}} as Connection
  })

  drag.onDrop((delta) => {
    if (!terminalStop.value || !floatingConnection.value) return
    Connections.value.push({
      ...floatingConnection.value,
      id: crypto.randomUUID(),
      end: terminalStop.value
    })
    floatingConnection.value = undefined
    terminalStop.value = undefined
  })


  const mouseenter = (e : MouseEvent) => {
    if (!floatingConnection.value) return e.stopPropagation()
    elementStore.updateTerminalPosition(terminal.value.uid)
    terminalStop.value = terminal.value
  }

  return {
    terminal,
    Connections,
    events: {
      ...events,
      mouseenter
    },
    attrs
  }
}

export const renderConnections = () => {
  return {
    Connections,
    floatingConnection
  }
}