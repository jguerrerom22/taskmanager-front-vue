export default {

  verifyAuth (app) {
    app.$session.start()
    var token = app.$session.get('jwt')
    if (!token) {
      app.$router.replace({ name: 'login' })
      return
    }
    return token
  }
}
