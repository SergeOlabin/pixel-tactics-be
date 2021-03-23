export class SocketIoAuthMiddleware {
  use(socket, next) {
    const username = socket.handshake.auth.username;
    if (!username) {
      return next(new Error('invalid username'));
    }
    socket.username = username;
    next();
  }
}
