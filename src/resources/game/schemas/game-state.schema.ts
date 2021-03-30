import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IBoardStateClass,
  IGameState,
  IPlayersState,
  IPlayersStateClass,
  Players,
} from '../../../game-data/types/game-types';
import { Document } from 'mongoose';

export type GameStateDocumentType = GameState & Document;

@Schema({ _id: false })
export class GameState implements IGameState {
  @Prop()
  _id: string;

  @Prop({ type: IBoardStateClass })
  board: IBoardStateClass;

  @Prop({ type: IPlayersStateClass })
  players: IPlayersState;

  @Prop({ type: Players })
  turn: Players;

  constructor({
    _id,
    board,
    players,
    turn,
  }: {
    _id: string;
    board: IBoardStateClass;
    players: IPlayersState;
    turn: Players;
  }) {
    this._id = _id;
    this.board = board;
    this.players = players;
    this.turn = turn;
  }
}

export const GameStateSchema = SchemaFactory.createForClass(GameState);
