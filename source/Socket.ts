import WebSocket from 'ws'
import SocketEmitter from './SocketEmitter'
import { WEBSOCKET_URL, SocketEvent } from './consts'
import Authenticator from './Authenticator'
import Chat from './Chat'

interface SocketOptions {
  secure: Boolean
  authenticate: Boolean
}

const defaultOptions: SocketOptions = {
  secure: true,
  authenticate: true,
}

export default class Socket extends SocketEmitter {
  private client: WebSocket
  private authenticator: Authenticator
  private options: SocketOptions

  static isPingMessage(data: string) {
    return data === Socket.PingMsg
  }

  static PingMsg = 'PING :tmi.twitch.tv'
  static PongMsg = 'PONG :tmi.twitch.tv'

  constructor(
    authenticator: Authenticator,
    options: SocketOptions = defaultOptions,
  ) {
    super()
    this.authenticator = authenticator
    this.options = options
  }

  async init() {
    return new Promise(resolve => {
      const port: Number = this.options.secure ? 443 : 80
      this.client = new WebSocket(`${WEBSOCKET_URL}:${port}`)
      this.client.once('open', () => {
        this.addClientListeners()
        resolve()
      })
    })
  }

  addClientListeners() {
    this.client.on('open', () => this.emit(SocketEvent.OPEN))
    this.client.on('message', this.handleIncomingData)
  }

  handleIncomingData = (data: any) => {
    console.log('[DEBUG] Receiving:', data)

    if (Socket.isPingMessage(data)) {
      this.send(Socket.PongMsg)
    }

    if (Chat.isChatMessage(data)) {
      this.emit(SocketEvent.MESSAGE, data)
    }
  }

  send(data: string) {
    console.log('[DEBUG] Sending:', data)
    return new Promise((resolve, reject) => {
      this.client.send(data, err => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  async connect() {
    const { username, password } = this.authenticator.getCredentials()
    await this.init()
    await this.send(`PASS ${password}`)
    await this.send(`NICK ${username}`)
  }
}
