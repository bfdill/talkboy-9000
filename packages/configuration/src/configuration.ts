import { isAbsolute, join } from 'path'
import * as config from 'config'

import { IConfigurationService, Sounds, Logging } from './configuration.types'

export class ConfigurationService implements IConfigurationService {
  private static instance: ConfigurationService | undefined = undefined
  static getInstance(): ConfigurationService {
    if (this.instance !== undefined) return this.instance

    this.instance = new ConfigurationService()

    return this.instance
  }

  soundConfig: Sounds | undefined = undefined
  loggingConfig: Logging | undefined = undefined

  getLogging = () => {
    if (this.loggingConfig !== undefined) return this.loggingConfig

    const cfg = config.get<Logging>('logging')
    const path = isAbsolute(cfg.path) ? cfg.path : join(process.cwd(), cfg.path)

    this.loggingConfig = <Logging>{
      path
    }

    return this.loggingConfig
  }

  getSounds = () => {
    if (this.soundConfig !== undefined) return this.soundConfig

    const cfg = config.get<Sounds>('sounds')
    const path = isAbsolute(cfg.path) ? cfg.path : join(process.cwd(), cfg.path)

    this.soundConfig = <Sounds>{
      path,
      fileGlob: cfg.fileGlob
    }

    return this.soundConfig
  }
}
