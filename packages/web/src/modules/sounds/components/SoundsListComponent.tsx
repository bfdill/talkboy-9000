import React from 'react'
import { connect } from 'react-redux'
import getSounds from '../actions/getSounds'
import { GetSounds, FullState } from '../../../types'
import { compose, lifecycle } from 'recompose'
import { Sound } from '@talkboy-9000/models'
import SoundComponent from './SoundComponent'


type ComponentProps = { sounds: Sound[] }
type DispatchProps = { getSounds: GetSounds }

const enhance = compose<ComponentProps, {}>(
  connect<
    {},
    DispatchProps,
    ComponentProps,
    FullState
  >(
    state => state?.sounds ? { sounds: state.sounds } : { sounds: [] },
    { getSounds }
  ),
  lifecycle<DispatchProps, FullState>({
    componentDidMount() {
      this.props.getSounds()
    }
  })
)

export default enhance(props => <ul>{props.sounds.map(s => <SoundComponent sound={s} />)}</ul>)
