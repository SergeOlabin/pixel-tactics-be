import { Socket } from 'socket.io';

export class BaseGatewayAddon {
  protected server: Socket;

  setServer(server: Socket) {
    this.server = server;
  }
}
