import Socket from './Socket'
import Authenticator from './Authenticator'
import Chat from './Chat'

interface TwitchChatParserOptions {
  username: string
  password: string
  connect: boolean
}

const defaultOptions: TwitchChatParserOptions = {
  username: '',
  password: '',
  connect: true,
}

export default class TwitchChatParser {
  socket: Socket
  chat: Chat

  constructor(options: TwitchChatParserOptions = defaultOptions) {
    const authenticator = new Authenticator(options.username, options.password)
    this.socket = new Socket(authenticator)
    this.chat = new Chat(this.socket)
  }

  connect() {
    return this.socket.connect()
  }

  join(channel: string) {
    return this.chat.join(channel)
  }

  send(message: string) {
    return this.chat.send(message)
  }
}
