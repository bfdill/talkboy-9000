import { createPlayer, IPlayer, What, PlayOptions, Next } from './types'
import { PlayerService, IPlayerService } from '.'
import { ISoundService } from '../sounds'
import { IJestLogger, getJestLogger } from '../winston-jest/index.test'
import { ChildProcess } from 'child_process'

// tsd creation fail
const createPlayer: createPlayer = require('play-sound')

describe('modules -> player', () => {
  const filename = 'this-file-totes-exists.mp3'
  const mockIsPathValid: jest.Mock = jest.fn()
  const mockNextInput: jest.Mock = jest.fn()
  const fakePlay = (
    _0: What,
    options?: PlayOptions | Next,
    _2?: Next
  ): ChildProcess => {
    if (typeof options === 'function') {
      options(mockNextInput())
    }

    return jest.fn() as any
  }
  const player: IPlayer = {
    play: fakePlay
  }
  const soundService: ISoundService = {
    getBySoundId: jest.fn(),
    getSounds: jest.fn(),
    isPathValid: mockIsPathValid
  }
  let playerService: IPlayerService
  let jestLogger: IJestLogger

  beforeEach(() => {
    mockIsPathValid.mockReturnValue(true)
    mockNextInput.mockReturnValue(null)
    jestLogger = getJestLogger()
    playerService = new PlayerService(player, soundService, jestLogger.logger)
  })

  test('rejects on invalid file', async () => {
    expect.assertions(3)
    mockIsPathValid.mockReturnValue(false)

    await expect(playerService.playFile(filename)).rejects.toMatchSnapshot()

    jestLogger.callsMatchSnapshot()
  })

  test('rejects on playback error', async () => {
    expect.assertions(3)
    mockNextInput.mockReturnValue({ error: 'KHAAAAAAN!' })

    await expect(playerService.playFile(filename)).rejects.toMatchSnapshot()

    jestLogger.callsMatchSnapshot()
  })

  test('playback happy path', async () => {
    expect.assertions(3)

    await expect(playerService.playFile(filename)).resolves.toMatchSnapshot()

    jestLogger.callsMatchSnapshot()
  })
})
