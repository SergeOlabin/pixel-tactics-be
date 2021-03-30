import {
  IActionsState,
  IPlayersState,
  IPlayerState,
  ITurnState,
  Players,
  TurnStage,
  Waves,
} from '../../../game-data/types/game-types';

export class PlayersAddon {
  public createPlayersState(playerIds: string[]): [IPlayersState, Players] {
    const firstPlayer = (this.roll() ? playerIds[0] : playerIds[1]) as Players;
    const bluePlayer = this.roll() ? playerIds[0] : playerIds[1];
    const redPlayer = playerIds.find((id) => id !== bluePlayer);

    const state = {
      [Players.Blue]: this.createPlayerState(
        bluePlayer,
        firstPlayer === bluePlayer,
      ),
      [Players.Red]: this.createPlayerState(
        redPlayer,
        firstPlayer === redPlayer,
      ),
    };

    return [state, firstPlayer];
  }

  private createPlayerState(userId: string, first: boolean): IPlayerState {
    return {
      actionsMeta: this.getInitActionsForPlayer(),
      turnState: this.getInitTurnStateForPlayer(first),
      userId,
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
