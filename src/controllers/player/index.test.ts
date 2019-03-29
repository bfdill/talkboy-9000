import * as koaRouter from 'koa-router'
import { PlayerController, IPlayerController } from '.'
import { IPlayerService } from '../../modules/player'
import { ISoundService, Sound } from '../../modules/sounds'
import {
  getJestLogger,
  IJestLogger
} from '../../modules/winston-jest/index.test'

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
  const sound: Sound = {
    basename: 'mommy shark',
    filename: 'daddy shark',
    id: 'baby_shark'
  }
  let jestLogger: IJestLogger
  let playerController: IPlayerController

  beforeEach(() => {
    mockGetSounds.mockReturnValue([])
    jestLogger = getJestLogger()
    playerController = new PlayerController(
      playerService,
      soundService,
      jestLogger.logger
    )
  })

  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })

  describe('playSound', () => {
    test.each([undefined, null, false, true, 1])(
      'bad request on non-string',
      async (soundId: any) => {
        expect.hasAssertions()
        const ctx = contextBuilder(soundId)

        await playerController.playSound(ctx)

        expect(ctx).toMatchSnapshot()
        jestLogger.callsMatchSnapshot()
      }
    )

    test('not found on unknown song', async () => {
      expect.hasAssertions()

      const ctx = contextBuilder('unknown')

      await playerController.playSound(ctx)

      expect(ctx).toMatchSnapshot()
      jestLogger.callsMatchSnapshot()
    })

    test('plays sound', async () => {
      expect.hasAssertions()

      const ctx = contextBuilder(sound.id)
      mockGetBySoundId.mockReturnValue(sound)

      await playerController.playSound(ctx)

      expect(ctx).toMatchSnapshot()
      expect(playerService.playFile).toBeCalledWith(sound.filename)
      jestLogger.callsMatchSnapshot()
    })
  })

  describe('playRando', () => {
    test('not found when no sounds', async () => {
      expect.hasAssertions()

      const ctx = contextBuilder()

      await playerController.playRando(ctx)

      expect(ctx).toMatchSnapshot()
      jestLogger.callsMatchSnapshot()
    })

    test('plays sound', async () => {
      expect.hasAssertions()

      const ctx = contextBuilder(sound.id)
      mockGetBySoundId.mockReturnValue(sound)
      mockGetSounds.mockReturnValue([sound])

      await playerController.playRando(ctx)

      expect(ctx).toMatchSnapshot()
      expect(playerService.playFile).toBeCalledWith(sound.filename)
      jestLogger.callsMatchSnapshot()
    })
  })
})
