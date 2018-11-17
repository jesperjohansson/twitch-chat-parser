export default class Parser {
  static privMsgRegex = /^:(.+)!.+?@.+?twitch\.tv\ PRIVMSG\ #.+?\ :(.+)/

  parse(data: string) {
    const [, name, message] = Parser.privMsgRegex.exec(data)
    return { name, message }
  }
}
