import { FullConfig } from '../src/configuration.types'

const config: FullConfig = {
  logging: {
    path: 'logs'
  },
  sounds: {
    fileGlob: '**/*.mp3',
    path: 'audio'
  }
}

export default config
