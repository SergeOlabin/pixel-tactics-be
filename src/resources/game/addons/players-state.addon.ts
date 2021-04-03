import {
  IActionsState,
  IPlayersStateClass,
  IPlayerState,
  Players,
  TurnStage,
  Waves,
} from '../../../game-data/types/game-types';

export class PlayersAddon {
  public createPlayersState(
    playerIds: string[],
  ): [IPlayersStateClass, Players] {
    const firstPlayer = this.roll() ? playerIds[0] : playerIds[1];
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

    const first = firstPlayer === bluePlayer ? Players.Blue : Players.Red;

    return [state, first];
  }

  private createPlayerState(userId: string, first: boolean): IPlayerState {
    return {
      actionsMeta: this.getInitActionsForPlayer(),
      userId,
    };
  }

  private getInitActionsForPlayer(): IActionsState {
    return {
      available: 2,
      max: 2,
    };
  }

  private roll() {
    return Math.random() < 0.5;
  }
}
