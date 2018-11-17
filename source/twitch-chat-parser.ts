import Socket from './Socket'
import Authenticator from './Authenticator'

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
  constructor(options: TwitchChatParserOptions = defaultOptions) {
    const authenticator = new Authenticator(options.username, options.password)
    new Socket(authenticator)
  }
}
