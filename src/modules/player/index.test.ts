import { createPlayer, IPlayer, What, PlayOptions, Next } from './types';
import { PlayerService, IPlayerService } from '.';
import { ISoundService } from '../sounds';
import winston = require('winston');
import { WinstonJestTransport } from '../winston-jest/index.test';
import { ChildProcess } from 'child_process';

// tsd creation fail
const createPlayer: createPlayer = require('play-sound')

describe('modules -> player', () => {
  const filename = 'this-file-totes-exists.mp3'
  const transport: WinstonJestTransport = new WinstonJestTransport()
  const mockIsPathValid: jest.Mock = jest.fn()
  const mockNextInput: jest.Mock = jest.fn()
  const fakePlay = (_0: What, options?: PlayOptions | Next, _2?: Next): ChildProcess => {
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
  const logger = winston.createLogger({
    transports: [transport]
  })
  const validateLogging = () => {
    transport.mock.mock.calls.forEach(call => {
      expect(call).toMatchSnapshot()
    })
  }
  let playerService: IPlayerService

  beforeEach(() => {
    mockIsPathValid.mockReturnValue(true)
    mockNextInput.mockReturnValue(null)
    playerService = new PlayerService(player, soundService, logger)
  })

  test('rejects on invalid file', async () => {
    expect.assertions(3)
    mockIsPathValid.mockReturnValue(false)

    await expect(playerService.playFile(filename))
      .rejects
      .toMatchSnapshot()

    validateLogging()
  })

  test('rejects on playback error', async () => {
    expect.assertions(3)
    mockNextInput.mockReturnValue({ error: 'KHAAAAAAN!' })

    await expect(playerService.playFile(filename))
      .rejects
      .toMatchSnapshot()

    validateLogging()
  })

  test('playback happy path', async () => {
    expect.assertions(2)

    await expect(playerService.playFile(filename))
      .resolves
      .toMatchSnapshot()

    validateLogging()
  })
})
