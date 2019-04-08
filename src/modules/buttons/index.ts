import * as winston from 'winston'
import { inspect } from 'util'
import * as rpiGpio from 'rpi-gpio'
import { ISoundService, SoundService } from '../sounds'
import { IPlayerService, PlayerService } from '../player'

export type Button = {
  switch: rpiGpio.Pins
  led: rpiGpio.Pins
  soundId: string
}

export type GpioSetupConfig = {
  pin: rpiGpio.Pins
  direction: rpiGpio.Direction
  edge: rpiGpio.Edge
  cb: () => void
}

export type SwitchState = {
  active: boolean
  pushed: boolean
  button: Button
}

const buttonList: Button[] = [
  { switch: '3', led: '8', soundId: '0' },
  { switch: '5', led: '10', soundId: '1' },
  { switch: '7', led: '12', soundId: '2' },
  { switch: '11', led: '16', soundId: '3' },
  { switch: '13', led: '18', soundId: 'rando' },
  { switch: '15', led: '22', soundId: 'rando' },
  { switch: '19', led: '24', soundId: '4' },
  { switch: '21', led: '26', soundId: '5' },
  { switch: '23', led: '32', soundId: '6' },
  { switch: '29', led: '36', soundId: '7' }
]

export interface IButtonService {
  ledOn: (button: Button, logger: winston.Logger) => Promise<void>
  setupFromConfig: (config: GpioSetupConfig) => Promise<void>
  registerChangeListener: (logger: winston.Logger) => () => void
  startButtonService: (baseLogger: winston.Logger) => Promise<void>
}

export class ButtonService implements IButtonService {
  private static instance: IButtonService | undefined
  protected readonly gpiop: rpiGpio.IGpioPromise
  protected readonly registeredSwitches: {
    [key: string]: SwitchState
  } = {}

  constructor(
    protected readonly rpiGpio: rpiGpio.IGpio,
    public readonly buttons: Button[],
    protected readonly soundService: ISoundService,
    protected readonly playerService: IPlayerService
  ) {
    this.gpiop = rpiGpio.promise
  }

  ledOn = (button: Button, logger: winston.Logger): Promise<void> => {
    logger.debug({
      button,
      method: 'ledOn'
    })

    return this.gpiop.write(button.led, true)
  }

  protected static setupCallback(
    button: Button,
    pin: rpiGpio.Pins,
    logger: winston.Logger
  ) {
    return (err: any) => {
      logger.log({
        button,
        pin,
        err,
        level: err ? 'error' : 'debug',
        message: 'setupCallback'
      })

      if (err) throw err
    }
  }

  protected static ledConfigFromButton(
    button: Button,
    logger: winston.Logger
  ): GpioSetupConfig {
    return {
      pin: button.led,
      direction: 'out',
      edge: 'none',
      cb: () => this.setupCallback(button, button.led, logger)
    }
  }

  protected static switchConfigFromButton(
    button: Button,
    logger: winston.Logger
  ): GpioSetupConfig {
    return {
      pin: button.switch,
      direction: 'in',
      edge: 'both',
      cb: () => this.setupCallback(button, button.switch, logger)
    }
  }

  setupFromConfig = (config: GpioSetupConfig) =>
    this.gpiop
      .setup(config.pin, config.direction, config.edge)
      .then(() => config.cb())

  registerChangeListener = (logger: winston.Logger) => () => {
    this.rpiGpio.on('change', (channel: rpiGpio.Pins, value: boolean) => {
      const sw = this.registeredSwitches[channel]
      const pushed = !value

      if (sw === undefined || sw === null) return
      if (sw.active === pushed) return
      if (!pushed) {
        sw.active = false
        return
      }

      sw.active = true
      const fileToPlay = this.soundService.getBySoundId(
        sw.button.soundId,
        logger
      )

      if (fileToPlay === undefined) {
        throw new Error(
          `unknown fileToPlay for button(${inspect(sw, false, 5)})`
        )
      }

      this.playerService.playFile(fileToPlay.filename, logger)
    })
  }

  startButtonService = (baseLogger: winston.Logger) => {
    const logger = baseLogger.child({
      service: 'ButtonService',
      method: 'startButtonService'
    })

    return Promise.all(
      this.buttons
        .map(btn => [
          this.setupFromConfig(ButtonService.ledConfigFromButton(btn, logger)),
          this.setupFromConfig(
            ButtonService.switchConfigFromButton(btn, logger)
          )
        ])
        .flat()
    )
      .then(() => {
        this.buttons.forEach(btn => {
          this.registeredSwitches[btn.switch] = {
            active: false,
            button: btn,
            pushed: false
          }
        })
      })
      .then(() => logger.info('setup 👜👜👜 complete'))
      .then(() =>
        logger.debug({
          message: 'registeredSwitches',
          registeredSwitches: this.registeredSwitches
        })
      )
      .then(this.registerChangeListener(logger))
      .catch(cause => {
        logger.error({
          cause,
          message: 'startButtonService error'
        })
      })
  }

  static getInstance(): IButtonService {
    if (this.instance !== undefined) return this.instance

    return new ButtonService(
      rpiGpio,
      buttonList,
      SoundService.getInstance(),
      PlayerService.getInstance()
    )
  }
}
