import * as winston from 'winston'

export interface ISoundService {
  getBySoundId(soundId: string, parentLogger: winston.Logger): Sound | undefined
  getSounds: (parentLogger: winston.Logger) => Sound[]
  isPathValid: (filename: string, parentLogger: winston.Logger) => boolean
}
