import * as sane from 'sane'
import * as winston from 'winston'
import { sync } from 'glob'
import { join, resolve, sep, basename } from 'path'
import { ISoundService, LOGGER_META } from './sounds.types'
import { Sound } from '@talkboy-9000/models'

export class SoundService implements ISoundService {
  private static instance: ISoundService | undefined
  public readonly FILE_GLOB = '**/*.mp3'

  protected sounds: Sound[] = []
  protected readonly watcher: sane.Watcher

  constructor(
    public readonly pathToSounds: string,
    protected readonly saneFunction: typeof sane,
    protected readonly logger: winston.Logger
  ) {
    this.addSounds()
    this.watcher = this.createWatch()
  }

  addSounds = () => {
    this.logger.info('add sounds')

    sync(join(this.pathToSounds, this.FILE_GLOB)).forEach(this.addSound)
  }

  addSound = (filename: string) => {
    this.logger.debug({ filename })

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

    this.logger.silly({
      filename,
      sounds: this.sounds
    })
  }

  private createWatch = (): sane.Watcher => {
    return this.saneFunction(this.pathToSounds, { glob: this.FILE_GLOB })
      .on('add', (path: string) => {
        this.addSound(path)

        this.logger.debug({
          path,
          message: 'watch:add'
        })
      })
      .on('delete', (path: string) => {
        this.removeSound(path)

        this.logger.debug({
          path,
          message: 'watch:delete'
        })
      })
  }

  getBySoundId = (
    soundId: string,
    parentLogger: winston.Logger
  ): Sound | undefined => {
    const result = this.sounds.find(s => s.id === soundId)
    parentLogger
      .child({
        service: {
          name: 'SoundService',
          method: 'getBySoundId'
        }
      })
      .debug({
        result,
        soundId,
        message: `getBySoundId(${soundId})`
      })
    return result
  }

  getSounds = (parentLogger: winston.Logger): Sound[] => {
    parentLogger
      .child({
        service: {
          name: 'SoundService',
          method: 'getSounds'
        }
      })
      .silly({ sounds: this.sounds })
    return this.sounds
  }

  isPathValid = (filename: string, parentLogger: winston.Logger): boolean => {
    const absCandidate = resolve(filename) + sep
    const result =
      absCandidate.substring(0, this.pathToSounds.length) === this.pathToSounds

    parentLogger
      .child({
        service: {
          name: 'SoundService',
          method: 'isPathValid'
        }
      })
      .debug({
        filename,
        result,
        message: `isPathValid(${filename})`,
        pathToSounds: this.pathToSounds
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

  static getInstance(): ISoundService {
    if (this.instance !== undefined) return this.instance

    this.instance = new SoundService(
      join(process.cwd(), 'audio'),
      sane,
      winston.createLogger({ defaultMeta: LOGGER_META })
    )

    return this.instance
  }
}
