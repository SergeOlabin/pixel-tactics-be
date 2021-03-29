import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IBoardState,
  IBoardStateClass,
  IGameState,
  IPlayersState,
  IPlayersStateClass,
} from '../types/game.types';
import { Document } from 'mongoose';

export type GameStateDocumentType = GameState & Document;

@Schema({ _id: false })
export class GameState implements IGameState {
  @Prop()
  _id: string;

  @Prop({ type: IBoardStateClass })
  board: IBoardState;

  @Prop({ type: IPlayersStateClass })
  players: IPlayersState;

  constructor({
    _id,
    board,
    players,
  }: {
    _id: string;
    board: IBoardState;
    players: IPlayersState;
  }) {
    this._id = _id;
    this.board = board;
    this.players = players;
  }
}

export const GameStateSchema = SchemaFactory.createForClass(GameState);
