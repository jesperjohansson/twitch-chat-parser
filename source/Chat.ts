import Socket from './Socket'
import Parser from './Parser'
import { SocketEvent } from './consts'

export default class Chat extends Parser {
  socket: Socket
  channel: string

  static isChatMessage(data: string) {
    return typeof data === 'string' && data.includes('PRIVMSG')
  }

  constructor(socket: Socket) {
    super()
    this.socket = socket
    this.addEventListeners()
  }

  addEventListeners() {
    this.socket.on(SocketEvent.MESSAGE, this.read)
  }

  join(channel: string) {
    this.channel = channel
    return this.socket.send(`JOIN #${channel}`)
  }

  send(message: string) {
    return this.socket.send(`PRIVMSG #${this.channel} :${message}`)
  }

  read = (message: string) => {
    console.log(this.parse(message))
  }
}
