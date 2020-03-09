import React from 'react'
import { connect } from 'react-redux'
import getSounds from '../actions/getSounds'
import makeSound from '../actions/makeSound'
import { GetSounds, FullState, MakeSound } from '../../../types'
import { compose, lifecycle } from 'recompose'
import { Sound } from '@talkboy-9000/models'
import SoundComponent from './SoundComponent'


type ComponentProps = { sounds: Sound[] }
type DispatchProps = { getSounds: GetSounds, makeSound: MakeSound }

const enhance = compose<ComponentProps & DispatchProps, {}>(
  connect<
    {},
    DispatchProps,
    ComponentProps,
    FullState
  >(
    state => state?.getSounds.sounds ? { sounds: state.getSounds.sounds } : { sounds: [] },
    { getSounds, makeSound }
  ),
  lifecycle<DispatchProps, FullState>({
    componentDidMount() {
      this.props.getSounds()
    }
  })
)

export default enhance(props => <div className="flex flex-wrap w-100">{props.sounds.map(s => <SoundComponent sound={s} makeSound={props.makeSound} />)}</div>)
