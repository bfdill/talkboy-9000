import React from 'react'
import { Sound } from '@talkboy-9000/models'
import { connect } from 'react-redux'
import { FullState, MakeSound } from '../../../types'
import makeSound from '../actions/makeSound'

type ComponentProps = { sound: Sound }
type DispatchProps = {
  makeSound: MakeSound
}

export default connect<{}, DispatchProps, ComponentProps, FullState>(
  () => ({}),
  { makeSound }
)((props: any) => (
  <li>
    <button onClick={() => props.makeSound(props.sound.id)}>
      {props.sound.basename}
    </button>
  </li>
))
