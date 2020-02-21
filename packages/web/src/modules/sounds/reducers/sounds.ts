import { Reducer } from 'redux'
import { AnyAction, GetSoundsState } from '../../../types'

const reducer: Reducer<GetSoundsState, AnyAction> = (
  state = { sounds: [] },
  action
) => {
  switch (action.type) {
    case 'SUCCESS/getSounds':
      return { sounds: action.payload }
  }

  return state
}

export default reducer
