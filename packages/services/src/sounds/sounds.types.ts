import * as winston from 'winston'
import { Sound } from '@talkboy-9000/models'

export interface ISoundService {
  getBySoundId(soundId: string, parentLogger: winston.Logger): Sound | undefined
  getSounds: (parentLogger: winston.Logger) => Sound[]
  isPathValid: (filename: string, parentLogger: winston.Logger) => boolean
}

export const LOGGER_META = {
  service: {
    name: 'SoundService'
  }
}
