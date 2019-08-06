import { Sound } from '@talkboy-9000/models'
import { ISoundService } from '@talkboy-9000/sounds'
import { getJestLogger } from '@talkboy-9000/winston-jest'
import { IApplicationContext } from '../../types'
import { SoundsController, getSoundsRouter } from '.'

describe('controllers -> sounds -> index', () => {
  const mockSound: Sound = {
    basename: 'mock basename',
    filename: 'mock filename',
    id: 'mock id'
  }

  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })

  test.each([null as any, [mockSound]])(
    'get matches snapshot',
    async (sounds?: Sound[] | null) => {
      const mockSoundService: ISoundService = {
        getSounds: () => sounds
      } as any
      const controller = new SoundsController(mockSoundService)
      const jestLogger = getJestLogger()
      const context: IApplicationContext = {
        logger: jestLogger.logger
      } as any

      await controller.get(context)

      expect(context.body).toMatchSnapshot()
      expect(context.status).toMatchSnapshot()
      jestLogger.callsMatchSnapshot()
    }
  )

  test('getSoundsRouter', () => {
    expect(getSoundsRouter()).toMatchSnapshot()
  })
})
