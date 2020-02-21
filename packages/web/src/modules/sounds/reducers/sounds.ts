import { Reducer } from 'redux'
import { FullState, AnyAction } from '../../../types'

const reducer: Reducer<FullState, AnyAction> = (state, action) => {
  switch (action.type) {
    case 'SUCCESS/getSounds':
      return { sounds: action.payload }
  }

  return { sounds: [] }
}

export default reducer
