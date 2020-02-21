import React from 'react'
import { connect } from 'react-redux'
import getSounds from '../actions/getSounds'
import { GetSounds, FullState } from '../../../types'
import { compose, lifecycle } from 'recompose'


 const enhance = compose(
  connect<
    {},
    { getSounds: GetSounds },
    { sounds: any[] },
    FullState
  >(
    state => state?.sounds || {},
    { getSounds }
  ),
  lifecycle<{ getSounds: GetSounds }, FullState>({
    componentDidMount() {
      this.props.getSounds()
      console.log(this.props)
    }
  })
)

export default enhance(() => <div>Foo</div>)
