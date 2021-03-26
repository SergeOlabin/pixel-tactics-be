import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../../resources/auth/types/jwt-payload.types';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const wsContext = ctx.switchToWs();
    const wsClient = wsContext.getClient();

    console.log('wsContext', wsContext);
    console.log('wsClient', wsClient);
    return request.user as IJwtPayload;
  },
);

export const UserWs = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToWs();
    const wsClient = context.getClient();

    return wsClient;
  },
);
