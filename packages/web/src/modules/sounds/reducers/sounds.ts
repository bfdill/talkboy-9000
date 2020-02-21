import { Reducer } from 'redux'
import { FullState, AnyAction } from '../../../types'

const reducer: Reducer<FullState, AnyAction> = (state, action) => {
  switch (action.type) {
    case 'FAILED/getSounds':
    case 'REQUEST/getSounds':
    case 'SUCCESS/getSounds':
      return { sounds: ['foo'] }
  }
}

export default reducer
