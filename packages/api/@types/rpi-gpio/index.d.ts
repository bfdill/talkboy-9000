declare module 'rpi-gpio' {
  const GPIO: GPIO.IGpio
  export = GPIO

  namespace GPIO {
    type V1_Pins = '3' | '5' | '7' | '8' | '10' | '11' | '12' | '13' | '15' | '16' | '18' | '19' | '21' | '22' | '23' | '24' | '26'
    type V2_Pins = '3' | '5' | '7' | '8' | '10' | '11' | '12' | '13' | '15' | '16' | '18' | '19' | '21' | '22' | '23' | '24' | '26'
      | '29' | '31' | '32' | '33' | '35' | '36' | '37' | '38' | '40'
    type Pins = V1_Pins | V2_Pins

    type RETRY_OPTS = {
      retries: 100,
      minTimeout: 10,
      factor: 1
    }

    type Mode = 'mode_rpi' | 'mode_bcm'
    type Direction = 'in' | 'out' | 'low' | 'high'
    type Edge = 'none' | 'rising' | 'falling' | 'both';
    type Callback = (err?: Error) => void
    type DataCallback = (err: Error | null, value: boolean) => void

    interface IGpioPromise {
      setup(channel: Pins, direction: Direction, edge: Edge): Promise<void>
      write(channel: Pins, value: boolean): Promise<void>
      read(channel: Pins): Promise<boolean>
      destroy(): Promise<void>
    }

    interface IGpio {
      setMode(mode: Mode): void
      setup(channel: Pins, direction: Direction, edge: Edge, onSetup: Callback): void
      write(channel: Pins, value: boolean, cb: Callback): void
      output(channel: Pins, value: boolean, cb: Callback): void
      read(channel: Pins, cb: DataCallback): void
      input(channel: Pins, cb: DataCallback): void
      destroy(cb: Callback): void
      reset(): void
      promise: IGpioPromise
    }
  }
}


