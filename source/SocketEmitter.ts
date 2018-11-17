import { SocketEvent } from './consts'

interface SocketListeners {
  [key: string]: (() => void)[]
}

interface SocketEventListener {
  (): void
}

export default class SocketEmitter {
  listeners: SocketListeners = {}

  on(event: SocketEvent, listener: SocketEventListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }

    this.listeners[event].push(listener)
  }

  emit(event: SocketEvent) {
    this.listeners[event].forEach(listener => listener())
  }
}
