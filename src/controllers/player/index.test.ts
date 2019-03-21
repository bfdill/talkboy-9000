import * as koaRouter from 'koa-router'
import { PlayerController, IPlayerController } from '.'
import { IPlayerService } from '../../modules/player'
import { ISoundService, Sound } from '../../modules/sounds'
import winston = require('winston')

describe('controllers -> player', () => {
  const contextBuilder = (soundId?: any): koaRouter.RouterContext =>
    ({
      params: { soundId }
    } as any)
  const playerService: IPlayerService = {
    playFile: jest.fn()
  } as any
  const mockGetBySoundId = jest.fn()
  const mockGetSounds = jest.fn()
  const soundService: ISoundService = {
    getBySoundId: mockGetBySoundId,
    getSounds: mockGetSounds
  } as any
  const logger: winston.Logger = {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn()
  } as any
  const sound: Sound = {
    basename: 'mommy shark',
    filename: 'daddy shark',
    id: 'baby_shark'
  }
  let playerController: IPlayerController

  beforeEach(() => {
    mockGetSounds.mockReturnValue([])
    playerController = new PlayerController(playerService, soundService, logger)
  })

  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })

  describe('playSound', () => {
    test.each([undefined, null, false, true, 1])(
      'bad request on non-string',
      async (soundId: any) => {
        expect.assertions(2)
        const ctx = contextBuilder(soundId)

        await playerController.playSound(ctx)

        expect(ctx).toMatchSnapshot()
        expect(logger.warn).toMatchSnapshot()
      }
    )

    test('not found on unknown song', async () => {
      expect.assertions(2)

      const ctx = contextBuilder('unknown')

      await playerController.playSound(ctx)

      expect(ctx).toMatchSnapshot()
      expect(logger.error).toMatchSnapshot()
    })

    test('plays sound', async () => {
      expect.assertions(3)

      const ctx = contextBuilder(sound.id)
      mockGetBySoundId.mockReturnValue(sound)

      await playerController.playSound(ctx)

      expect(ctx).toMatchSnapshot()
      expect(logger.debug).toMatchSnapshot()
      expect(playerService.playFile).toBeCalledWith(sound.filename)
    })
  })

  describe('playRando', () => {
    test('not found when no sounds', async () => {
      expect.assertions(3)

      const ctx = contextBuilder()

      await playerController.playRando(ctx)

      expect(ctx).toMatchSnapshot()
      expect(logger.info).toMatchSnapshot()
      expect(logger.error).toMatchSnapshot()
    })

    test('plays sound', async () => {
      expect.assertions(3)

      const ctx = contextBuilder(sound.id)
      mockGetBySoundId.mockReturnValue(sound)
      mockGetSounds.mockReturnValue([sound])

      await playerController.playRando(ctx)

      expect(ctx).toMatchSnapshot()
      expect(logger.debug).toMatchSnapshot()
      expect(playerService.playFile).toBeCalledWith(sound.filename)
    })
  })
})
