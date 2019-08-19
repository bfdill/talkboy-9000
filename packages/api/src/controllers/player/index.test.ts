import { PlayerController, IPlayerController } from '.'
import { IPlayerService } from '@talkboy-9000/player'
import { ISoundService } from '@talkboy-9000/sounds'
import { getJestLogger, IJestLogger } from '@talkboy-9000/winston-jest'
import { IApplicationContext } from '../../types'
import { mockApplicationState } from '../../__mocks__/applicationState'
import { Sound } from '@talkboy-9000/models'

describe('controllers -> player', () => {
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
  const jestLogger: IJestLogger = getJestLogger()
  const playerController: IPlayerController = new PlayerController(
    playerService,
    soundService
  )
  const contextBuilder = (soundId?: any): IApplicationContext =>
    ({
      params: { soundId },
      logger: jestLogger.logger,
      state: mockApplicationState
    } as any)

  beforeEach(() => {
    mockGetSounds.mockReturnValue([])
  })

  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })

  describe('playSound', () => {
    test.each([undefined, null, false, true, 1])(
      'bad request on non-string',
      async (soundId: any) => {
        expect.hasAssertions()
        const context = contextBuilder(soundId)

        await playerController.playSound(context)

        expect(context.body).toMatchSnapshot()
        expect(context.status).toMatchSnapshot()
        jestLogger.callsMatchSnapshot()
      }
    )

    test('not found on unknown song', async () => {
      expect.hasAssertions()

      const context = contextBuilder('unknown')

      await playerController.playSound(context)

      expect(context.body).toMatchSnapshot()
      expect(context.status).toMatchSnapshot()
      jestLogger.callsMatchSnapshot()
    })

    test('plays sound', async () => {
      expect.hasAssertions()

      const context = contextBuilder(sound.id)
      mockGetBySoundId.mockReturnValue(sound)

      await playerController.playSound(context)

      expect(context.body).toMatchSnapshot()
      expect(context.status).toMatchSnapshot()
      expect(playerService.playFile).toBeCalledWith(
        sound.filename,
        expect.any(Object)
      )
      jestLogger.callsMatchSnapshot()
    })
  })

  describe('playRando', () => {
    test('not found when no sounds', async () => {
      expect.hasAssertions()

      const context = contextBuilder()

      await playerController.playRando(context)

      expect(context.body).toMatchSnapshot()
      expect(context.status).toMatchSnapshot()
      jestLogger.callsMatchSnapshot()
    })

    test('plays sound', async () => {
      expect.hasAssertions()

      const context = contextBuilder(sound.id)
      mockGetBySoundId.mockReturnValue(sound)
      mockGetSounds.mockReturnValue([sound])

      await playerController.playRando(context)

      expect(context.body).toMatchSnapshot()
      expect(context.status).toMatchSnapshot()
      expect(playerService.playFile).toBeCalledWith(
        sound.filename,
        expect.any(Object)
      )
      jestLogger.callsMatchSnapshot()
    })
  })
})
