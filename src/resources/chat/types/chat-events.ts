export enum ChatEventsToClient {
  SendToClient = 'sendToClient',
}

export enum ChatEventsToServer {
  OpenChat = 'openChat',
  CloseChat = 'closeChat',
  SendToServer = 'sendToServer',
}

export interface IOpenChatPayload {
  from: string;
  to: string;
}

export interface IMessagePayload {
  from: string;
  author: string;
  to: string;
  content: string;
  date: string;
}
