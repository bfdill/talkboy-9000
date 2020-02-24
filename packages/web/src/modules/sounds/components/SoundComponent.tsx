import React from 'react'
import { Sound } from '@talkboy-9000/models'
import { MakeSound } from '../../../types'

type ComponentProps = { sound: Sound }
type DispatchProps = {
  makeSound: MakeSound
}

export default (props: ComponentProps & DispatchProps) => (
  <div className="w-100 pa2 w-50-ns w-third-m w-25-l">
    <button
      className="f6 link dim br1 ba ph3 pv2 dib dark-blue w-100"
      onClick={() => props.makeSound(props.sound.id)}
    >
      {props.sound.basename}
    </button>
  </div>
)
