import * as rpiGpio from 'rpi-gpio'

const gpiop: rpiGpio.IGpioPromise = rpiGpio.promise

// type Button = {
//   ledPin?: rpiGpio.Pins
//   switchPin: rpiGpio.Pins
// }

// const one: Button = { ledPin: 7, switchPin: 8 }
// const two: Button = { ledPin: 7, switchPin: 8 }
// const three: Button = { ledPin: 7, switchPin: 8 }
// const four: Button = { ledPin: 7, switchPin: 8 }
// const five: Button = { ledPin: 7, switchPin: 8 }
// const six: Button = { ledPin: 7, switchPin: 8 }
// const seven: Button = { ledPin: 7, switchPin: 8 }
// const eight: Button = { ledPin: 7, switchPin: 8 }
// const nine: Button = { ledPin: 7, switchPin: 8 }
// const ten: Button = { ledPin: 7, switchPin: 8 }

export interface IButtonService {}

export class ButtonService implements IButtonService {
  // toggleLed = async (buttons: Button[], on: boolean) => {
  //   return gpiop.write(buttons[0].switchPin, on)
  // }

  setup = () => {
    return gpiop.setup('7', 'out', 'both').then(() => gpiop.write('7', true))
  }
}
