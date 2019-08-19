import { ChildProcess } from 'child_process'
import { getJestLogger, IJestLogger } from '@talkboy-9000/winston-jest'
import { getMockSoundService } from '../../sounds/src/__mocks__/soundService'

import { createPlayer, IPlayer, What, PlayOptions, Next } from './types'
import { IPlayerService } from './player.types'
import { PlayerService } from './player'

// tsd creation fail
const createPlayer: createPlayer = require('play-sound')

describe('playerService', () => {
  const filename = 'this-file-totes-exists.mp3'
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
  const mockSoundService = getMockSoundService()
  const jestLogger: IJestLogger = getJestLogger()
  const playerService: IPlayerService = new PlayerService(
    player,
    mockSoundService
  )

  beforeEach(() => {
    mockSoundService.setIsPathValid(true)
    mockNextInput.mockReturnValue(null)
  })

  test('rejects on invalid file', async () => {
    expect.assertions(3)
    mockSoundService.setIsPathValid(false)

    await expect(
      playerService.playFile(filename, jestLogger.logger)
    ).rejects.toMatchSnapshot()

    jestLogger.callsMatchSnapshot()
  })

  test('rejects on playback error', async () => {
    expect.assertions(3)
    mockNextInput.mockReturnValue({ error: 'KHAAAAAAN!' })

    await expect(
      playerService.playFile(filename, jestLogger.logger)
    ).rejects.toMatchSnapshot()

    jestLogger.callsMatchSnapshot()
  })

  test('playback happy path', async () => {
    expect.assertions(3)

    await expect(
      playerService.playFile(filename, jestLogger.logger)
    ).resolves.toMatchSnapshot()

    jestLogger.callsMatchSnapshot()
  })
})
