import { createPlayer, IPlayer } from './types';
import { PlayerService, IPlayerService } from '.';
import { ISoundService } from '../sounds';
import winston = require('winston');
import { WinstonJestTransport } from '../winston-jest/index.test';

// tsd creation fail
const createPlayer: createPlayer = require('play-sound')

describe('modules -> player', () => {
  const mockIsPathValid: jest.Mock = jest.fn()
  const transport: WinstonJestTransport = new WinstonJestTransport()
  const player: IPlayer = {
    play: jest.fn()
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
    playerService = new PlayerService(player, soundService, logger)
  })

  test('rejects on invalid file', async () => {
    expect.assertions(3)
    mockIsPathValid.mockReturnValue(false)

    await expect(playerService.playFile('this-file-totes-exists.mp3'))
      .rejects
      .toMatchSnapshot()

    validateLogging()
  })
})
