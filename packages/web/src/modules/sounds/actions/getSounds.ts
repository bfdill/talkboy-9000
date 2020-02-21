import axios from 'axios'
import { GetSounds } from '../../../types'

const getSounds: GetSounds = () => async dispatch => {
  dispatch({ type: 'REQUEST/getSounds' })

  try {
    const payload = await axios.get('http://localhost:3000/sounds')

    dispatch({ type: 'SUCCESS/getSounds', payload })
  } catch (err) {
    dispatch({ type: 'FAILED/getSounds', err })
  }
}

export default getSounds
