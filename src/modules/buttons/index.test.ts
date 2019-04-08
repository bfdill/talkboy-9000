import * as rpiGpio from 'rpi-gpio'
import { ButtonService, IButtonService, Button, GpioSetupConfig } from '.'
import { getMockSoundService } from '../sounds/__mocks__/soundService'
import { IPlayerService } from '../player'
import { getJestLogger } from '../winston-jest/index.test'

class TestButtonService extends ButtonService {
  getRegisteredSwitches = () => this.registeredSwitches
}

describe('modules -> buttons', () => {
  const mockOn: jest.Mock = jest.fn()
  const mockSetup: jest.Mock<void, []> = jest.fn()
  const gpio: rpiGpio.IGpio = {
    on: mockOn,
    promise: {
      setup: mockSetup
    }
  } as any
  const testButtons: Button[] = [
    { switch: '3', led: '8', soundId: '0' },
    { switch: '5', led: '10', soundId: '1' }
  ]
  const testSoundService = getMockSoundService()
  const testPlayerService: IPlayerService = {
    playFile: jest.fn()
  }
  const testButtonService = new TestButtonService(
    gpio,
    testButtons,
    testSoundService,
    testPlayerService
  )
  const buttonService: IButtonService = testButtonService
  const jestLogger = getJestLogger()

  test('has known exports', () => {
    expect(Object.keys(require('.'))).toMatchSnapshot()
  })

  afterEach(() => {
    jestLogger.callsMatchSnapshot()
  })

  describe('button service', () => {
    describe('startButtonService', () => {
      beforeEach(async () => {
        mockSetup.mockImplementation(() => Promise.resolve())

        await buttonService.startButtonService(jestLogger.logger)
      })

      test('setupFromConfig', () => {
        expect.hasAssertions()
        mockSetup.mock.calls.forEach(call => {
          expect(call).toMatchSnapshot()
        })
        jestLogger.callsMatchSnapshot()
      })

      test('registeredSwitches', () => {
        expect(testButtonService.getRegisteredSwitches()).toMatchSnapshot()
      })

      test('registerChangeListener', () => {
        expect(mockOn).toHaveBeenCalled()
      })

      test('error logs error', async () => {
        mockOn.mockImplementation(() => {
          throw new Error('borked')
        })
        const errorTest = new TestButtonService(
          gpio,
          testButtons,
          testSoundService,
          testPlayerService
        )
        const errorTestLogger = getJestLogger()

        await errorTest.startButtonService(errorTestLogger.logger)
        errorTestLogger.callsMatchSnapshot()
      })
    })

    describe('registerChangeListener', () => {
      let changeFn: Function
      beforeEach(async () => {
        mockSetup.mockImplementation(() => Promise.resolve())

        await buttonService.startButtonService(jestLogger.logger)

        changeFn = mockOn.mock.calls[0][1]
      })

      test('unknown channel(pin)', () => {
        changeFn('1', false)
        expect(testSoundService.getBySoundId).not.toHaveBeenCalled()
        expect(testPlayerService.playFile).not.toHaveBeenCalled()
      })

      test.each([false, true])('no action if active === pushed(%s)', state => {
        const sw = testButtons[0].switch
        const rs = testButtonService.getRegisteredSwitches()
        rs[sw].active = state

        changeFn(sw, !state)
        expect(testSoundService.getBySoundId).not.toHaveBeenCalled()
        expect(testPlayerService.playFile).not.toHaveBeenCalled()
      })

      test('not pushed = not active', () => {
        const sw = testButtons[0].switch
        const rs = testButtonService.getRegisteredSwitches()
        rs[sw].active = true

        changeFn(sw, true)
        expect(testSoundService.getBySoundId).not.toHaveBeenCalled()
        expect(testPlayerService.playFile).not.toHaveBeenCalled()
      })

      test('newly active getBySoundId', () => {
        expect.hasAssertions()
        testSoundService.setGetBySoundId(undefined)
        const sw = testButtons[0].switch
        const rs = testButtonService.getRegisteredSwitches()
        rs[sw].active = false

        try {
          changeFn(sw, false)
        } catch {}
        expect(testSoundService.getBySoundId).toHaveBeenCalled()
        expect(testPlayerService.playFile).not.toHaveBeenCalled()
      })

      test('newly active playFile', () => {
        testSoundService.setGetBySoundId({
          basename: 'test.mp3',
          filename: '/tmp/test.mp3',
          id: '0'
        })
        const sw = testButtons[0].switch
        const rs = testButtonService.getRegisteredSwitches()
        rs[sw].active = false

        changeFn(sw, false)
        expect(testSoundService.getBySoundId).toHaveBeenCalled()
        expect(testPlayerService.playFile).toHaveBeenCalled()
      })
    })

    describe('setupFromConfig', () => {
      beforeEach(async () => {
        mockSetup.mockImplementation(() => Promise.resolve())
        await buttonService.startButtonService(jestLogger.logger)
      })

      test('gpiop.setup', () => {
        mockSetup.mock.calls.forEach(call => {
          expect(call).toMatchSnapshot()
        })
      })

      test('config.cb', async () => {
        const config: GpioSetupConfig = {
          cb: jest.fn(),
          direction: 'out',
          edge: 'both',
          pin: '40'
        }
        await buttonService.setupFromConfig(config)
        expect(config.cb).toHaveBeenCalled()
      })
    })
  })

  describe('static members', () => {})
})
