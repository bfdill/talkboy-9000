import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'
import axios from 'axios'

type FullState = {
  sounds: any
}

type RequestGetSoundsAction = Action<'REQUEST/getSounds'>
type SuccessGetSoundsAction = Action<'SUCCESS/getSounds'> & { payload: any }
type FailGetSoundsAction = Action<'FAILED/getSounds'> & { err: Error }

const getSounds: ThunkAction<
  void,
  FullState,
  undefined,
  RequestGetSoundsAction | SuccessGetSoundsAction | FailGetSoundsAction
> = async dispatch => {
  dispatch({ type: 'REQUEST/getSounds' })

  try {
    const payload = await axios.get('http://localhost:3000/sounds')

    dispatch({ type: 'SUCCESS/getSounds', payload })
  } catch (err) {
    dispatch({ type: 'FAILED/getSounds', err })
  }
}

export default getSounds
