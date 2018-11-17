import WebSocket from 'ws'
import SocketEmitter from './SocketEmitter'
import { WEBSOCKET_URL, SocketEvent } from './consts'
import Authenticator from './Authenticator'

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

  constructor(
    authenticator: Authenticator,
    options: SocketOptions = defaultOptions,
  ) {
    super()
    this.authenticator = authenticator
    this.options = options

    const port: Number = options.secure ? 443 : 80
    this.client = new WebSocket(`${WEBSOCKET_URL}:${port}`)

    this.addClientListeners()
  }

  addClientListeners() {
    this.client.once('open', this.handleFirstConnection)
    this.client.on('message', data => console.log(data))
  }

  handleFirstConnection = () => {
    if (this.options.authenticate) {
      const { username, password } = this.authenticator.getCredentials()
      this.client.send(`PASS ${password}`)
      this.client.send(`NICK ${username}`)
    }

    this.client.on('open', () => this.emit(SocketEvent.OPEN))
  }
}
