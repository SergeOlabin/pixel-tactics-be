import { GameStateDocumentType } from '../../resources/game/schemas/game-state.schema';
import { GameEffectsService } from '../../resources/game/services/game-effects.service';
import { IGameState } from './game-types';

export enum CharacterList {
  Alchemist = 'Alchemist',
  DragonMage = 'DragonMage',
  Illusionist = 'Illusionist',
  Knight = 'Knight',
  Overlord = 'Overlord',
  Mascot = 'Mascot',
  Vampire = 'Vampire',
  Templar = 'Templar',
  Witch = 'Witch',
  Fighter = 'Fighter',
  Pyromancer = 'Pyromancer',
  Healer = 'Healer',
  Homunculus = 'Homunculus',
  Trapper = 'Trapper',
  Summoner = 'Summoner',
  Scientist = 'Scientist',
  Priestess = 'Priestess',
  Assassin = 'Assassin',
  Gunner = 'Gunner',
  Doppelganger = 'Doppelganger',
  Oracle = 'Oracle',
  Berserker = 'Berserker',
  Mystic = 'Mystic',
  Paladin = 'Paladin',
  Planestalker = 'Planestalker',
}

export interface IHero {
  type: CharacterList;
  attack: number;
  health: number;
  vanguardPower(gameState: GameStateDocumentType): any;
  flankPower(gameState: GameStateDocumentType): any;
  rearPower(gameState: GameStateDocumentType): any;
  orderPower(gameState: GameStateDocumentType): any;
}
