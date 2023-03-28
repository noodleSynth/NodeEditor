
import type { Vector2 } from "@/utils/ClickDrag.util";
import { type ElementTerminal, TerminalDirection } from "@/utils/Terminal.util";
import { defineStore } from "pinia";

export interface Element{
  uid: string,
  position: Vector2,
  terminals: {
    [handle: string]: ElementTerminal<any>
  }
}


interface ElementStore{
  _elements: {
    [handle: string] : Element
  },
  _terminals: {
    [terminalHandle: string]: ElementTerminal<any>
  }
}

export const useElementStore = defineStore("Element Store", {
  state: () : ElementStore => ({
    _elements: {},
    _terminals: {}
  }),
  getters: {
    elements: (state) => Object.values(state._elements),
    element: (state) => (handle: string) => {
      return state._elements[handle]
    },
    terminal: (state) => (handle: string) => {
      return state._terminals[handle]
    }
  },
  actions: {
    registerElement(handle: string) {
      console.log("Registering", handle)
      this._elements[handle] = {
        position: { x: 0, y: 0 },
        terminals: {},
        uid: handle
      }
      return this._elements[handle]
    },
    deregisterElement(handel: string) {
      delete this._elements[handel]
    },

    registerTerminal(name: string, direction= TerminalDirection.input) {
      console.log(`Registering terminal: ${name}`)

      const uid = 'T' + crypto.randomUUID().replaceAll('-', '')
      
      this._terminals[uid] = ({
        uid,
        direction,
        name,
        pipe: (e) => { },
        position: {x: 0, y: 0}
      })
      return this._terminals[uid]
    },

    deregisterTerminal(name: string) {
      delete this._terminals[name]
    },

    updateTerminalPosition(handle: string) {
      const tEl = document.querySelector(`#${handle} .terminal-icon`)
      // if (!tEl) return
      const {x, y} = tEl.getBoundingClientRect()
      
      this.terminal(handle).position = {x, y}
    }
  }
})