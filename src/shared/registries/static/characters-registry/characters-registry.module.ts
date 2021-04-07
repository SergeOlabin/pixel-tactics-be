import { Module } from '@nestjs/common/decorators';
import { CharactersRegistry } from './characters-registry.service';

@Module({
  providers: [CharactersRegistry],
  exports: [CharactersRegistry],
})
export class CharactersRegistryModule {}
