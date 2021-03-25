import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { GameStateToUserAdapterService } from './adapters/game-state-to-user.adapter';
import { GameOnlineUsersRegistry } from './registries/game-online-users.registry';
import { PendingGamesRegistry } from './registries/pending-games.registry';
import { GameState } from './schemas/game-state.schema';
import { GameService } from './services/game.service';
import {
  GameStartEventsToClient,
  GameStartEventsToServer,
  IAcceptGamePayload,
  IAskAcceptPayload,
  IChallengeGamePayload,
} from './types/game-socket-events';

@WebSocketGateway({ namespace: 'game', transports: ['websocket'] })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Socket;

  private logger: Logger = new Logger('AppChatGateway');

  constructor(
    private readonly gameService: GameService,
    private readonly pendingGamesRegistry: PendingGamesRegistry,
    private readonly gameOnlineUsersRegistry: GameOnlineUsersRegistry,
    private readonly gameStateToUserAdapterService: GameStateToUserAdapterService,
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    const { id } = client.handshake.auth;

    this.gameOnlineUsersRegistry.addItems([
      {
        userId: id,
        clientId: client.id,
      },
    ]);
    this.logger.log(`Client connected: ${client.id} ${id}`);
  }

  handleDisconnect(client: Socket) {
    const { id } = client.handshake.auth;

    this.gameOnlineUsersRegistry.removeItems([id]);
    this.logger.log(`Client disconnected: ${client.id} ${id}`);
  }

  @SubscribeMessage(GameStartEventsToServer.ChallengeGame)
  challengeGame(
    @MessageBody() challengeGamePayload: IChallengeGamePayload,
    // @ConnectedSocket() client: Socket,
  ) {
    const gameId = uuidv4();
    const { from, to } = challengeGamePayload;

    this.pendingGamesRegistry.addItems([
      {
        id: gameId,
        playerIds: [from, to],
      },
    ]);

    this.sendAcceptRequest({
      to,
      from,
      gameId,
    });
  }

  @SubscribeMessage(GameStartEventsToServer.AcceptGame)
  acceptGame(@MessageBody() acceptGamePayload: IAcceptGamePayload) {
    const { gameId } = acceptGamePayload;
    const game = this.pendingGamesRegistry.getItem(gameId);

    if (!game) {
      throw new WsException(`Pending game not found ${gameId}`);
    }

    this.startGame(game.playerIds, game.id);
    this.pendingGamesRegistry.removeItems([gameId]);
  }

  sendAcceptRequest({
    to,
    from,
    gameId,
  }: {
    to: string;
    gameId: string;
    from: string;
  }) {
    const user = this.gameOnlineUsersRegistry.getItem(to);

    if (!user) {
      throw new WsException(`User not found online ${to}`);
    }

    const payload: IAskAcceptPayload = {
      from,
      gameId,
    };

    this.server
      .to(user.clientId)
      .emit(GameStartEventsToClient.AskAccept, payload);
  }

  sendGameStateToPlayer(gameState: GameState, userId: string) {
    const adaptedState = this.gameStateToUserAdapterService.adapt(
      gameState,
      userId,
    );

    const clientId = this.gameOnlineUsersRegistry.getItem(userId).clientId;

    this.server
      .to(clientId)
      .emit(GameStartEventsToClient.SendGameState, adaptedState);
  }

  private startGame(playerIds: string[], id?: string) {
    const gameState = this.gameService.startGame(playerIds, id);
    playerIds.forEach((playerId) =>
      this.sendGameStateToPlayer(gameState, playerId),
    );
  }
}
