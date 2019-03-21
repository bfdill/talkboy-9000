import * as koaRouter from 'koa-router'
import { PlayerController, IPlayerController } from '.'
import { IPlayerService } from '../../modules/player'
import { ISoundService, Sound } from '../../modules/sounds'
import winston = require('winston')

describe('controllers -> player', () => {
  const contextBuilder = (soundId: any): koaRouter.RouterContext =>
    ({
      params: { soundId }
    } as any)

  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })

  describe('playSound', () => {
    const playerService: IPlayerService = {
      playFile: jest.fn()
    } as any
    const mockGetBySoundId = jest.fn()
    const soundService: ISoundService = {
      getBySoundId: mockGetBySoundId
    } as any
    const logger: winston.Logger = {
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn()
    } as any
    let playerController: IPlayerController

    beforeEach(() => {
      playerController = new PlayerController(
        playerService,
        soundService,
        logger
      )
    })

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

      const sound: Sound = {
        basename: 'mommy shark',
        filename: 'daddy shark',
        id: 'baby_shark'
      }
      const ctx = contextBuilder(sound.id)
      mockGetBySoundId.mockReturnValue(sound)

      await playerController.playSound(ctx)

      expect(ctx).toMatchSnapshot()
      expect(logger.debug).toMatchSnapshot()
      expect(playerService.playFile).toBeCalledWith(sound.filename)
    })
  })
})
