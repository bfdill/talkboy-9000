import axios from 'axios'
import { GetSounds } from '../../../types'
import { Sound } from '@talkboy-9000/models'

const getSounds: GetSounds = () => async dispatch => {
  dispatch({ type: 'REQUEST/getSounds' })

  try {
    const response = await axios.get<{ sounds: Sound[] }>(
      'http://10.139.116.199:3000/sounds'
    )

    dispatch({ type: 'SUCCESS/getSounds', payload: response.data.sounds })
  } catch (err) {
    dispatch({ type: 'FAILED/getSounds', err })
  }
}

export default getSounds
