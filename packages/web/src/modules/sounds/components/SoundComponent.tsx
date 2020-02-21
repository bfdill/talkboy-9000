import React from 'react'
import { Sound } from '@talkboy-9000/models'
import { MakeSound } from '../../../types'

type ComponentProps = { sound: Sound }
type DispatchProps = {
  makeSound: MakeSound
}

export default (props: ComponentProps & DispatchProps) => (
  <li>
    <button onClick={() => props.makeSound(props.sound.id)}>
      {props.sound.basename}
    </button>
  </li>
)
