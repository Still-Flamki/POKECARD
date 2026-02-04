
export enum Realm {
  ZEKROM = 'zekrom',
  PIKACHU = 'pikachu',
  CHARIZARD = 'charizard',
  MEWTWO = 'mewtwo',
  SQUIRTLE = 'squirtle',
  BULBASAUR = 'bulbasaur',
  WOBBUFFET = 'wobbuffet',
  GENGAR = 'gengar',
  MAGNETON = 'magneton',
  SNORLAX = 'snorlax'
}

export type ViewState = 'BOOT' | 'HOME' | 'POKEMON_SECTION' | 'POKEMON_DETAIL' | 'CHARACTER_SECTION';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}
