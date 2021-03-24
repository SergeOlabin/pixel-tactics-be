import {
  IActionsState,
  IPlayersState,
  IPlayerState,
  ITurnState,
  Players,
  TurnStage,
  Waves,
} from '../types/game.types';

export class PlayersAddon {
  public createPlayersState(playerIds: string[]): IPlayersState {
    const firstPlayer = this.roll() ? playerIds[0] : playerIds[1];
    const bluePlayer = this.roll() ? playerIds[0] : playerIds[1];
    const redPlayer = playerIds.find((id) => id !== bluePlayer);

    return {
      [Players.Blue]: this.createPlayerState(
        bluePlayer,
        firstPlayer === bluePlayer,
      ),
      [Players.Red]: this.createPlayerState(
        redPlayer,
        firstPlayer === redPlayer,
      ),
    };
  }

  private createPlayerState(playerId: string, first: boolean): IPlayerState {
    return {
      actions: this.getInitActionsForPlayer(),
      turnState: this.getInitTurnStateForPlayer(first),
      playerId,
      first,
    };
  }

  private getInitActionsForPlayer(): IActionsState {
    return {
      available: 2,
      max: 2,
    };
  }

  private getInitTurnStateForPlayer(first: boolean): ITurnState {
    return {
      wave: Waves.Vanguard,
      state: first ? TurnStage.InProgress : TurnStage.Waiting,
    };
  }

  private roll() {
    return Math.random() < 0.5;
  }
}
