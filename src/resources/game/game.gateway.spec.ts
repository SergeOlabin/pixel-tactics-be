import { Test, TestingModule } from '@nestjs/testing';
import { GameInitGateway } from './game-init.gateway';
import { GameService } from './services/game.service';

describe('GameGateway', () => {
  let gateway: GameInitGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameInitGateway, GameService],
    }).compile();

    gateway = module.get<GameInitGateway>(GameInitGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
