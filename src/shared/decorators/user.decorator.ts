import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../../resources/auth/types/jwt-payload.types';
import { Socket } from 'socket.io';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const wsContext = ctx.switchToWs();
    const wsClient = wsContext.getClient();

    return request.user as IJwtPayload;
  },
);

export const UserWs = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToWs();
    const wsClient: Socket = context.getClient();

    return wsClient.handshake.auth;
  },
);
