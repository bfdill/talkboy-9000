export type Sounds = {
  FileGlob: string
  PathToSounds: string
}

export type FullConfig = {
  sounds: Sounds
}

export interface IConfigurationService {
  getSounds: () => Sounds
}
