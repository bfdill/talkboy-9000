import axios from 'axios'
import { MakeSound } from '../../../types'

const makeSound: MakeSound = id => async dispatch => {
  dispatch({ type: 'REQUEST/makeSounds' })

  try {
    await axios.get(`http://localhost:4000/player/${id}`)

    dispatch({ type: 'SUCCESS/makeSounds' })
  } catch (err) {
    dispatch({ type: 'FAILED/makeSounds', err })
  }
}

export default makeSound
