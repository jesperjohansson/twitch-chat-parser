export default class Authenticator {
  private username: String
  private password: String

  constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  getCredentials() {
    return {
      username: this.username,
      password: this.password,
    }
  }
}
