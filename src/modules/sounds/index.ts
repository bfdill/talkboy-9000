import { join, resolve, sep, basename } from 'path'
import * as winston from 'winston'
import { createLogger } from '../logging'
import * as sane from 'sane'
import * as glob from 'glob'

export const soundServiceLogger = createLogger('SoundService')
export const PATH_TO_SOUNDS = join(process.cwd(), 'audio')

export type Sound = {
  id: string
  filename: string
  basename: string
}

export interface ISoundService {
  getBySoundId(soundId: string): Sound | undefined
  getSounds: () => Sound[]
  isPathValid: (filename: string) => boolean
}

export class SoundService implements ISoundService {
  public readonly FILE_GLOB = '**/*.mp3'

  protected sounds: Sound[] = []
  protected readonly watcher: sane.Watcher

  constructor(
    public readonly pathToSounds: string,
    protected readonly logger: winston.Logger,
    protected readonly saneFunction: typeof sane
  ) {
    this.addSounds()
    this.watcher = this.createWatch()
  }

  addSounds = () =>
    glob(join(this.pathToSounds, this.FILE_GLOB), (_, matches) => {
      matches.forEach(this.addSound)
    })

  addSound = (filename: string) => {
    // this.logger.debug(`addSound(${filename})`)

    this.sounds = [
      ...this.sounds,
      {
        filename,
        id: filename,
        basename: basename(filename)
      }
    ]
      .sort((a, b) => a.filename.localeCompare(b.filename))
      .map((v, i) => {
        v.id = `${i}`
        return v
      })

    // this.logger.silly({
    //   message: `addSound(${filename})`,
    //   sounds: this.sounds
    // })
  }

  createWatch = (): sane.Watcher => {
    return this.saneFunction(this.pathToSounds, { glob: this.FILE_GLOB })
      .on('add', (path: string) => {
        this.addSound(path)

        this.logger.debug({
          path,
          message: 'add'
        })
      })
      .on('delete', (path: string) => {
        this.removeSound(path)

        this.logger.debug({
          path,
          message: 'delete'
        })
      })
  }

  getBySoundId = (soundId: string): Sound | undefined => {
    const result = this.sounds.find(s => s.id === soundId)
    this.logger.debug({
      result,
      message: `getBySoundId(${soundId})`
    })
    return result
  }

  getSounds = (): Sound[] => {
    this.logger.silly({ message: 'getSounds()', sounds: this.sounds })
    return this.sounds
  }

  isPathValid = (filename: string): boolean => {
    const absCandidate = resolve(filename) + sep
    const result =
      absCandidate.substring(0, PATH_TO_SOUNDS.length) === PATH_TO_SOUNDS
    this.logger.debug({
      result,
      message: `isPathValid(${filename})`
    })
    return result
  }

  removeSound = (filename: string) => {
    this.logger.debug(`removeSound(${filename})`)

    const soundIndex = this.sounds.findIndex(s => s.filename === filename)

    if (soundIndex === -1) return

    this.sounds = this.sounds
      .slice(0, soundIndex)
      .concat(this.sounds.slice(soundIndex + 1))
      .sort((a, b) => `${a.filename}`.localeCompare(b.filename))
      .map((v, i) => {
        v.id = `${i}`
        return v
      })

    this.logger.silly({
      message: `removeSound(${filename})`,
      sounds: this.sounds
    })
  }
}

const soundService = new SoundService(PATH_TO_SOUNDS, soundServiceLogger, sane)

export { soundService }
