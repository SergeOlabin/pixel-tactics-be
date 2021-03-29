import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GameState, GameStateDocumentType } from '../schemas/game-state.schema';

/**
 * workaround to inject a mongoose model into a factory
 */
@Injectable()
export class GameStateModelService {
  constructor(
    @InjectModel(GameState.name)
    public readonly gameStateModel: Model<GameStateDocumentType>,
  ) {}
}
