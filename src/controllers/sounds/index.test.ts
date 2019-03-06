import { SoundsController, soundsControllerLogger } from '.'
import { ISoundService, Sound } from '../../modules/sounds'
import koaRouter = require('koa-router')

describe('controllers -> sounds -> index', () => {
  const mockSound: Sound = {
    basename: 'mock basename',
    filename: 'mock filename',
    id: 'mock id'
  }

  test.each([
    [null],
    [mockSound]
  ])('get matches snapshot', async (sounds?: Sound[] | null) => {
    const mockSoundService: ISoundService = {
      getSounds: () => sounds
    } as any
    const controller = new SoundsController(mockSoundService, soundsControllerLogger)
    const ctx: koaRouter.RouterContext = {} as any

    await controller.get(ctx)

    expect(ctx).toMatchSnapshot()
  })
})
