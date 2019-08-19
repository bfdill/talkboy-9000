export type Sounds = {
  fileGlob: string
  path: string
}

export type Logging = {
  path: string
}

export type FullConfig = {
  logging: Logging
  sounds: Sounds
}

export interface IConfigurationService {
  getLogging: () => Logging
  getSounds: () => Sounds
}
