import { Injectable } from '@nestjs/common';
import { CharactersRegistry } from '../registries/static/characters.registry';

/**
 * A service that can inject dependencies and set them as a static properties.
 *
 * Useful to get service injection to the "outside-of-framework"-entities e.g. decorators.
 *
 * For example, decorator that will be adding an item to a specific static registry to access them by a key.
 */
@Injectable()
export class GameInjectableProxyService {
  static charactersRegistry: CharactersRegistry;

  constructor(charactersRegistry: CharactersRegistry) {
    GameInjectableProxyService.charactersRegistry = charactersRegistry;
  }
}
