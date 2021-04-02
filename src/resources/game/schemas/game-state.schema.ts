import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IBoardStateClass,
  IGameState,
  IPlayersStateClass,
  Players,
} from '../../../game-data/types/game-types';
import { Document } from 'mongoose';

export type GameStateDocumentType = GameState & Document;

@Schema()
export class GameState implements IGameState {
  @Prop()
  _id: string;

  @Prop()
  board: IBoardStateClass;

  @Prop()
  players: IPlayersStateClass;

  @Prop()
  turn: Players;

  constructor({
    _id,
    board,
    players,
    turn,
  }: {
    _id: string;
    board: IBoardStateClass;
    players: IPlayersStateClass;
    turn: Players;
  }) {
    this._id = _id;
    this.board = board;
    this.players = players;
    this.turn = turn;
  }
}

export const GameStateSchema = SchemaFactory.createForClass(GameState);
