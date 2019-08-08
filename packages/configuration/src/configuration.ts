import { isAbsolute, join } from 'path'
import * as config from 'config'

export namespace Configuration {
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

  export class ConfigurationService implements IConfigurationService {
    private static instance: ConfigurationService | undefined = undefined
    static getInstance(): ConfigurationService {
      if (this.instance !== undefined) return this.instance

      this.instance = new ConfigurationService()

      return this.instance
    }

    soundConfig: Sounds | undefined = undefined

    getSounds = () => {
      if (this.soundConfig !== undefined) return this.soundConfig

      const cfg = config.get<Sounds>('sounds')

      console.log(`cfg(${cfg})`)

      // tslint:disable-next-line: variable-name
      const PathToSounds = isAbsolute(cfg.PathToSounds)
        ? cfg.PathToSounds
        : join(process.cwd(), cfg.PathToSounds)

      this.soundConfig = <Sounds>{
        PathToSounds,
        FileGlob: cfg.FileGlob
      }

      return this.soundConfig
    }
  }
}
